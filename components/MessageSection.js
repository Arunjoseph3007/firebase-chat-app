import { useState, useEffect, useRef } from 'react'
import {
  query,
  collection,
  where,
  addDoc,
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore'
import { db } from '../public/firebase'
import { format } from 'timeago.js'

const Messagesection = ({ selectedConversation, authState }) => {
  if (!selectedConversation)
    return <div className="w-full text-black ">Select a user</div>

  const recipient = selectedConversation.participantDetails.find(
    (p) => p.name !== authState.displayName
  )

  const [newMessage, setNewMessage] = useState('')
  const [allMessages, setAllMessages] = useState([])
  const dummyRefForSrcoll = useRef()

  const getAllMessages = async () => {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', selectedConversation.conversationId),
      orderBy('createdAt'),
      limit(100)
    )
    const docs = await getDocs(q)

    const newMessages = []

    docs.forEach((doc) => {
      newMessages.push(doc.data())
    })

    setAllMessages(newMessages)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = []
      querySnapshot.forEach((doc) => {
        newMessages.push(doc.data())
      })
      setAllMessages(newMessages)
    })
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage) return

    const thisMessage = {
      id: new Date().getTime(),
      text: newMessage,
      senderId: authState.uid,
      createdAt: serverTimestamp(),
      conversationId: selectedConversation.conversationId,
    }

    await addDoc(collection(db, 'messages'), thisMessage)

    setNewMessage('')
  }

  useEffect(getAllMessages, [selectedConversation])
  useEffect(
    () => dummyRefForSrcoll.current.scrollIntoView({ behavior: 'smooth' }),
    [allMessages]
  )

  return (
    <div className="w-full text-black ">
      <div className="flex h-[10vh] w-full items-center gap-4 border-t bg-blue-400 px-4">
        <img
          src={recipient.photoURL}
          className="aspect-square h-[45px] rounded-full"
        />
        <h1>{recipient.name}</h1>
      </div>
      <div className="flex h-[70vh] flex-col gap-3 overflow-auto py-3">
        {allMessages?.map((msg) => (
          <>
            <div
              className={`mx-3 flex w-fit items-center gap-2 rounded-3xl p-1 pr-3 shadow-md ${
                msg.senderId === authState.uid
                  ? 'self-end bg-blue-400 text-black'
                  : 'bg-gray-100 '
              }`}
              key={msg.id}
            >
              <img className="h-[35px] rounded-full" src={recipient.photoURL} />
              <h1>{msg.text}</h1>
            </div>
            <p
              className={`mx-4 text-sm text-gray-400 ${
                msg.senderId === authState.uid && 'self-end '
              }`}
            >
              {format(new Date(msg?.createdAt?.seconds * 1000))}
            </p>
          </>
        ))}
        <div ref={dummyRefForSrcoll}></div>
      </div>
      <form
        onSubmit={sendMessage}
        className="flex h-[10vh] items-center gap-3 bg-gray-400 px-4"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          placeholder="Message..."
          className="flex-1 rounded-full p-3"
        />
        <button
          type="submit"
          className="rounded-full bg-black p-3 px-6 text-white"
        >
          SEND
        </button>
      </form>
    </div>
  )
}

export default Messagesection
