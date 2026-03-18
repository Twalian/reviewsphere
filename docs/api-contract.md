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

  **Response 200:**
  ```json
  [
    {
      "id": 1,
      "name": "iPhone 15",
      "description": "Smartphone Apple",
      "category": 1,
      "brand": "Apple",
      "price": "999.00",
      "image_url": "",
      "status": "available"
    }
  ]
- `POST /api/products/`
- `GET /api/products/{id}/`
- `PUT/PATCH /api/products/{id}/`
- `DELETE /api/products/{id}/`

## Reviews
- `GET /api/reviews/mine/`
- `POST /api/reviews/add/`
- `GET /api/reviews/<product_id>/`
- `GET /api/reviews/<product_id>/ai-summary/`
- `PUT/PATCH /api/reviews/{id}/`
- `DELETE /api/reviews/{id}/`


- `POST /api/reviews/add/`
### Crea Review
- **URL**: `/api/reviews/add/`
- **Method**: `POST`
- **Authentication**: Required (JWT)
- **Request**:
```json
  {
    "title": "Maglia stupenda!",
    "vote": 5,
    "description": "...",
    "product": 1
  }
```
- **Response (201 Created)**:
```json
  {
    "id": "uuid...",
    "title": "Maglia stupenda!",
    "vote": 5,
    "username": "mario_rossi",
    "product_name": "iPhone 15",
    "description": "...",
    "date": "2025-01-15T10:30:00Z",
    "status": "PENDING",
    "sentiment": "positive",
    "pros": [],
    "cons": []
  }
```
- **Errors**:
  - `400` → dati non validi
  - `409` → "Hai già recensito questo prodotto"



- `GET /api/reviews/mine/`
### Restituisce tutte le reviews create dall'utente autenticato
 **URL**: `/api/reviews/mine/`
- **Method**: `GET`
- **Authentication**: Required (JWT)
**Response (200 OK)**:
```json
  [
    {
    "id": "uuid...",
    "title": "Maglia stupenda!",
    "vote": 5,
    "username": "mario_rossi",
    "product_name": "iPhone 15",
    "description": "...",
    "date": "2025-01-15T10:30:00Z",
    "status": "PENDING",
    "sentiment": "positive",
    "pros": [],
    "cons": []
    }
  ]
  ```
- **Errors**:
  - `401` →"Autenticazione richiesta"


-`GET /api/reviews/<product_id>/`
### Restituisce le reviews di un prodotto tramite il product_id
 **URL**: `/api/reviews/<product_id>/'
- **Method**: `GET`
- **Authentication**: Required (JWT)
**Response (200 OK)**:
```json
  [
    {
    "id": "uuid...",
    "title": "Maglia stupenda!",
    "vote": 5,
    "username": "mario_rossi",
    "product_name": "iPhone 15",
    "description": "...",
    "date": "2025-01-15T10:30:00Z",
    "status": "PENDING",
    "sentiment": "positive",
    "pros": [],
    "cons": []
    }
  ]
  ```
- **Errors**:
  - `404` → "Prodotto non trovato"

- `GET /api/reviews/<product_id>/ai-summary/`
### Restituisce il sommario generato da AI delle reviews di un prodotto tramite il product_id
 **URL**: `/api/reviews/<product_id>/ai-summary/`
- **Method**: `GET`
- **Authentication**: Required (JWT)
**Response (200 OK)**
```json
{
  "summary": "Prodotto di ottima qualità, consigliato per uso quotidiano.",
  "pros": ["Qualità eccellente", "Buon rapporto qualità-prezzo"],
  "cons": ["Taglia piccola", "Colori limitati"]
}
```
- **Errors**:
  - `404` → " Nessuna recensione approvata per questo prodotto"
  - `503` → "Servizio non disponibile"
