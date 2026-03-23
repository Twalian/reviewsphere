# ReviewSphere: Guida Completa ai Test in Postman

Questa guida raccoglie tutti gli endpoint testati nel sistema, spiegati passaggio per passaggio. Ogni sezione include l'indirizzo della richiesta (`URL`), il `Metodo`, il `Token` da inserire nella tab *Authorization -> Bearer Token*, il `Body` da inserire nella tab *Body -> raw -> JSON* e l'`Output Atteso`.

---

## 🔐 1. Ottenere i Token di Accesso
Prima di testare gli endpoint, dovrai ottenere i token per i diversi utenti. L'operazione non richiede alcun token di base.

### Ottenere Token `ADMIN` (sabri)
- **Richiesta:** `POST`
- **URL:** `http://127.0.0.1:8000/api/token/`
- **Token:** *(Nessuno)*
- **Body:**
```json
{
    "username": "sabri",
    "password": "Asiatiscelgo96"
}
```
- **Output Atteso:** `200 OK` con il payload `{"access": "eyJ...", "refresh": "eyJ..."}`. Copiare il valore `"access"` che chiameremo **[TOKEN_ADMIN]**.

### Ottenere Token `MODERATOR` (mod_test)
- Ripeti la richiesta `POST` a `/api/token/` con body:
```json
{
    "username": "mod_test",
    "password": "mod123"
}
```
Copia l'`access` token e chiameremo questo **[TOKEN_MOD]**.

### Ottenere Token `CLIENT` (client_test)
- Ripeti la richiesta `POST` a `/api/token/` con body:
```json
{
    "username": "client_test",
    "password": "client123"
}
```
Copia l'`access` token e chiameremo questo **[TOKEN_CLIENT]**.

---

## 📊 2. Dashboard Admin

### Richiedere Statistiche Globali (Solo Admin)
- **Richiesta:** `GET`
- **URL:** `http://127.0.0.1:8000/api/dashboard-stats/`
- **Token:** `[TOKEN_ADMIN]`
- **Body:** *(Nessuno)*
- **Output Atteso:** `200 OK`. Ritorna un JSON aggregato contenente l'andamento mensile (`trend`), le top 5 categorie per volume recensioni (`top_categories`), i prodotti con rating < 2.5 (`alerts`) e le somme totali (`summary`).

---

## 🛠️ 3. Segnalazioni e Moderazione (Reporting System)

### 3.1 Un Client segnala una recensione esistente
- **Richiesta:** `POST`
- **URL:** `http://127.0.0.1:8000/api/reviews/<UUID_RECENSIONE>/report/` *(sostituire <UUID_RECENSIONE> con l'ID di una recensione vera non scritta da client_test)*
- **Token:** `[TOKEN_CLIENT]`
- **Body:**
```json
{
    "reason": "Linguaggio offensivo e non veritiero"
}
```
- **Output Atteso:** `201 Created`. Torna il messaggio `✅ Segnalazione creata con successo!` e il nuovo ID del report generato (es. `"report_id": "1"`).


### 3.2 Il Moderatore / Admin legge le segnalazioni
- **Richiesta:** `GET`
- **URL:** `http://127.0.0.1:8000/api/reviews/reports/`
- **Token:** `[TOKEN_MOD]` oppure `[TOKEN_ADMIN]`
- **Body:** *(Nessuno)*
- **Output Atteso:** `200 OK`. Restituisce una lista di tutti i report con `status` uguale a `"PENDING"`. Individuare da essa l'id numerico relativo al report creato allo step precedente (es. `1`).


### 3.3 Il Moderatore / Admin risolve il report (oscurando la recensione)
- **Richiesta:** `PATCH`
- **URL:** `http://127.0.0.1:8000/api/reviews/reports/1/resolve/` *(sostituire 1 con l'ID vero del report)*
- **Token:** `[TOKEN_MOD]` oppure `[TOKEN_ADMIN]`
- **Body:**
```json
{
    "action": "hide"
}
```
- **Output Atteso:** `200 OK`. Il messaggio indicherà `✅ Segnalazione risolta con successo!`. Il report assumerà status `RESOLVED` e la recensione collegata diventerà invisibile (`ReviewStatus.HIDDEN`). *(Nota: usare `"keep"` al posto di `"hide"` lascerebbe intatta la visibilità della recensione).*

---

## 📦 4. Prodotti e Categorie (Catalog)

### 4.1 Creare una Categoria (Solo Admin)
- **Richiesta:** `POST`
- **URL:** `http://127.0.0.1:8000/api/categories/`
- **Token:** `[TOKEN_ADMIN]`
- **Body:**
```json
{
    "name": "Elettronica Base",
    "description": "Articoli entry level"
}
```
- **Output Atteso:** `201 Created`. Crea la categoria nel DB e restituisce l'`id` assegnato.

### 4.2 Leggere la Lista Prodotti (Pubblico)
- **Richiesta:** `GET`
- **URL:** `http://127.0.0.1:8000/api/products/`
- **Token:** *(Nessuno - endpoint non protetto)*
- **Body:** *(Nessuno)*
- **Output Atteso:** `200 OK`. Lista di prodotti con filtri applicabili tramite Query Params (`?brand=Apple`).

### 4.3 Prodotti Peggiori (Solo Admin)
- **Richiesta:** `GET`
- **URL:** `http://127.0.0.1:8000/api/products/worst-rated/`
- **Token:** `[TOKEN_ADMIN]`
- **Body:** *(Nessuno)*
- **Output Atteso:** `200 OK`. Array dei 10 peggiori prodotti ordinati per media voto crescente analizzando le singole `Review` relazionate di natura `APPROVED`.

---

## ⭐ 5. Recensioni (Reviews)

### 5.1 Il Client inserisce una Recensione
- **Richiesta:** `POST`
- **URL:** `http://127.0.0.1:8000/api/reviews/add/`
- **Token:** `[TOKEN_CLIENT]`
- **Body:**
```json
{
    "title": "Eccezionale",
    "vote": 5,
    "description": "Ottima qualità costruttiva, lo riprenderei mille volte.",
    "product": 2
}
```
- **Output Atteso:** `201 Created`. Viene archiviata la recensione. Se l'utente ha già recensito il prodotto numero 2, riceverà un errore `409 Conflict`.

### 5.2 Leggere le Recensioni di un Prodotto (Pubblico)
- **Richiesta:** `GET`
- **URL:** `http://127.0.0.1:8000/api/reviews/product/2/` *(dove 2 è l'ID di un prodotto)*
- **Token:** *(Nessuno)*
- **Body:** *(Nessuno)*
- **Output Atteso:** `200 OK` Restituisce array JSON con le sole recensioni destinate al prodotto 2.

### 5.3 Il Moderatore approva una recensione pendente
- **Richiesta:** `PATCH`
- **URL:** `http://127.0.0.1:8000/api/reviews/<UUID_RECENSIONE>/approve/`
- **Token:** `[TOKEN_MOD]` oppure `[TOKEN_ADMIN]`
- **Body:** *(Nessuno - l'azione è indotta dall'url stesso)*
- **Output Atteso:** `200 OK` con lo status della recensione aggiornato su `"APPROVED"`. In questo modo la recensione sarà visibile nella pagina dei prodotti pubblici.
