// components/LogoutButton.jsx
import { logout } from '../auth/authService';

const LogoutButton = () => {
	return (
		<button onClick={logout}>
			Logout
		</button>
	);
};

export default LogoutButton;