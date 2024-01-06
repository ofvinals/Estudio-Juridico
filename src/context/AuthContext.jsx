import { useState, useEffect, createContext, useContext } from 'react';
import {
	registerRequest,
	loginRequest,
	verifyTokenRequest,
} from '../api/auth.js';
import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// crea contexto
export const AuthContext = createContext();

// funcion que retorna el contexto del objeto creado por useContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('Error, no creaste el contexto!');
	}
	return context;
};

// guarda el estado actual, si hay usuario logueado o no
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState('null');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [errors, setErrors] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const signup = async (user) => {
		try {
			const res = await registerRequest(user);
			if (res.status === 200) {
				setUser(res.data);
				setIsAuthenticated(true);
				Swal.fire({
					icon: 'success',
					title: 'Registro de usuario exitoso!',
					showConfirmButton: false,
					timer: 1500,
				});
			}
		} catch (error) {
			console.log(error.response.data);
			setErrors(error.response.data);
		}
	};

	const signin = async (user) => {
		try {
			const res = await loginRequest(user);
			console.log(res);
			setIsAuthenticated(true);
			setUser(res.data);
			Swal.fire({
				icon: 'success',
				title: 'Inicio de sesión exitoso!',
				showConfirmButton: false,
				timer: 1500,
			});
			if (res.data.email === 'admin@gmail.com') {
				navigate('/admin', { replace: true });
			} else {
				navigate('/adminusu', { replace: true });
			}
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Ingreso rechazado',
				text: 'El usuario y/o contraseña no son correctos!',
				confirmButtonColor: '#8f8e8b',
			});
		}
	};

	const logout = () => {
		Cookies.remove('token');
		setUser(null);
		setIsAuthenticated(false);
	};

	// temporizador de mensajes de error
	useEffect(() => {
		if (errors.length > 0) {
			const timer = setTimeout(() => {
				setErrors([]);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [errors]);

	useEffect(() => {
		async function checkLogin() {
			const cookies = Cookies.get();

			if (!cookies.token) {
				setIsAuthenticated(false);
				setLoading(false);
				return setUser(null);
			}
			try {
				const res = await verifyTokenRequest(cookies.token);
				if (!res.data) {
					setIsAuthenticated(false);
					setLoading(false);
					return;
				}

				setIsAuthenticated(true);
				setUser(res.data);
				setLoading(false);
			} catch (error) {
				setIsAuthenticated(false);
				setLoading(false);
				setUser(null);
			}
		}
		checkLogin();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				signup,
				signin,
				logout,
				isAuthenticated,
				errors,
				loading,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
export default AuthContext;
