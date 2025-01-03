// import LoginPage from './login/LoginPage.jsx'
import ChatPage from './chat/ChatPage.jsx'
import { AuthContext } from '../UserContext/Context.jsx'
import { useContext } from 'react'
// import { useNotificationWS } from '../contexts/NotifWSContext.jsx'
// import { useContext } from 'react'

function Chat() {
	const {t} = useContext(AuthContext)
	return (
		<ChatPage t={t}/>
	)
}

export default Chat
