import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../firebase';
import React from 'react';
import {
	signInWithPopup,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// crea contexto
export const AuthContext = createContext();

// funcion que retorna el contexto del objeto creado por useContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		console.log('Error, no creaste el contexto!');
	}
	return context;
};
// guarda el estado actual, si hay usuario logueado o no
export function AuthProvider({ children }) {
	const [user, setUser] = useState('');
	// const navigate = useNavigate();

	useEffect(() => {
		const subscribed = onAuthStateChanged(auth, (currentUser) => {
			if (!currentUser) {
				console.log('No hay usuario logueado');
				setUser('');
			} else {
				setUser(currentUser);
			}
		});
		return () => subscribed();
	}, []);

	useEffect(() => {
		console.log('Estado del usuario después del inicio de sesión:', user);
	}, [user]);

	const register = async (email, password, nombre) => {
		const response = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
			nombre
		);
		console.log(response);
	};

	const login = async (email, password, navigate) => {
		try {
			const response = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			Swal.fire({
				icon: 'success',
				title: 'Inicio de sesión exitoso!',
				showConfirmButton: false,
				timer: 2000,
			});
			if (email === 'admin@gmail.com') {
				navigate('/admin');
				// navigate('/admin', { replace: true });
			} else {
				navigate('/adminusu');
			}
			// navigate('/adminusu', { replace: true });
			console.log(response);
		} catch (error) {
			console.error('Error al iniciar sesión:', error.message);
			Swal.fire({
				icon: 'error',
				title: 'Ingreso rechazado',
				text: 'El usuario y/o contraseña no son correctos!',
				confirmButtonColor: '#8f8e8b',
			});
		}
	};

	const loginWithGoogle = async () => {
		const responseGoogle = new GoogleAuthProvider();
		return await signInWithPopup(auth, responseGoogle);
	};

	const logout = async () => {
		try {
			const response = await signOut(auth);
			console.log(response);
		} catch (error) {
			console.error('Error al iniciar sesión:', error.message);
		}
	};

	return (
		<AuthContext.Provider
			value={{ register, login, loginWithGoogle, logout, user }}>
			{children}
		</AuthContext.Provider>
	);
}
