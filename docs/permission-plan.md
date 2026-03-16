# Permission Plan

## Product endpoints
- GET /products/ -> accesso autenticato
- GET /products/{id}/ -> accesso autenticato
- POST /products/ -> solo ADMIN
- PATCH /products/{id}/ -> solo ADMIN
- DELETE /products/{id}/ -> solo ADMIN

## Review endpoints
- POST /reviews/ -> solo CLIENT
- GET /reviews/my/ -> solo CLIENT autenticato
- GET /products/{id}/reviews/ -> CLIENT vede solo review approvate
- GET /reviews/moderation/ -> MODERATOR o ADMIN
- PATCH /reviews/{id}/approve/ -> MODERATOR o ADMIN
- PATCH /reviews/{id}/hide/ -> MODERATOR o ADMIN
- DELETE /reviews/{id}/ -> MODERATOR o ADMIN

## Auth endpoints
- POST /auth/register/ -> pubblico
- POST /auth/login/ -> pubblico
- GET /auth/me/ -> autenticato

## Note
- I controlli object-level non coprono automaticamente la create.
- La regola "un utente può lasciare una sola recensione per prodotto" va controllata in serializer o model constraint.
- Gli stati review devono essere concordati con Persona 3.