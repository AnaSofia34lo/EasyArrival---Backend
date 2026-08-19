
-- Destinos que los usuarios buscan
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Parqueaderos
CREATE TABLE IF NOT EXISTS parkings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_per_hour INTEGER NOT NULL,
  total_capacity INTEGER NOT NULL DEFAULT 50,
  map_x DECIMAL(5, 2) NOT NULL,
  map_y DECIMAL(5, 2) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Distancia y tiempo caminando desde un parqueadero hasta un destino
CREATE TABLE IF NOT EXISTS parking_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parking_id TEXT NOT NULL REFERENCES parkings(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  distance_meters INTEGER NOT NULL,
  walk_minutes INTEGER NOT NULL,
  UNIQUE (parking_id, destination_id)
);

-- Disponibilidad actual (snapshot en tiempo real)
CREATE TABLE IF NOT EXISTS parking_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parking_id TEXT NOT NULL REFERENCES parkings(id) ON DELETE CASCADE,
  availability_percent INTEGER NOT NULL CHECK (availability_percent BETWEEN 0 AND 100),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Proyecciones de disponibilidad por hora (IA)
CREATE TABLE IF NOT EXISTS availability_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parking_id TEXT NOT NULL REFERENCES parkings(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  hour_label TEXT NOT NULL,
  hour_time TIME,
  availability_percent INTEGER NOT NULL CHECK (availability_percent BETWEEN 0 AND 100),
  prediction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parking_id, destination_id, hour_label, prediction_date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_parking_availability_parking_id ON parking_availability(parking_id);
CREATE INDEX IF NOT EXISTS idx_parking_availability_recorded_at ON parking_availability(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_availability_predictions_parking_id ON availability_predictions(parking_id);
CREATE INDEX IF NOT EXISTS idx_parking_destinations_destination_id ON parking_destinations(destination_id);

-- Datos iniciales (coinciden con el frontend mock)
INSERT INTO destinations (name) VALUES ('Universidad de Medellín')
ON CONFLICT (name) DO NOTHING;

INSERT INTO parkings (id, name, price_per_hour, total_capacity, map_x, map_y) VALUES
  ('centro', 'Parqueadero Centro', 12000, 50, 62, 38),
  ('norte',  'Parqueadero Norte',   8000, 50, 30, 22),
  ('sur',    'Parqueadero Sur',    10000, 50, 48, 70)
ON CONFLICT (id) DO NOTHING;

INSERT INTO parking_destinations (parking_id, destination_id, distance_meters, walk_minutes)
SELECT v.parking_id, d.id, v.distance_meters, v.walk_minutes
FROM (VALUES
  ('centro', 450, 5),
  ('norte',  900, 8),
  ('sur',    260, 3)
) AS v(parking_id, distance_meters, walk_minutes)
CROSS JOIN destinations d
WHERE d.name = 'Universidad de Medellín'
ON CONFLICT (parking_id, destination_id) DO NOTHING;

INSERT INTO parking_availability (parking_id, availability_percent) VALUES
  ('centro', 91),
  ('norte',  76),
  ('sur',    63);

INSERT INTO availability_predictions (parking_id, destination_id, hour_label, hour_time, availability_percent)
SELECT 'centro', d.id, v.hour_label, v.hour_time::TIME, v.availability_percent
FROM destinations d
CROSS JOIN (VALUES
  ('5 PM', '17:00', 60),
  ('6 PM', '18:00', 72),
  ('7 PM', '19:00', 91),
  ('8 PM', '20:00', 83),
  ('9 PM', '21:00', 75)
) AS v(hour_label, hour_time, availability_percent)
WHERE d.name = 'Universidad de Medellín'
ON CONFLICT (parking_id, destination_id, hour_label, prediction_date) DO NOTHING;
