# Il Kit per l'Oratorio Estivo

Un progetto open source progettato per aiutare gli animatori e lo staff dell'oratorio a gestire in modo efficiente le attività quotidiane, tra cui le iscrizioni, la presenza degli utenti, i giochi interattivi e la classifica delle squadre. Il sito è altamente personalizzabile, consentendo allo staff di modificare icone, colori e il nome dell'oratorio.

## Funzionalità Principali

- [ ] **Gestione Iscrizioni e Presenze**: Raccoglie e tiene traccia delle iscrizioni e delle presenze giornaliere degli utenti alla struttura.
- [ ] **Gestione Classifica**: Monitora e aggiorna le classifiche delle squadre, con la possibilità di aggiungere o rimuovere squadre e gestire i punteggi divisi per giorno o per gioco.
- [ ] **Giochi Interattivi**: Include giochi proiettabili come "4 immagini 1 animatore" per coinvolgere i partecipanti.
- [ ] **Spazio per Musica e Balli di Gruppo**: Include sezioni per canzoni, jingle e coreografie di gruppo, accessibili facilmente durante gli eventi.
- [ ] **Timer e Cronometro**: Funzionalità di temporizzazione integrate per facilitare la gestione del tempo durante le attività.
- [ ] **Personalizzazione Completa**: Ogni elemento del sito può essere customizzato: i colori, le immagini e il nome dell'oratorio.
- [ ] **Interazione Multi-schermo**: Consente l'utilizzo di un secondo schermo per proiettare giochi e interagire con il pubblico.

## Tecnologie Utilizzate

- **Frontend**: [Angular](https://angular.io/) (versione 19.1) con supporto per animazioni e gestione delle rotte. Stile e interfaccia basati su [Tailwind CSS](https://tailwindcss.com/) e [FontAwesome](https://fontawesome.com/).
- **Backend**: [Hono](https://hono.dev/) come framework ultraleggero per API, con validazione tramite [Zod](https://zod.dev/) e ORM [Drizzle](https://orm.drizzle.team/) per l'interazione con il database MySQL. Logging avanzato con [Pino](https://getpino.io/).  
- **Database**: [MySQL](https://www.mysql.com/) con driver [mysql2](https://www.npmjs.com/package/mysql2) e gestione degli schemi tramite Drizzle ORM.  
- **Containerizzazione**: Progetto dockerizzabile per un facile deployment in ambienti diversi.  

## Obiettivi

1. **Facilitare la gestione delle attività**: Aiutare gli animatori dell'oratorio a concentrarsi sulle attività piuttosto che sulla burocrazia.
2. **Coinvolgere i partecipanti**: Creare uno spazio interattivo e divertente che coinvolga tutti, dai giochi alla musica.
3. **Personalizzazione massima**: Consentire a ciascun oratorio di personalizzare il sito secondo le proprie necessità e preferenze estetiche.
4. **Facilità d'uso e distribuzione**: Implementare un'infrastruttura docker per facilitare l'installazione e la distribuzione del progetto in diversi ambienti.

## Come Iniziare

1. **Clone del repository**:
   ```bash
   git clone https://github.com/username/kit-oratorio-estivo.git
   ```
2. Configurazione dell'ambiente Docker: Assicurati di avere Docker installato sul tuo sistema. Esegui il comando per buildare ed eseguire il container:
    Guarda [build.sh](build.sh)
3. Accedi all'applicazione: Una volta attivato, l'applicazione sarà accessibile via browser all'indirizzo http://localhost.
4. Configurazione Database: Esegui le migrazioni del database MySQL e assicurati che il file di configurazione .env sia aggiornato con le tue credenziali MySQL.

## Contributi
Contributi, bug report e suggerimenti sono sempre benvenuti! Puoi iniziare aprendo un [issue](https://github.com/kappucitti/kit-oratorio-estivo/issues) o inviando una pull request.