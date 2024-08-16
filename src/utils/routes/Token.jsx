import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const getRoleFromToken = (token) => {
	if (!token) return null;
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const payload = JSON.parse(atob(base64));
		return payload.role;
	} catch (error) {
		console.error('Token rol bilgisi hatası:', error);
		return null;
	}
};
const getTokenExpiration = (token) => {
	if (!token) return true;
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const payload = JSON.parse(atob(base64));
		return payload.exp;
	} catch (error) {
		console.error('Token süresi dolsu:', error);
		return null;
	}
};
function Token({ setRole }) {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');
		const userRole = getRoleFromToken(token);
		const expirationTime = getTokenExpiration(token);

		if (expirationTime) {
			const currentTime = Math.floor(Date.now() / 1000);
			if (currentTime >= expirationTime) {
				localStorage.removeItem('token');
				navigate('/login/SignIn');
				return;
			}
		}
		if (userRole === '2') {
			setRole('admin');
		} else if (userRole === '1') {
			setRole('user');
		} else {
			setRole(null);
		}
	}, [setRole, navigate]);

	return null;
}

export default Token;
