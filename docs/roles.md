# Ruoli nel Sistema ReviewSphere

Questa è la definizione base dei ruoli come da brief.

## Cliente (`CLIENT`)
- Visualizza i prodotti nel catalogo.
- Può scrivere **una sola recensione** per ogni prodotto.
- Visualizza le recensioni dei prodotti.
- Visualizza lo storico delle proprie recensioni.

## Moderatore (`MODERATOR`)
- Può visualizzare tutte le recensioni.
- Può approvare o nascondere recensioni inappropriate (modifica stato della recensione).
- Gestisce segnalazioni (per sviluppi futuri).
- (Usa strumenti AI per generare risposte pubbliche, se implementato).

## Amministratore (`ADMIN`)
- Gestisce prodotti e categorie (CRUD completo).
- Gestisce gli utenti e i loro ruoli.
- Ha accesso alle statistiche e analisi AI (future).
- Può assumere anche i permessi del Moderatore (o ha i propri per le recensioni a seconda dell'implementazione. Per semplicità, l'Admin fa tutto nel backoffice).
