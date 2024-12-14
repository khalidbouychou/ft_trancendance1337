// import LoginPage from './login/LoginPage.jsx'
import ChatPage from './chat/ChatPage.jsx'
import { useNotificationWS } from '../contexts/NotifWSContext.jsx'
import { useContext } from 'react'

// import PrivateRoute from './private/PrivateRoute.jsx'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// chat application

function Chat() {
	// const {sendMessage, isConnected} = useNotificationWS();
	return (
		<ChatPage />
	)
}

export default Chat
