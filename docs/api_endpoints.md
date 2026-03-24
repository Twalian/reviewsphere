# ReviewSphere — API Endpoints Reference

> Base URL: `http://127.0.0.1:8000`  
> Autenticazione: **JWT Bearer Token**  
> Header da aggiungere: `Authorization: Bearer <access_token>`

---

## Dati reali nel DB (per i test)

| Utente       | Ruolo     | ID |
|--------------|-----------|----|
| sabri        | ADMIN     | 1  |
| client_test  | CLIENT    | 2  |
| client_test2 | CLIENT    | 3  |
| mod_test     | MODERATOR | 4  |

| Prodotto        | ID |
|-----------------|----|
| iPhone 15       | 2  |
| Samsung S9      | 3  |
| Xiaomi Poco M6  | 4  |
| iPhone 15 Pro Max | 5 |

| UUID Recensione                              | Autore       |
|----------------------------------------------|--------------|
| fb9c76ff-265e-4806-b46f-b669b4707951         | client_test2 |
| 6cc9808d-8dc2-42a2-ba2d-1c159fae63b2         | client_test  |

---

## 🔐 Autenticazione

### 1. Ottieni Token JWT
```
POST /api/token/
```
Body:
```json
{ "username": "sabri", "password": "<password>" }
```
→ Risposta: `{ "access": "...", "refresh": "..." }` — usa `access` come Bearer Token.

### 2. Refresh Token
```
POST /api/token/refresh/
```
Body:
```json
{ "refresh": "<refresh_token>" }
```

---

## 👤 Utenti (`/api/users/`)

### 3. Registra nuovo utente *(nessun token)*
```
POST /api/users/register/
```
Body:
```json
{ "username": "nuovo_utente", "email": "test@test.com", "password": "Password123!" }
```
> ⚠️ Il ruolo viene impostato automaticamente a `CLIENT`.

### 4. Profilo utente loggato *(qualsiasi token)*
```
GET /api/users/me/
```

### 5. Lista utenti *(token ADMIN)*
```
GET /api/users/admin/
```

### 6. Dettaglio utente *(token ADMIN)*
```
GET /api/users/admin/2/
```

### 7. Modifica utente *(token ADMIN)*
```
PATCH /api/users/admin/2/
```
Body (campi da aggiornare):
```json
{ "email": "nuova@email.com" }
```

### 8. Elimina utente *(token ADMIN)*
```
DELETE /api/users/admin/2/
```

---

## 📦 Prodotti (`/api/products/`)

### 9. Lista prodotti *(nessun token)*
```
GET /api/products/
```
Filtri disponibili: `?category=1`, `?status=AVAILABLE`, `?brand=Apple`

### 10. Dettaglio prodotto *(nessun token)*
```
GET /api/products/4/
```

### 11. Crea prodotto *(token ADMIN)*
```
POST /api/products/
```
Body:
```json
{
  "name": "Nuovo Prodotto",
  "description": "Descrizione del prodotto",
  "category": 1,
  "brand": "BrandName",
  "price": "299.99",
  "image_url": "https://example.com/img.jpg",
  "status": "AVAILABLE"
}
```

### 11b. Confronto Prodotti AI *(token CLIENT)*
```
POST /api/products/compare/
```
Body:
```json
{ "product_ids": [2, 5, 10] }
```
> ⚠️ Fornisci almeno due ID. Restituisce un testo di confronto e una raccomandazione.

### 12. Modifica prodotto *(token ADMIN)*
```
PATCH /api/products/4/
```
Body (campi da aggiornare):
```json
{ "price": "199.99", "status": "inactive" }
```

### 13. Elimina prodotto *(token ADMIN)*
```
DELETE /api/products/4/
```

### 14. Top-rated products *(token ADMIN)*
```
GET /api/products/top-rated/
```

### 15. Worst-rated products *(token ADMIN)*
```
GET /api/products/worst-rated/
```

---

## 🗂️ Categorie (`/api/categories/`)

### 16. Lista categorie *(nessun token)*
```
GET /api/categories/
```

### 17. Crea categoria *(token ADMIN)*
```
POST /api/categories/
```
Body:
```json
{ "name": "Elettronica", "description": "Dispositivi elettronici" }
```

### 18. Modifica categoria *(token ADMIN)*
```
PATCH /api/categories/1/
```

### 19. Elimina categoria *(token ADMIN)*
```
DELETE /api/categories/1/
```

