import { signOut } from 'firebase/auth'
import {
  query,
  getDocs,
  collection,
  where,
  addDoc,
  onSnapshot,
} from 'firebase/firestore'
import { auth, db } from '../public/firebase'
import { useState, useEffect, useRef } from 'react'
import MessageSection from './MessageSection'

const Chat = ({ authState }) => {
  const [allConversations, setAllConversations] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [selectedConversation, setSelectedConversation] = useState()
  const dialogRef = useRef()

  const getAllConversations = async () => {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', authState.uid)
    )

    const docs = await getDocs(q)
    const newConvs = []

    docs.forEach((doc) => {
      newConvs.push(doc.data())
    })

    setAllConversations(newConvs)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newConversations = []
      querySnapshot.forEach((doc) => {
        newConversations.push(doc.data())
      })
      setAllConversations(newConversations)
    })
  }

  const getAllUsers = async () => {
    const q = query(
      collection(db, 'users'),
      where('uid', 'not-in', [
        ...allConversations?.map((c) =>
          c.participants.find((p) => p !== authState.uid)
        ),
        authState.uid,
      ])
    )
    const docs = await getDocs(q)

    const newUsers = []

    docs.forEach((doc) => {
      newUsers.push(doc.data())
    })

    setAllUsers(newUsers)
  }

  const createNewConversation = async (user) => {
    await addDoc(collection(db, 'conversations'), {
      participants: [user.uid, authState.uid],
      participantDetails: [
        { name: user.name, photoURL: user.photoURL, email: user.email },
        {
          name: authState.displayName,
          photoURL: authState.photoURL,
          email: authState.photoURL,
        },
      ],
      conversationId: user.uid + '_' + authState.uid,
    })
  }

  const signOutFromGoogle = async () => {
    signOut(auth)
  }

  useEffect(getAllConversations, [authState])
  useEffect(getAllUsers, [allConversations])

  return (
    <div className="h-screen w-full text-white">
      <div className="flex gap-3 h-[10vh] items-center bg-blue-400 p-4 px-6 text-2xl font-bold">
        <h1 className="flex-1">Chat</h1>
        <button
          onClick={signOutFromGoogle}
          className="rounded-md bg-white p-1 px-3 text-black"
        >
          Sign Out
        </button>
        {authState.photoURL && <img className='h-[40px] aspect-square rounded-full' src={authState.photoURL} />}
      </div>
      <div className="flex h-[90vh]">
        <div className="w-1/4 border-r">
          <div className="h-[80vh] ">
            {allConversations.map((conv) => {
              const recipient = conv.participantDetails.find(
                (p) => p.name !== authState.displayName
              )
              return (
                <div
                  onClick={() => setSelectedConversation(conv)}
                  className="flex cursor-pointer items-center gap-3 border-b p-3 text-black"
                  key={conv.conversationId}
                >
                  <img
                    className="aspect-square h-[40px] rounded-full"
                    src={recipient.photoURL}
                  />
                  <h1>{recipient.name}</h1>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => dialogRef.current.showModal()}
            className="h-[10vh] w-full bg-blue-500 text-3xl"
          >
            +
          </button>
        </div>
        <MessageSection
          selectedConversation={selectedConversation}
          authState={authState}
        />
      </div>
      <dialog
        ref={dialogRef}
        className="relative max-h-[60vh] w-full max-w-md overflow-visible rounded-lg p-3"
      >
        <h1 className="text-3xl">Find Users</h1>
        <hr />
        <ul className="mt-2">
          {allUsers
            ?.filter((user) => user.uid !== authState.uid)
            .map((user) => (
              <li
                onClick={() => {
                  createNewConversation(user)
                  dialogRef.current.close()
                }}
                key={user.uid}
                className="flex w-full cursor-pointer items-center gap-3 border-b p-2"
              >
                <img
                  src={user.photoURL}
                  className="aspect-square h-[40px] rounded-full"
                />
                <div></div>
                <h1>{user.name}</h1>
              </li>
            ))}
        </ul>
        <form method="dialog">
          <button className="absolute -top-2 -right-2 h-[25px] w-[25px] rounded-full bg-black text-white ">
            x
          </button>
        </form>
      </dialog>
    </div>
  )
}

export default Chat
