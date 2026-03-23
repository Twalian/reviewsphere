# RBAC Enforcement Walkthrough

## 1. Advanced Admin Dashboard
- **Aggregation queries for reviews trend**: Implementato via `TruncMonth` e `Count` su `Review` (filtrando solo quelle `APPROVED`). 
- **Most Reviewed Categories logic**: Implementato annotando le categorie con il count dei loro prodotti recensiti. 
- **Negative Rating Alerts logic**: Implementato filtrando i prodotti con average_rating (calcolato solo per le recensioni approvate) < 2.5
- **Unified Dashboard API endpoint**: L'endpoint `GET /api/dashboard-stats/` è riservato agli utenti ADMIN.

## 2. Reporting System
- **Report model and migrations**: Implementato e unito allo schema, include Foreign Keys a `Review` e all'utente `reporter`. Aggiunti i vari `PENDING` / `RESOLVED`.
- **`report-review` API per i Client**: `POST /api/reviews/<uuid>/report/` utilizzabile solo dai ruoli `CLIENT` previa autenticazione. Un utente non può segnalare se stesso o avviare segnalazioni doppie.
- **`ModeratorReportListView` per Moderator e Admin**: Implementato in `GET /api/reviews/reports/?status=PENDING` accessibile da `MODERATOR` o `ADMIN`. Lista di tutti i report in attesa.
- **Report resolution logic**: Implementato in `PATCH /api/reviews/reports/<id>/resolve/` accessibile da `MODERATOR` o `ADMIN`. Permette di passare un payload `{"action": "hide" | "keep"}` per variare il livello visibilità della recensione segnalata.

## 3. Global Verification
- Sono stati creati script operativi a livello di bash (`test_endpoints.sh`) per la validazione di ogni end-point del sistema con utenti `CLIENT`, `ADMIN` e `MODERATOR` attivi.
- Tutti i test d'integrazione verificano ritorni HTTP (200 OK, 201 CREATED) garantendo il blocco autorizzativo esatto per il controllo 403 FORBIDDEN.
