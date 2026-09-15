@echo off
:: Inizializzazione del database.
::
:: Nota: questo file esiste solo per comodita' su Windows. La procedura vera e'
:: fatta di due comandi, che funzionano ovunque (anche dentro il container):
::
::     bun run db:migrate      applica le migrazioni versionate
::     bun run db:setup:data   crea ruoli e utente amministratore
::
title Setup Database e Admin

echo =============================================
echo =        Inizializzazione del DB            =
echo =============================================
echo.
echo Assicurati che le variabili d'ambiente del DB siano configurate
echo in src\config\.env prima di continuare.
pause

cd /d "%~dp0.."

:: Applica le migrazioni versionate presenti in src\drizzle.
:: NON si usa `drizzle-kit push`: quello diffa lo schema e applica il DDL
:: direttamente, senza storico e senza possibilita' di revisione, e puo'
:: eliminare colonne e tabelle senza chiedere.
echo.
echo Applicazione delle migrazioni...
call bun run db:migrate
if errorlevel 1 (
  echo.
  echo Migrazioni fallite: mi fermo senza toccare i dati.
  pause
  exit /b 1
)

:: Lo script chiede da solo i dati dell'admin e conferma prima di cancellare.
echo.
echo Creazione ruoli e utente amministratore...
call bun run db:setup:data

echo.
echo Operazione completata.
pause
