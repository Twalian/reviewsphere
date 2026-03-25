import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from catalog.models import Category, Product
from reviews.models import Review

User = get_user_model()

class Command(BaseCommand):
    help = 'Popola il database con dati tecnologici altamente realistici per la presentazione finale'

    def handle(self, *args, **options):
        self.stdout.write('Pulizia database e inizio seeding intensivo dei dati...')

        # 0. Pulizia Dati Esistenti (opzionale ma consigliata per una demo pulita)
        Review.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        
        # Nota: Non cancelliamo gli utenti per evitare di invalidare sessioni attive, 
        # ma aggiorneremo quelli esistenti o ne creeremo di nuovi.

        # Password unica per tutti come richiesto
        DEFAULT_PASSWORD = "password"

        # 1. Creazione Utenti (10 Clienti + 1 Moderatore)
        # Moderatore
        moderator, _ = User.objects.get_or_create(
            username='moderatore',
            defaults={
                'email': 'moderatore@reviewsphere.it',
                'role': User.RoleChoices.MODERATOR,
                'is_staff': True
            }
        )
        moderator.set_password(DEFAULT_PASSWORD)
        moderator.save()

        # Clienti
        clients_data = [
            {'username': 'luca_verdi', 'first_name': 'Luca', 'last_name': 'Verdi'},
            {'username': 'giulia_bianchi', 'first_name': 'Giulia', 'last_name': 'Bianchi'},
            {'username': 'marco_rossi', 'first_name': 'Marco', 'last_name': 'Rossi'},
            {'username': 'elena_neri', 'first_name': 'Elena', 'last_name': 'Neri'},
            {'username': 'francesco_b', 'first_name': 'Francesco', 'last_name': 'Bianchi'},
            {'username': 'alessia_romano', 'first_name': 'Alessia', 'last_name': 'Romano'},
            {'username': 'stefano_ricci', 'first_name': 'Stefano', 'last_name': 'Ricci'},
            {'username': 'chiara_ferrari', 'first_name': 'Chiara', 'last_name': 'Ferrari'},
            {'username': 'davide_russo', 'first_name': 'Davide', 'last_name': 'Russo'},
            {'username': 'marta_galli', 'first_name': 'Marta', 'last_name': 'Galli'},
        ]

        clients = []
        for c_data in clients_data:
            client, _ = User.objects.get_or_create(
                username=c_data['username'],
                defaults={
                    'email': f"{c_data['username']}@email.it",
                    'first_name': c_data['first_name'],
                    'last_name': c_data['last_name'],
                    'role': User.RoleChoices.CLIENT
                }
            )
            client.set_password(DEFAULT_PASSWORD)
            client.save()
            clients.append(client)

        self.stdout.write(self.style.SUCCESS(f'Creati {len(clients)} utenti clienti e 1 moderatore.'))

        # 2. Categorie e Prodotti tecnologici
        CAT_DATA = {
            'Smartphone & Tablet': {
                'description': 'Dispositivi mobili all\'avanguardia, dai telefoni pieghevoli ai tablet professionali per creativi.',
                'products': [
                    {
                        'name': 'iPhone 15 Pro', 
                        'brand': 'Apple', 
                        'price': 1239.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800',
                        'description': 'Il nuovo iPhone 15 Pro rappresenta l\'apice della tecnologia mobile Apple. Realizzato in titanio di grado aerospaziale, è incredibilmente leggero e resistente. Il chip A17 Pro ridefinisce le prestazioni, permettendo di giocare a titoli console direttamente sul telefono. La fotocamera principale da 48MP cattura dettagli straordinari, mentre lo zoom ottico 5x offre una versatilità senza precedenti.'
                    },
                    {
                        'name': 'Samsung Galaxy S24 Ultra', 
                        'brand': 'Samsung', 
                        'price': 1499.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800',
                        'description': 'Il Galaxy S24 Ultra introduce una nuova era di intelligenza artificiale mobile. Grazie a Galaxy AI, puoi tradurre chiamate in tempo reale e modificare foto con una semplicità mai vista prima. Il telaio in titanio racchiude un display QHD+ da 6.8 pollici. La S Pen integrata continua a offrire precisione per il lavoro e la creatività.'
                    },
                    {
                        'name': 'iPad Pro M4', 
                        'brand': 'Apple', 
                        'price': 1219.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800',
                        'description': 'L\'iPad Pro più sottile e potente di sempre. Dotato del rivoluzionario chip M4 di nuova generazione, offre prestazioni grafiche eccezionali. Il nuovo display Ultra Retina XDR con tecnologia OLED a doppio strato garantisce contrasti infiniti e una precisione cromatica assoluta.'
                    },
                    {
                        'name': 'Google Pixel 8 Pro', 
                        'brand': 'Google', 
                        'price': 1099.00, 
                        'status': 'OUT_OF_STOCK',
                        'image': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800',
                        'description': 'Pixel 8 Pro è lo smartphone Android definitivo, progettato da Google per offrire un\'esperienza intelligente. Alimentato dal chip Google Tensor G3, sfrutta l\'AI per migliorare ogni aspetto della giornata. Il sistema fotografico professionale include funzionalità di editing video avanzate.'
                    },
                    {
                        'name': 'Xiaomi 14', 
                        'brand': 'Xiaomi', 
                        'price': 999.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=800',
                        'description': 'Xiaomi 14 combina un design compatto ed elegante con prestazioni da vero flagship. La collaborazione con Leica ha portato a un sistema di fotocamer con lenti Summilux otticamente superiori. Equipaggiato con il processore Snapdragon 8 Gen 3 e ricarica ultra-rapida da 90W.'
                    },
                    {
                        'name': 'Surface Pro 9', 
                        'brand': 'Microsoft', 
                        'price': 1149.00, 
                        'status': 'DISCONTINUED',
                        'image': 'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?q=80&w=800',
                        'description': 'La flessibilità di un tablet con le prestazioni e la produttività di un laptop. Surface Pro 9 offre la potenza di Windows 11 in un formato ultra-portatile. Il display PixelSense da 13 pollici garantisce un\'interazione fluida con il tocco e la penna digitale.'
                    },
                ]
            },
            'Computer & Laptop': {
                'description': 'Soluzioni informatiche ad alte prestazioni per programmatori, designer e videogiocatori.',
                'products': [
                    {
                        'name': 'MacBook Air M3', 
                        'brand': 'Apple', 
                        'price': 1299.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
                        'description': 'Il laptop più amato al mondo è ora ancora più potente grazie al chip M3. Con un design incredibilmente sottile senza ventole, garantisce prestazioni fulminee e un\'autonomia che dura tutto il giorno. Il display Liquid Retina da 13.6 pollici offre immagini brillanti.'
                    },
                    {
                        'name': 'Dell XPS 13', 
                        'brand': 'Dell', 
                        'price': 1399.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800',
                        'description': 'Il Dell XPS 13 continua a essere il riferimento per i laptop Windows ultra-portatili. Il suo iconico design InfinityEdge riduce i bordi al minimo. Realizzato con materiali pregiati come alluminio lavorato CNC e fibra di carbonio.'
                    },
                    {
                        'name': 'ThinkPad X1 Carbon', 
                        'brand': 'Lenovo', 
                        'price': 1650.00, 
                        'status': 'OUT_OF_STOCK',
                        'image': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800',
                        'description': 'La leggenda dei laptop business si rinnova. Il ThinkPad X1 Carbon combina una leggerezza incredibile con una robustezza certificata da test di grado militare. La tastiera retroilluminata offre un feedback tattile impareggiabile per lunghe sessioni.'
                    },
                    {
                        'name': 'ROG Zephyrus G14', 
                        'brand': 'ASUS', 
                        'price': 1899.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800',
                        'description': 'Il ROG Zephyrus G14 ridefinisce cosa è possibile fare con un laptop gaming da 14 pollici. Racchiude una potenza mostruosa con CPU AMD Ryzen e GPU NVIDIA GeForce RTX. Il display Nebula HDR garantisce colori cinematografici.'
                    },
                    {
                        'name': 'Spectre x360', 
                        'brand': 'HP', 
                        'price': 1599.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800',
                        'description': 'L\'HP Spectre x360 è un gioiello di design convertibile. La cerniera a 360 gradi permette di passare istantaneamente dalla modalità laptop alla modalità tablet. Lo splendido display OLED offre colori vividi e una precisione assoluta.'
                    },
                    {
                        'name': 'Razer Blade 16', 
                        'brand': 'Razer', 
                        'price': 3499.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800',
                        'description': 'Il Razer Blade 16 è il laptop gaming più potente mai costruito da Razer. Dotato del primo display Mini-LED a doppia modalità al mondo, integra le componenti hardware più veloci disponibili sul mercato coordinate da una camera di vapore proprietaria.'
                    },
                ]
            },
            'Accessori & Gaming': {
                'description': 'Console di gioco, periferiche di precisione e audio ad alta fedeltà.',
                'products': [
                    {
                        'name': 'PlayStation 5 Slim', 
                        'brand': 'Sony', 
                        'price': 549.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800',
                        'description': 'Vivi un\'esperienza di gioco di nuova generazione con la nuova versione Slim di PlayStation 5. Più compatta ma altrettanto potente, offre caricamenti fulminei e un coinvolgimento totale con il controller DualSense.'
                    },
                    {
                        'name': 'Nintendo Switch OLED', 
                        'brand': 'Nintendo', 
                        'price': 349.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1615680022648-2db11101c73a?q=80&w=800',
                        'description': 'La console che ha cambiato il modo di giocare si evolve con uno splendido schermo OLED da 7 pollici. Colori intensi e un contrasto elevato portano i mondi di Super Mario in vita come mai prima d\'ora.'
                    },
                    {
                        'name': 'Sony WH-1000XM5', 
                        'brand': 'Sony', 
                        'price': 329.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
                        'description': 'Le cuffie wireless Sony WH-1000XM5 riscrivono le regole del silenzio. Con due processori che controllano otto microfoni, la cancellazione del rumore è la migliore sul mercato. Audio cristallino e alta risoluzione.'
                    },
                    {
                        'name': 'Logitech MX Keys S', 
                        'brand': 'Logitech', 
                        'price': 119.00, 
                        'status': 'OUT_OF_STOCK',
                        'image': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=800',
                        'description': 'La tastiera definitiva per la produttività. MX Keys S offre digitazione fluida e precisa. La retroilluminazione intelligente si attiva quando le mani si avvicinano. Può connettersi fino a tre dispositivi contemporaneamente.'
                    },
                    {
                        'name': 'Razer DeathAdder V3 Pro', 
                        'brand': 'Razer', 
                        'price': 159.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800',
                        'description': 'Sviluppato con i migliori professionisti degli esport, il DeathAdder V3 Pro è un mouse gaming ultra-leggero di soli 63 grammi. Dotato del sensore ottico più preciso al mondo e tecnologia wireless ultra-veloce.'
                    },
                    {
                        'name': 'Monitor UltraGear OLED', 
                        'brand': 'LG', 
                        'price': 999.00, 
                        'status': 'AVAILABLE',
                        'image': 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?q=80&w=800',
                        'description': 'Immergiti nella velocità pura con il monitor gaming LG UltraGear OLED. Tempo di risposta di 0.03ms e frequenza a 240Hz. La tecnologia OLED garantisce neri perfetti e colori vibranti.'
                    },
                ]
            }
        }

        all_products = []
        for cat_name, info in CAT_DATA.items():
            category, _ = Category.objects.get_or_create(
                name=cat_name,
                defaults={'description': info['description']}
            )
            for prod_data in info['products']:
                product, _ = Product.objects.get_or_create(
                    name=prod_data['name'],
                    category=category,
                    defaults={
                        'brand': prod_data['brand'],
                        'price': prod_data['price'],
                        'description': prod_data['description'],
                        'status': prod_data['status'],
                        'image_url': prod_data['image']
                    }
                )
                product.description = prod_data['description']
                product.status = prod_data['status']
                product.image_url = prod_data['image']
                product.save()
                all_products.append(product)

        self.stdout.write(self.style.SUCCESS(f'Creati/Aggiornati {len(all_products)} prodotti.'))

        # 3. Generazione Recensioni REALISTICHE
        # Usiamo frammenti di frasi per costruire recensioni uniche
        INTRO_POS = ["Finalmente il prodotto che cercavo!", "Incredibile esperienza con questo {name}.", "Non pensavo fosse così performante.", "Un acquisto azzeccato sotto ogni punto di vista.", "Il brand {brand} non delude mai."]
        BODY_POS = ["La velocità è impressionante e il display è uno dei migliori che abbia mai visto.", "Materiali premium che danno una sensazione di solidità incredibile.", "L'autonomia mi permette di arrivare a fine giornata senza problemi.", "Il software è fluidissimo, non ho riscontrato alcun lag."]
        CONCL_POS = ["Lo consiglio vivamente a tutti.", "Se cercate il top, questo è il prodotto giusto.", "Vale ogni centesimo del prezzo pagato.", "Cinque stelle meritate!"]

        INTRO_NEU = ["Buon prodotto ma con qualche compromesso.", "Fa il suo dovere, ma non aspettatevi miracoli.", "Un'esperienza nella media per la fascia di prezzo.", "Mi aspettavo qualcosa in più, ma non è male."]
        BODY_NEU = ["Le prestazioni sono ok per l'uso quotidiano, ma fatica con i task pesanti.", "Il design è carino ma le plastiche sembrano un po' economiche.", "La batteria è nella norma, niente di eccezionale."]
        CONCL_NEU = ["Onesto per il prezzo, ma valutate le alternative.", "Può andare se non avete troppe pretese.", "Tre stelle corrette."]

        INTRO_NEG = ["Purtroppo sono rimasto molto deluso.", "Non capisco le recensioni positive, per me è bocciato.", "Soldi buttati via, sconsigliatissimo.", "Pessima esperienza con questo acquistato."]
        BODY_NEG = ["Ha iniziato a dare problemi dopo solo due giorni di utilizzo.", "La qualità costruttiva è pessima, sembra un giocattolo.", "L'assistenza tecnica è stata imbarazzante.", "Si scalda tantissimo anche con un uso leggero."]
        CONCL_NEG = ["Chiederò sicuramente il rimborso.", "Evitate questo prodotto se possibile.", "Zero stelle se potessi."]

        PROS_LIST = ['Batteria', 'Display', 'Performance', 'Materiali', 'Design', 'Software', 'Prezzo', 'Fotocamera', 'Audio']
        CONS_LIST = ['Prezzo elevato', 'Dimensioni', 'Peso', 'Cavo corto', 'Software acerbo', 'Scalda molto', 'Poco resistente']

        review_count = 0
        for product in all_products:
            for user in clients:
                # Determiniamo il sentiment in base all'utente per dare varietà
                # Alcuni utenti sono "critici", altri "entusiasti"
                user_seed = sum(ord(c) for c in user.username)
                random.seed(user_seed + product.id % 1000) # Seed deterministico per ripetibilità ma vario
                
                roll = random.random()
                if roll < 0.7: # 70% Positive
                    sent = 'positive'
                    vote = random.randint(4, 5)
                    text = f"{random.choice(INTRO_POS)} {random.choice(BODY_POS)} {random.choice(CONCL_POS)}".format(name=product.name, brand=product.brand)
                    pros = random.sample(PROS_LIST, k=random.randint(1, 3))
                    cons = random.sample(CONS_LIST, k=random.randint(0, 1))
                elif roll < 0.9: # 20% Neutral
                    sent = 'neutral'
                    vote = 3
                    text = f"{random.choice(INTRO_NEU)} {random.choice(BODY_NEU)} {random.choice(CONCL_NEU)}".format(name=product.name, brand=product.brand)
                    pros = random.sample(PROS_LIST, k=random.randint(0, 2))
                    cons = random.sample(CONS_LIST, k=random.randint(0, 2))
                else: # 10% Negative
                    sent = 'negative'
                    vote = random.randint(1, 2)
                    text = f"{random.choice(INTRO_NEG)} {random.choice(BODY_NEG)} {random.choice(CONCL_NEG)}".format(name=product.name, brand=product.brand)
                    pros = random.sample(PROS_LIST, k=random.randint(0, 1))
                    cons = random.sample(CONS_LIST, k=random.randint(1, 4))

                review, created = Review.objects.update_or_create(
                    user=user,
                    product=product,
                    defaults={
                        'title': text.split('.')[0] + '!',
                        'description': text,
                        'vote': vote,
                        'status': Review.ReviewStatus.APPROVED,
                        'sentiment': sent,
                        'pros': pros,
                        'cons': cons,
                    }
                )
                review_count += 1
        
        # Reset random seed per sicurezza
        random.seed(None)

        self.stdout.write(self.style.SUCCESS(f'Generazione completata: {review_count} recensioni realistiche inserite.'))
        self.stdout.write(self.style.SUCCESS('Seeding completato con successo!'))
