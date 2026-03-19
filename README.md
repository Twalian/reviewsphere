# ReviewSphere

## Setup
1. Clone the repository
2. Create virtual environment: `python3 -m venv venv`
3. Activate environment: `source venv/bin/activate` 
   - Windows: `venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env`
6. Run migrations: `python manage.py migrate`
7. Create superuser: `python manage.py createsuperuser`
8. Run server: `python manage.py runserver`

## 🛠️ Configurazione AI

Il progetto supporta più provider AI (**Google Gemini** e **OpenRouter**). 

### 1. File .env
Assicurati di avere il file `.env` nella root del progetto con i seguenti valori:

```env
# Provider Attivo (gemini | openrouter)
AI_PROVIDER=gemini

# Google Gemini
GEMINI_API_KEY=tua_chiave_google

# OpenRouter (opzionale se usi Gemini)
OPENROUTER_API_KEY=tua_chiave_openrouter
OPENROUTER_MODEL=arcee-ai/trinity-large-preview:free
```

### 2. Funzionamento
- **Sentiment Analysis**: Viene eseguita automaticamente al salvataggio di una recensione.
- **Synthesize Reviews**: Disponibile tramite l'endpoint `/api/reviews/product/{id}/ai-summary/`.

Puoi cambiare il provider in qualsiasi momento modificando `AI_PROVIDER` nel file `.env`.
