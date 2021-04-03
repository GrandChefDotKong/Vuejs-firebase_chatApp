import firebase from "firebase";

const config = {
    //API KEYS
    apiKey: "AIzaSyDSCSm2fJPfEaUBpwBhwnPZXHx1roqYm2U",
    authDomain: "vue-chat-4ca67.firebaseapp.com",
    projectId: "vue-chat-4ca67",
    storageBucket: "vue-chat-4ca67.appspot.com",
    messagingSenderId: "645706266743",
    appId: "1:645706266743:web:a35bc658d682d1f03d6e72",
    measurementId: "G-2SV368K164"
}

const db = firebase.initializeApp(config);

export default db;
