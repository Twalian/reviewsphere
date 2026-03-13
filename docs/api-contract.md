# API Contract (Initial Draft)

Questo documento definisce i contratti per gli endpoint API. Verrà esteso e dettagliato mano a mano che le feature vengono implementate.

## Auth

### Login (Obtain Token)
- **URL**: `/api/auth/token/`
- **Method**: `POST`
- **Request**:
  ```json
  {
    "username": "...",
    "password": "..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "refresh": "TOKEN_STR",
    "access": "TOKEN_STR"
  }
  ```
- **Note**: Decoded `access` token includes `user_id`, `username`, and `role`.

### Token Refresh
- **URL**: `/api/auth/token/refresh/`
- **Method**: `POST`
- **Request**:
  ```json
  {
    "refresh": "REFRESH_TOKEN_STR"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access": "NEW_ACCESS_TOKEN_STR"
  }
  ```

### Register
- **URL**: `/api/auth/register/`
- **Method**: `POST`
- **Request**:
  ```json
  {
    "username": "...",
    "email": "...",
    "password": "..."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "username": "...",
    "email": "...",
    "role": "CLIENT"
  }
  ```

### Get My Profile
- **URL**: `/api/auth/me/`
- **Method**: `GET`
- **Authentication**: Required (JWT or Session)
- **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "username": "...",
    "email": "...",
    "role": "CLIENT",
    "is_staff": false
  }
  ```

---

## Permissions Matrix

| Risorsa | Azione | Cliente | Moderatore | Admin |
| :--- | :--- | :---: | :---: | :---: |
| **Prodotti** | Visualizzare | ✅ | ✅ | ✅ |
| | Creare/Modificare/Eliminare | ❌ | ❌ | ✅ |
| **Categorie** | Visualizzare | ✅ | ✅ | ✅ |
| | Creare/Modificare/Eliminare | ❌ | ❌ | ✅ |
| **Recensioni** | Leggere (Tutte) | ✅ | ✅ | ✅ |
| | Scrivere (Proprie) | ✅ | ✅ | ✅ |
| | Modificare (Stato/Modifica) | ❌ | ✅ (Solo Stato) | ✅ |
| | Eliminare | ❌ | ❌ | ✅ |
| **Utenti** | Registrarsi | ✅ | ✅ | ✅ |
| | Gestire (Ruoli/Status) | ❌ | ❌ | ✅ |

## Catalog
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

## Reviews
- `GET /api/reviews/`
- `POST /api/reviews/`
- `GET /api/reviews/{id}/`
- `PUT/PATCH /api/reviews/{id}/`
- `DELETE /api/reviews/{id}/`
- `GET /api/reviews/mine/` (o simile, da definire)
- `GET /api/products/{id}/reviews/` (o filtro query params `?product={id}`)