---

## ⭐ Recensioni (`/api/reviews/`)

### 20. Recensioni di un prodotto *(nessun token)*
```
GET /api/reviews/product/4/
```

### 21. Le mie recensioni *(token CLIENT)*
```
GET /api/reviews/mine/
```

### 22. Aggiungi recensione *(token CLIENT)*
```
POST /api/reviews/add/
```
Body:
```json
{
  "title": "Ottimo prodotto",
  "vote": 4,
  "description": "Molto soddisfatto dell'acquisto, lo consiglio.",
  "product": 2
}
```
> ⚠️ `vote` deve essere tra 1 e 5. Non puoi recensire due volte lo stesso prodotto → `409 Conflict`.

### 23. Aggiorna recensione *(token proprietario)*
```
PATCH /api/reviews/fb9c76ff-265e-4806-b46f-b669b4707951/update/
```
Body (campi opzionali):
```json
{ "title": "Titolo aggiornato", "vote": 2, "description": "Ho cambiato idea..." }
```

### 24. Elimina recensione *(token proprietario o ADMIN)*
```
DELETE /api/reviews/6cc9808d-8dc2-42a2-ba2d-1c159fae63b2/delete/
```

### 25. Approva recensione *(token MODERATOR o ADMIN)*
```
PATCH /api/reviews/fb9c76ff-265e-4806-b46f-b669b4707951/approve/
```
Nessun body richiesto.

### 26. Nascondi recensione *(token MODERATOR o ADMIN)*
```
PATCH /api/reviews/fb9c76ff-265e-4806-b46f-b669b4707951/hide/
```
Nessun body richiesto.

### 27. Segnala recensione *(token CLIENT — non tua)*
```
POST /api/reviews/fb9c76ff-265e-4806-b46f-b669b4707951/report/
```
Token: `client_test` (non `client_test2`, che è l'autore di questa recensione)  
Body:
```json
{ "reason": "Contenuto inappropriato o fuorviante." }
```
> ⚠️ Non puoi segnalare la tua stessa recensione → `400 Bad Request`.

### 28. AI Summary recensioni prodotto *(token richiesto)*
```
GET /api/reviews/4/ai-summary/
```
> ⚠️ Richiede chiave API nel `.env`. Se non configurata → `503 Service Unavailable`.

### 28b. Lista Segnalazioni (Reports) *(token MODERATOR o ADMIN)*
```
GET /api/reviews/reports/
```
Filtri: `?status=PENDING` o `?status=RESOLVED`

---

## 📊 Dashboard Admin (`/api/dashboard-stats/`)

### 29. Dashboard Stats *(token ADMIN)*
```
GET /api/dashboard-stats/
```
Risposta include:
- `trend` — recensioni approvate per mese
- `top_categories` — top 5 categorie più recensite
- `alerts` — prodotti con rating medio < 2.5
- `summary` — totali generali

---

## 🔑 Riepilogo permessi

| Endpoint                             | Nessun token | CLIENT | MODERATOR  | ADMIN  |
|--------------------------------------|:------------:|:------:|:---------: |:-----: |
| GET prodotti / categorie             | ✅           | ✅     | ✅        | ✅    |
| GET recensioni prodotto              | ✅           | ✅     | ✅        | ✅    |
| POST register                        | ✅           | ✅     | ✅        | ✅    |
| POST token                           | ✅           | ✅     | ✅        | ✅    |
| GET /me                              | ❌           | ✅     | ✅        | ✅    |
| GET /mine                            | ❌           | ✅     | ❌        | ❌    |
| POST add review                      | ❌           | ✅     | ❌        | ❌    |
| POST report (segnala)                | ❌           | ✅     | ❌        | ❌    |
| POST compare (confronto AI)          | ❌           | ✅     | ✅        | ✅    |
| PATCH update / DELETE review         | ❌           | ✅ (A) | ❌        | ✅    |
| approve / hide review                | ❌           | ❌     | ✅        | ✅    |
| GET reports (segnalazioni)           | ❌           | ❌     | ✅        | ✅    |
| CRUD prodotti / categorie            | ❌           | ❌     | ❌        | ✅    |
| top-rated / worst-rated              | ❌           | ❌     | ❌        | ✅    |
| dashboard-stats                      | ❌           | ❌     | ❌        | ✅    |
| /api/users/admin/                    | ❌           | ❌     | ❌        | ✅    |

*(A) = Solo proprie recensioni*
