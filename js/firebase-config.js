// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPMrSL6vaBeYveFsFAHzrH5MzMCOiktVg",
  authDomain: "fitlife-c8866.firebaseapp.com",
  projectId: "fitlife-c8866",
  storageBucket: "fitlife-c8866.firebasestorage.app",
  messagingSenderId: "86500500396",
  appId: "1:86500500396:web:7d5fb4942aa57713ec9009",
  measurementId: "G-W508DLVPZ1"
};

// Initialize Firebase (Compat version)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();