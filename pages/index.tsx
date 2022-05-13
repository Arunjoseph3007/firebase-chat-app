import type { NextPage } from 'next'
import { useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import SignIn from '../components/SignIn'
import Chat from '../components/Chat'
import { auth, db } from '../public/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

const Home: NextPage = () => {
  const authState = useAuthState(auth)[0]

  useEffect(() => {
    console.log({ authState })
  }, [authState])

  return (
    <div className="min-h-screen items-center justify-center">
      <Head>
        <title>Firebase Chat App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {authState ? <Chat authState={authState} /> : <SignIn />}
    </div>
  )
}

export default Home
