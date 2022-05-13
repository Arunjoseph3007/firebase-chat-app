import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { query, getDocs, collection, where, addDoc } from 'firebase/firestore'
import { auth, db } from '../public/firebase'

const SignIn = () => {
  const googleProvider = new GoogleAuthProvider()
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider)
      const user = res.user
      const q = query(collection(db, 'users'), where('uid', '==', user.uid))
      const docs = await getDocs(q)
      if (docs.docs.length === 0) {
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: user.displayName,
          authProvider: 'google',
          email: user.email,
          photoURL:user.photoURL,
        })
      }
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex h-80 w-[90vw] max-w-xs items-center justify-center rounded-md border shadow-md">
        <button
          className=" rounded-md p-2 px-4 text-2xl text-white bg-black hover:bg-gray-300 transition-all hover:text-black font-bold uppercase"
          onClick={signInWithGoogle}
        >
          Sign In
        </button>
      </div>
    </div>
  )
}

export default SignIn
