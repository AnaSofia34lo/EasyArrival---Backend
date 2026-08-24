
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
  schedule_label TEXT NOT NULL DEFAULT 'Lun-Dom',
  opening_time TIME,
  closing_time TIME,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE parkings
  ADD COLUMN IF NOT EXISTS schedule_label TEXT NOT NULL DEFAULT 'Lun-Dom',
  ADD COLUMN IF NOT EXISTS opening_time TIME,
  ADD COLUMN IF NOT EXISTS closing_time TIME,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS contact_address TEXT;

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

INSERT INTO parkings (id, name, price_per_hour, total_capacity, map_x, map_y, opening_time, closing_time, contact_phone, contact_whatsapp, contact_address) VALUES
  ('centro', 'Parqueadero Centro', 12000, 50, 62, 38, '06:00', '22:00', '+57 300 123 4567', '+573001234567', 'Calle 50 # 45-12, Medellín'),
  ('norte',  'Parqueadero Norte',   8000, 50, 30, 22, '05:30', '21:30', '+57 301 234 5678', '+573012345678', 'Carrera 65 # 80-21, Medellín'),
  ('sur',    'Parqueadero Sur',    10000, 50, 48, 70, '06:00', '23:00', '+57 302 345 6789', '+573023456789', 'Avenida 80 # 32-10, Medellín')
ON CONFLICT (id) DO NOTHING;

UPDATE parkings
SET schedule_label = 'Lun-Dom', opening_time = '06:00', closing_time = '22:00', contact_phone = '+57 300 123 4567', contact_whatsapp = '+573001234567', contact_address = 'Calle 50 # 45-12, Medellín'
WHERE id = 'centro';

UPDATE parkings
SET schedule_label = 'Lun-Dom', opening_time = '05:30', closing_time = '21:30', contact_phone = '+57 301 234 5678', contact_whatsapp = '+573012345678', contact_address = 'Carrera 65 # 80-21, Medellín'
WHERE id = 'norte';

UPDATE parkings
SET schedule_label = 'Lun-Dom', opening_time = '06:00', closing_time = '23:00', contact_phone = '+57 302 345 6789', contact_whatsapp = '+573023456789', contact_address = 'Avenida 80 # 32-10, Medellín'
WHERE id = 'sur';

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

-- Datos extra de prueba para poblar más pantallas y consultas
INSERT INTO destinations (name, latitude, longitude) VALUES
  ('Universidad Pontificia Bolivariana', 6.24440000, -75.58910000),
  ('Centro Comercial Santafé', 6.20880000, -75.56960000),
  ('Aeropuerto Olaya Herrera', 6.21680000, -75.59010000),
  ('Plaza Mayor Medellín', 6.23190000, -75.57950000),
  ('Parque Lleras', 6.20810000, -75.56650000)
ON CONFLICT (name) DO NOTHING;

INSERT INTO parkings (id, name, price_per_hour, total_capacity, map_x, map_y, latitude, longitude, opening_time, closing_time, contact_phone, contact_whatsapp, contact_address) VALUES
  ('belen', 'Parqueadero Belén', 9500, 42, 18.00, 64.00, 6.23400000, -75.60120000, '06:00', '22:00', '+57 304 111 2233', '+573041112233', 'Calle 30A # 79-45, Medellín'),
  ('laureles', 'Parqueadero Laureles', 11000, 58, 42.00, 26.00, 6.24850000, -75.59520000, '06:00', '23:00', '+57 304 222 3344', '+573042223344', 'Circular 73 # 39-22, Medellín'),
  ('poblado', 'Parqueadero El Poblado', 13500, 70, 74.00, 34.00, 6.20670000, -75.56690000, '05:30', '23:30', '+57 304 333 4455', '+573043334455', 'Carrera 43A # 7-40, Medellín'),
  ('estadio', 'Parqueadero Estadio', 7800, 36, 33.00, 18.00, 6.25720000, -75.59590000, '06:00', '21:00', '+57 304 444 5566', '+573044445566', 'Carrera 72 # 47-18, Medellín'),
  ('floresta', 'Parqueadero Floresta', 8700, 48, 27.00, 48.00, 6.25140000, -75.61150000, '06:00', '22:30', '+57 304 555 6677', '+573045556677', 'Diagonal 77B # 81-35, Medellín')
ON CONFLICT (id) DO NOTHING;

UPDATE parkings
SET schedule_label = 'Lun-Dom', opening_time = '06:00', closing_time = '22:00', contact_phone = '+57 304 111 2233', contact_whatsapp = '+573041112233', contact_address = 'Calle 30A # 79-45, Medellín'
WHERE id = 'belen';

UPDATE parkings
SET schedule_label = 'Lun-Dom', opening_time = '06:00', closing_time = '23:00', contact_phone = '+57 304 222 3344', contact_whatsapp = '+573042223344', contact_address = 'Circular 73 # 39-22, Medellín'
WHERE id = 'laureles';

UPDATE parkings
SET schedule_label = 'Lun-Dom', opening_time = '05:30', closing_time = '23:30', contact_phone = '+57 304 333 4455', contact_whatsapp = '+573043334455', contact_address = 'Carrera 43A # 7-40, Medellín'
WHERE id = 'poblado';

UPDATE parkings
SET schedule_label = 'Lun-Dom', opening_time = '06:00', closing_time = '21:00', contact_phone = '+57 304 444 5566', contact_whatsapp = '+573044445566', contact_address = 'Carrera 72 # 47-18, Medellín'
WHERE id = 'estadio';

UPDATE parkings
SET schedule_label = 'Lun-Dom', opening_time = '06:00', closing_time = '22:30', contact_phone = '+57 304 555 6677', contact_whatsapp = '+573045556677', contact_address = 'Diagonal 77B # 81-35, Medellín'
WHERE id = 'floresta';

INSERT INTO parking_destinations (parking_id, destination_id, distance_meters, walk_minutes)
SELECT v.parking_id, d.id, v.distance_meters, v.walk_minutes
FROM (VALUES
  ('belen', 700, 9),
  ('laureles', 520, 6),
  ('poblado', 300, 4),
  ('estadio', 880, 10),
  ('floresta', 610, 7)
) AS v(parking_id, distance_meters, walk_minutes)
CROSS JOIN destinations d
WHERE d.name = 'Universidad Pontificia Bolivariana'
ON CONFLICT (parking_id, destination_id) DO NOTHING;

INSERT INTO parking_availability (parking_id, availability_percent) VALUES
  ('belen', 88),
  ('laureles', 67),
  ('poblado', 73),
  ('estadio', 54),
  ('floresta', 81);

INSERT INTO availability_predictions (parking_id, destination_id, hour_label, hour_time, availability_percent)
SELECT p.id, d.id, v.hour_label, v.hour_time::TIME, v.availability_percent
FROM destinations d
CROSS JOIN parkings p
CROSS JOIN (VALUES
  ('5 PM', '17:00', 79),
  ('6 PM', '18:00', 71),
  ('7 PM', '19:00', 64),
  ('8 PM', '20:00', 58),
  ('9 PM', '21:00', 49)
) AS v(hour_label, hour_time, availability_percent)
WHERE d.name = 'Universidad Pontificia Bolivariana'
  AND p.id = 'laureles'
ON CONFLICT (parking_id, destination_id, hour_label, prediction_date) DO NOTHING;
