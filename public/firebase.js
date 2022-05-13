import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAC1AHXSb00rtqTBlSG0kyfsWaiGmowJAw',
  authDomain: 'fir-chat-app-6a202.firebaseapp.com',
  projectId: 'fir-chat-app-6a202',
  storageBucket: 'fir-chat-app-6a202.appspot.com',
  messagingSenderId: '223236063885',
  appId: '1:223236063885:web:8ec17934ecc6b852f198c4',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
