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
export const authContext = createContext();

// funcion que retorna el contexto del objeto creado por useContext
export const useAuth = () => {
	const context = useContext(authContext);
	if (!context) {
		console.log('Error, no creaste el contexto!');
	}
	return context;
};

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

	const register = async (email, password) => {
		const response = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log(response);
	};
	const login = async (email, password) => {
		const response = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log(response);
	};

	const loginWithGoogle = async () => {
		const responseGoogle = new GoogleAuthProvider();
		return signInWithPopup(auth, responseGoogle);
	};
	const logout = async () => {
		const response = await signOut(auth);
		console.log(response);
	};

	return (
		<authContext.Provider
			value={{
				register,
				login,
				loginWithGoogle,
				logout,
                user
			}}>
			{children}
		</authContext.Provider>
	);
}
