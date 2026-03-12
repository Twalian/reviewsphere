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
