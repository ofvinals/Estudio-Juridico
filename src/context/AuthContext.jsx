import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../firebase/config.js';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	sendPasswordResetEmail,
	signOut,
	onAuthStateChanged,
	updatePassword,
	updateProfile,
} from 'firebase/auth';

// crea contexto
const AuthContext = createContext();

// funcion que retorna el contexto del objeto creado por useContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('Error, no se creo el contexto!');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [accessToken, setAccessToken] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// FUNCION REGISTRO DE USUARIOS
	const registro = async (values) => {
		await createUserWithEmailAndPassword(auth, values.email, values.password);
		const currentUser = auth.currentUser;
		const displayNameValue = `${values.username} ${values.apellido}`;
		const phoneNumberValue = values.cel;
		await updateProfile(currentUser, {
			displayName: displayNameValue,
			phoneNumber: phoneNumberValue,
		});
	};

	// FUNCION LOGIN CON CORREO ELECTRONICO
	const login = async (data) => {
		await signInWithEmailAndPassword(auth, data.email, data.password);
		const currentUser = auth.currentUser;
		setCurrentUser(currentUser);
	};

	// FUNCION LOGIN CON CUENTA GOOGLE
	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		provider.addScope('profile');
		provider.addScope('email');
		provider.addScope('https://www.googleapis.com/auth/userinfo.email');
		provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
		provider.addScope('https://www.googleapis.com/auth/calendar.events');

		const result = await signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const accessToken = credential.accessToken;
				console.log(result.user.providerData[0])

				const currentUser = result.user;
				// Ahora currentUser debe tener la información del usuario, incluido el correo electrónico
				setCurrentUser(currentUser);
				setAccessToken(accessToken);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// FUNCION LOGOUT
	const logout = async () => {
		await signOut(auth);
	};

	// FUNCION PARA RECUPERAR CONTRASEÑA
	const resetPassword = (email) => {
		sendPasswordResetEmail(auth, email)
			.then(() => {})
			.catch((error) => {
				console.error(error);
			});
	};

	// FUNCION PARA MODIFICAR CONTRASEÑA
	const updatePass = async (newPassword) => {
		try {
			if (auth.currentUser) {
				await updatePassword(auth.currentUser, newPassword);
				await auth.currentUser.getIdToken();
			} else {
				console.error('Usuario no autenticado');
			}
		} catch (error) {
			console.error(error);
		}
	};

	// Función que se ejecutará al cambiar el estado de autenticación
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				console.log(currentUser);
				setCurrentUser(currentUser);
				setIsAuthenticated(true);
				setAccessToken(accessToken)
				setIsLoading(false);
			} else {
				console.log('No hay usuario autenticado en Firebase');
				setCurrentUser(null);
				setIsAuthenticated(false);
				setIsLoading(false);
			}
		});
		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				accessToken,
				loginWithGoogle,
				isAuthenticated,
				registro,
				login,
				logout,
				resetPassword,
				isLoading,
				updatePass,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
export default AuthContext;
