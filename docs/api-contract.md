# API Contract (Initial Draft)

Questo documento definisce i contratti per gli endpoint API. Verrà esteso e dettagliato mano a mano che le feature vengono implementate.

## Auth (Persona 1)
- `POST /api/auth/token/`
  - Payload Auth
- `POST /api/auth/token/refresh/`
- `POST /api/auth/register/` (Da definire payload esatto con UI)

## Catalog (Persona 2)
### Categories
- `GET /api/categories/`
- `POST /api/categories/`
- `GET /api/categories/{id}/`
- `PUT/PATCH /api/categories/{id}/`
- `DELETE /api/categories/{id}/`

### Products
- `GET /api/products/`
- `POST /api/products/`
- `GET /api/products/{id}/`
- `PUT/PATCH /api/products/{id}/`
- `DELETE /api/products/{id}/`

## Reviews (Persona 3)
- `GET /api/reviews/`
- `POST /api/reviews/`
- `GET /api/reviews/{id}/`
- `PUT/PATCH /api/reviews/{id}/`
- `DELETE /api/reviews/{id}/`
- `GET /api/reviews/mine/` (o simile, da definire)
- `GET /api/products/{id}/reviews/` (o filtro query params `?product={id}`)
