import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: "AIzaSyDErcz8Ig7oY6h2cDPojmB-WvCQKtI9kMI",
    authDomain: "exposure-ad3ad.firebaseapp.com",
    databaseURL: "https://exposure-ad3ad.firebaseio.com",
    projectId: "exposure-ad3ad",
    storageBucket: "exposure-ad3ad.appspot.com",
    messagingSenderId: "461508621555",
    appId: "1:461508621555:web:438a2b6a598c694e8ef386",
    measurementId: "G-W993BD8EM1"
}

firebase.initializeApp(config)

export default firebase

