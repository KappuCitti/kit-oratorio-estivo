# Contribuire al Progetto

Grazie per il tuo interesse nel contribuire a questo progetto! Seguendo queste linee guida, aiuterai a mantenere il progetto organizzato e a garantire standard di alta qualità. Di seguito trovi istruzioni dettagliate e le migliori pratiche per collaborare a questo repository.

---

## **Denominazione dei Branch**

Quando crei un branch, utilizza le seguenti convenzioni di denominazione in base alla categoria di lavoro:

| **Categoria** | **Descrizione**                                                       |
| ------------- | --------------------------------------------------------------------- |
| `hotfix`      | Risoluzione veloce di un piccolo problema o una soluzione temporanea. |
| `bugfix`      | Risoluzione di un problema o bug.                                     |
| `feature`     | Aggiunta di una nuova funzionalità o elemento al progetto.            |
| `test`        | Sviluppo o miglioramento di test.                                     |

**Esempi di nomi di branch**:  
- `hotfix/correggi-errore-login`  
- `bugfix/sistema-timeout-api`  
- `feature/aggiungi-autenticazione-utente`  
- `test/migliora-coverage-dashboard`

---

## **Richieste di Pull (Pull Request)**

Le richieste di pull (PR) consentono di discutere, esaminare e unire modifiche al repository principale. Quando apri una PR:
1. Spiega chiaramente lo scopo e il contesto delle tue modifiche.
2. Aspettati feedback e sii pronto ad aggiornare la tua PR in base ai commenti dei revisori.
3. Le PR verranno unite nel branch di sviluppo principale solo dopo essere state approvate.

---

## **Checklist Prima di Aprire una Richiesta di Pull**

Prima di inviare la tua PR, assicurati di aver completato i seguenti passaggi:

1. **Qualità e Funzionalità del Codice**:
   - Il tuo codice deve avviarsi ed eseguire senza errori.
   - Le nuove modifiche o funzionalità devono essere testate a fondo.

2. **Dipendenze**:
   - Non introdurre librerie non necessarie.
   - Assicurati che tutte le librerie richieste siano elencate nel file di dipendenze appropriato (ad esempio, `package.json` o equivalente).

3. **Pulizia del Codice**:
   - Rimuovi variabili inutilizzate o ridondanti.
   - Evita di lasciare dichiarazioni di debug o commenti non pertinenti nel codice.

4. **Endpoint API**:
   - Controlla la presenza e la validità di tutti i parametri richiesti e opzionali.
   - Le comunicazioni con il database devono essere collocate nei file dedicati all'interno della **cartella dei metodi di accesso al database**.

5. **Formato risposte del Database**:
   - Restituire solo `true`, `false`, dati validi o `None`.  
   - Usare blocchi `try-catch` per gestire errori: 
     ```json
     { 
       "success": false,
       "error": "Descrizione errore",
       "data": null
     }
     ```
     - Loggare l'errore nella console. 
   - In alcuni casi e' necessario anche indicare la lunghezza della risposta con il parametro `length`.  
     ```json
     {
       "success": true,
       "error": null,
       "data": [],
       "length": 0 
     }
     ```


6. **Formato delle Risposte**:
   - Tutte le risposte devono seguire il formato JSON seguente (salvo diverse specifiche):  
     ```json
     {
       "error": null,
       "data": null
     }
     ```
   - Utilizza il codice HTTP appropriato per indicare lo stato della risposta.

---

## **Migliori Pratiche**

### **Stile del Codice**
- Segui standard di codifica e regole di formattazione coerenti per migliorare leggibilità e mantenibilità.
- Usa nomi descrittivi per variabili, funzioni e classi.

### **Commit**
- Mantieni i commit piccoli e mirati. Ogni commit dovrebbe rappresentare una singola modifica o aggiornamento.
- Scrivi messaggi di commit chiari e concisi che descrivano le modifiche apportate.

### **Documentazione**
- Aggiorna la documentazione pertinente (es. commenti, README, riferimenti API) per riflettere le modifiche.

---

## **Comunicazione e Collaborazione**
- Mantieni un tono rispettoso nelle discussioni e accetta i feedback in modo costruttivo.
- Se hai dubbi su un approccio o un'idea, apri una issue per discuterne con i manutentori prima di iniziare il lavoro.

Grazie per il tuo contributo e per rendere questo progetto migliore! 🎉