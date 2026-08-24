# EasyArrival Backend

Backend en NestJS siguiendo Clean Architecture.

## Funcionalidades implementadas

1. Mostrar distancia entre parqueadero y destino.
2. Mostrar parqueaderos cercanos al destino final.
3. Mostrar disponibilidad actual y disponibilidad estimada con IA.

## Arquitectura

- `domain`: entidades, contratos de repositorio y contrato del servicio IA.
- `application`: casos de uso (reglas de aplicación).
- `infrastructure`: adaptadores concretos (Supabase y proveedor IA).
- `presentation`: controladores HTTP.

## Endpoints

### Listar parqueaderos

- `GET /parkings`

### Obtener parqueadero por id

- `GET /parkings/:id`

### Distancia de un parqueadero a un destino

- `GET /parkings/:id/distance?destination=Universidad de Medellín`

Respuesta ejemplo:

```json
{
  "parkingId": "centro",
  "destinationId": "uuid",
  "distanceMeters": 450,
  "walkMinutes": 5
}
```

### Parqueaderos cercanos a un destino

- `GET /parkings/nearby?destination=Universidad de Medellín&limit=5`

Incluye distancia, disponibilidad actual y disponibilidad estimada por IA.

### Disponibilidad de un parqueadero específico

- `GET /parkings/:id/availability?destination=Universidad de Medellín`

Incluye:

- disponibilidad actual (snapshot)
- disponibilidad estimada por IA
- porcentaje de confianza
- explicación breve

### Buscar cualquier parqueadero y ver disponibilidad

- `GET /parkings/availability/search?query=centro&limit=5`

## Integración IA reutilizable

Se implementó un servicio IA desacoplado: `ParkingAiService`.

Implementación concreta: `LlmParkingAiService`.

Soporta:

- Gemini (`AI_PROVIDER=gemini`)
- DeepSeek (`AI_PROVIDER=deepseek`)
- Fallback heurístico local (`AI_PROVIDER=heuristic` o si falla API)

Esto permite usar la IA en múltiples casos de uso sin acoplarse al controlador o al repositorio.

## Variables de entorno

Crea un `.env` en `backend/`:

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# AI_PROVIDER: gemini | deepseek | heuristic
AI_PROVIDER=heuristic

# Gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash

# DeepSeek
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

Notas:

- No existe proveedor realmente gratuito e ilimitado en producción.
- Para desarrollo académico rápido, usa `AI_PROVIDER=heuristic` sin costos.
- Si tienes key gratis de Gemini o DeepSeek, el backend la usa automáticamente.

## Instalar y ejecutar

```bash
npm install
npm run build
npm run start:dev
```

## SQL base

El esquema de tablas está en `supabase/schema.sql`.

Debes ejecutarlo en tu proyecto Supabase para tener:

- `parkings`
- `destinations`
- `parking_destinations`
- `parking_availability`
- `availability_predictions`
