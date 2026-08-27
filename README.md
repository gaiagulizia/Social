
# SocialApp

Base di un social network cross-platform (iOS + Android), costruita con **React Native + Expo + Expo Router**, pronta per essere pubblicata su App Store e Play Store.

## Cosa contiene questa prima versione

- **Home**: feed dei post dei profili seguiti (dati finti per ora)
- **Ricerca**: barra di ricerca + griglia esplora
- **Messaggi**: lista conversazioni
- **Profilo**:
  - foto profilo, bio (max 300 caratteri)
  - pulsante rotondo "+" per creare post di testo, foto o video
  - fino a 10 sezioni personalizzabili (nome max 15 caratteri)
  - tag delle sezioni con colore scelto tramite ruota RGB/HSV o codice Hex, testo bianco o nero
  - sezioni scorrevoli con swipe orizzontale
  - possibilità di spostare un post tra sezioni in creazione e in modifica
  - eliminazione / archiviazione dei post (tieni premuto su un post)
- **Impostazioni**: menu con le voci tipiche (account, privacy, notifiche, archivio, logout...)

Design bianco e minimal, font di sistema (San Francisco su iOS, Roboto su Android) come nei social più diffusi.

Lo stato (profilo, sezioni, post) è gestito con React Context in memoria: al riavvio dell'app si resetta ai dati di esempio. Nel prossimo step collegheremo un backend reale (o AsyncStorage/Supabase/Firebase) per la persistenza.

## Come avviarlo in locale

Requisiti: Node.js 18+, npm, e l'app **Expo Go** sul telefono (oppure un simulatore iOS/emulatore Android).

```bash
npm install
npx expo start
```

Poi scansiona il QR code con Expo Go (Android) o con la Fotocamera (iOS), oppure premi `i` per il simulatore iOS / `a` per l'emulatore Android.

## Come caricarlo su GitHub

```bash
git init
git add .
git commit -m "Base app: home, profilo, ricerca, messaggi, impostazioni"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/NOME-REPO.git
git push -u origin main
```

## Pubblicazione su App Store / Play Store (quando saremo pronti)

Con Expo si usa **EAS Build**:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
eas build --platform android
```

Per l'App Store serve un account Apple Developer (99$/anno), per il Play Store un account Google Play Developer (25$ una tantum). Aggiorna `bundleIdentifier` (iOS) e `package` (Android) in `app.json` con il tuo dominio prima della pubblicazione.

## Prossimi step suggeriti

- Autenticazione utenti (email/telefono, social login)
- Backend reale (database utenti, post, sezioni, messaggi) — es. Firebase o Supabase
- Upload media su storage cloud invece che URI locali
- Notifiche push
- Sistema di follow/following reale
- Chat in tempo reale nella sezione Messaggi
- Modifica avatar e "Modifica profilo" completa
