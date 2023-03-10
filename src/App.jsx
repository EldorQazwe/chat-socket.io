import { useEffect, useRef, useState } from 'react'

import './App.css'

import DialogCreator from './Dialogs'

const App = (props) => {
   const { socket } = props

   const ref = useRef(null);
   // socket.io status connections
   const [isConnected, setIsConnected] = useState(socket.connected);

   // all-messages
   const [messages, setMessages] = useState([]);

   // input state
   const [value, setValue] = useState('')

   // user state. save id
   const [user, setUser] = useState()

   // send an event about new messages, and clear input (state)
   const send_message = (event) => {
      event.preventDefault();

      socket.emit('dialog-new-message',{message: value, user_id: user})
      setValue("")
   }

   // event on opening, and handler for socket.on
   useEffect(() => {

      socket.on('message', async (event) => {
         switch (event.type) {
            case 'init':
               // if we received an event to initialize the user, update the message state first connect
               // save session in localStorage by specifying user_id
               setMessages(event.messages);

               setIsConnected(true);
               setUser(event.user_id)
               localStorage.setItem("username", event.user_id)

               break
         }
      })

      socket.on('dialog-update', (event) => {
         setMessages(prev => ([...prev, event]))
      })

      // on first connection
      socket.on('connect', () => {
         const username = localStorage.getItem('username')
         socket.send({type: 'init', user_id: username})
      });

      socket.on('disconnect', () => {
         setIsConnected(false);
      });

      ref?.current?.scrollTo(0, ref.current.scrollHeight)

      return () => {
         socket.off('connect');
         socket.off('disconnect');
         socket.off('dialog-update');
      };
   }, [messages]);

   // ternary operator (true ? 'истина': 'ложь')
   // check socket connection status
   return (
      <>
         {isConnected
            ? <>
               <div className="header"><h2 >Chat Messages</h2></div>

               <div className="body" ref={ref} style={{scrollBehavior: 'smooth'}}>
                  {messages?.length === 0 && <p>Будь первым кто напишет</p>}
                  <DialogCreator dialog={messages} user={user}/>
               </div>

               <div className="footer">
                  <form onSubmit={send_message} className='wrapper'>
                     <input
                        placeholder='Введите сообщение'
                        value={value}
                        maxLength={200}
                        onChange={(event) => {setValue(event.target.value)}}
                        required
                     />
                     <button>SEND</button>
                  </form>
               </div>
            </>
            : <h2>Подключение к сокетам</h2>
         }
      </>
   )
}

export default App

