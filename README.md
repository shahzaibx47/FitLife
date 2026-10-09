# FitLife — Professional Fitness Website

**Web Technology Project** | HTML5 + CSS3 + Vanilla JavaScript + Firebase Authentication

## Project Overview

FitLife is a modern, multi-page fitness platform with:
- Workout & Exercise libraries
- BMI Calculator
- Workout Timer
- Favorites system (LocalStorage)
- Firebase Authentication (Signup / Login / Logout)
- Dark / Light theme
- Fully responsive design

## How to Run

1. Open the project folder in VS Code (or any editor).
2. Use **Live Server** extension to open `index.html`  
   OR simply open `index.html` in your browser (some features like `fetch()` for JSON need a local server).

## Firebase Setup (IMPORTANT)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password** sign-in method

### Step 2: Get Config
1. Project Settings → General → Your apps → Add Web App
2. Copy the `firebaseConfig` object

### Step 3: Paste Config
Open `js/firebase-config.js` and replace:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Firebase Libraries Used
These CDN scripts are included in every HTML page that needs auth:

```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
```

- `firebase-app-compat.js` → Core Firebase SDK
- `firebase-auth-compat.js` → Authentication module

## Folder Structure

```
FitLife/
├── index.html, workouts.html, exercises.html, ...
├── css/          (style, responsive, auth, dashboard)
├── js/           (main, auth, workouts, exercises, ...)
├── data/         (workouts.json, exercises.json, trainers.json, membership.json)
└── images/
```

## Features Summary

| Feature              | Technology          |
|----------------------|---------------------|
| Multi-page website   | HTML5               |
| Styling              | CSS3 (Flexbox/Grid) |
| Interactivity        | Vanilla JavaScript  |
| Authentication       | Firebase Auth       |
| Favorites            | LocalStorage        |
| Theme toggle         | LocalStorage        |
| Data                 | Local JSON files    |
| Responsive           | Media Queries       |

## Pages

1. Home (`index.html`)
2. Workouts (`workouts.html`) — search, filter, sort
3. Exercises (`exercises.html`) — search, filter, favorites
4. Exercise Details (`exercise-details.html`)
5. BMI Calculator (`bmi.html`)
6. Favorites (`favorites.html`)
7. Login / Signup (`login.html`, `signup.html`)
8. Dashboard (`dashboard.html`) — protected
9. About (`about.html`)
10. Contact (`contact.html`) — email handoff

## Notes for Presentation / Viva

- Pure HTML, CSS, JS — no frameworks (React/Bootstrap etc.)
- Firebase handles all password security (never store passwords in LocalStorage)
- LocalStorage only used for: theme preference + favorite exercise IDs
- JSON data loaded with `fetch()` for dynamic card generation
- Responsive hamburger menu on mobile
- Dark/Light mode with persistent preference

## Author

University Web Technology Project — FitLife


## Updated project notes
- Open `index.html` using VS Code Live Server for best results.
- The Home page and exercise library preview are public; workout tools, exercise detail, BMI, favorites and dashboard require Firebase Authentication.
- Firebase web configuration is in `js/firebase-config.js`; confirm Email/Password sign-in is enabled in Firebase Console and add your deployed domain to Authorized domains.
- Contact form opens the visitor's email application with a pre-filled message addressed to `shahzaibbaltee78@gmail.com`; it does not silently send email from the browser.
- About team illustrations are local SVG artwork, not photographs of real people.
