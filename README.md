# ReviewSphere - Community-Driven Product Reviews

ReviewSphere is a platform for community-driven product reviews with AI-powered sentiment analysis, synthesis, and comparison features.

## 🚀 Avvio Rapido

### 1. Backend (Django REST Framework)
Il backend gestisce l'API, l'autenticazione JWT e l'integrazione AI.

1. **Requisiti**: Assicurati di avere Python 3.10+ installato.
2. **Ambiente Virtuale**: 
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # (Windows: venv\Scripts\activate)
   ```
3. **Dipendenze**: `pip install -r requirements.txt`
4. **Configurazione**: Copia `.env.example` in `.env` e inserisci le tue chiavi API (vedi sezione AI sotto).
5. **Database**: `python manage.py migrate`
6. **Esecuzione**: `python manage.py runserver` (disponibile su http://localhost:8000)

### 2. Frontend (React)
Il frontend è una Single Page Application moderna e reattiva.

1. **Requisiti**: Node.js v16+ e npm.
2. **Installazione**:
   ```bash
   cd frontend
   npm install
   ```
3. **Esecuzione**: `npm start` (disponibile su http://localhost:3000)

---

## 🔑 Credenziali di Accesso Admin
Per testare le funzionalità di amministrazione e moderazione:
- **Username**: `admin`
- **Password**: `admin1234`

---

## 🛠️ Configurazione AI

Il progetto supporta più provider AI (**Google Gemini** e **OpenRouter**). 

### 1. File .env
Assicurati di avere il file `.env` nella root del progetto con i seguenti valori:

```env
# Provider Attivo (gemini | openrouter)
AI_PROVIDER=gemini

# Google Gemini (Raccomandato)
GEMINI_API_KEY=tua_chiave_google

# OpenRouter (opzionale)
OPENROUTER_API_KEY=tua_chiave_openrouter
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct
```

### 2. Funzionalità AI Implementate
- **Sentiment Analysis**: Analisi automatica del tono della recensione (italiano/inglese).
- **Synthesis Reviews**: Riepilogo intelligente di decine di recensioni in un paragrafo conciso (in italiano).
- **Product Comparison**: Confronto diretto tra prodotti selezionati con raccomandazione finale (in italiano).

---

## 📂 Struttura del Progetto
- `/catalog`: Gestione prodotti, categorie e statistiche dashboard.
- `/reviews`: Gestione recensioni, segnalazioni e provider AI.
- `/users`: Gestione utenti, profili e permessi RBAC.
- `/frontend`: Applicazione React con sistema di design premium.
