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

	const register = async (email, password) => {
		const response = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log(response);
	};
	const login = async (email, password) => {
		try {
			const response = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log(response);
		} catch (error) {
			console.error('Error al iniciar sesión:', error.message);
		}
	};

	const loginWithGoogle = async () => {
		const responseGoogle = new GoogleAuthProvider();
		return await signInWithPopup(auth, responseGoogle);
	};

	const logout = async () => {
		try{ const response = await signOut(auth);
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
