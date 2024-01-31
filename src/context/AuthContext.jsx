import React, { useState, useEffect, createContext, useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
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
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

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

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [displayName, setDisplayName] = useState('');
	const [accessToken, setAccessToken] = useState('');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	// FUNCION REGISTRO DE USUARIOS
	const registro = async (values) => {
		try {
			Swal.showLoading();
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				values.email,
				values.password
			);
			const user = userCredential.user;
			const displayNameValue = `${values.username} ${values.apellido}`;
			const phoneNumberValue = values.cel;
			await updateProfile(user, {
				displayName: displayNameValue,
				phoneNumber: phoneNumberValue,
			});
			setIsAuthenticated(true);
			setUser(profile.email);
			setDisplayName(profile.displayName);
			localStorage.setItem('user', profile.email);
			localStorage.setItem('accessToken', '');
			localStorage.setItem('displayName', profile.displayName);
			const usuariosRef = collection(db, 'usuarios');
			await addDoc(usuariosRef, values);
			Swal.fire({
				icon: 'success',
				title: 'Bienvenido! Registro de cuenta exitoso!',
				showConfirmButton: false,
				timer: 2500,
			});
			setTimeout(() => {
				Swal.close();
			}, 500);
			return () => clearTimeout(timer);
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de registro',
				text: 'Hubo un error en el registro de usuario. Intenta nuevamente!',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	};

	// FUNCION LOGIN CON CORREO ELECTRONICO
	const login = async (data) => {
		try {
			await signInWithEmailAndPassword(auth, data.email, data.password);

			const currentUser = auth.currentUser;
			await new Promise((resolve) => setTimeout(resolve, 100));

			const profiles = currentUser.providerData.map((profile) => {
				return {
					displayName: profile.displayName,
					email: profile.email,
				};
			});
			const profile = profiles[0];

			setIsAuthenticated(true);
			setUser(profile.email);
			setDisplayName(profile.displayName);
			localStorage.setItem('user', profile.email);
			localStorage.setItem('accessToken', '');
			localStorage.setItem('displayName', profile.displayName);
			console.log();
			Swal.fire({
				icon: 'success',
				title: 'Inicio de sesión exitoso!',
				showConfirmButton: false,
				timer: 1500,
			});

			if (
				user === 'ofvinals@gmail.com' ||
				user === 'estudioposseyasociados@gmail.com'
			) {
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
				showConfirmButton: false,
				timer: 1500,
			});
		}
	};

	// FUNCION LOGIN CON CUENTA GOOGLE
	const loginWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			provider.addScope('email');
			provider.addScope('profile');
			provider.addScope('https://www.googleapis.com/auth/calendar.events');
			const result = await new Promise((resolve, reject) => {
				signInWithPopup(auth, provider).then(resolve).catch(reject);
			});
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			const currentUser = auth.currentUser;
			const profiles = currentUser.providerData.map((profile) => {
				return {
					displayName: profile.displayName,
					email: profile.email,
					photoURL: profile.photoURL,
				};
			});
			const profile = profiles[0];
			setIsAuthenticated(true);
			setDisplayName(profile.displayName);
			setAccessToken(token);
			setUser(profile.email);
			localStorage.setItem('user', profile.email);
			localStorage.setItem('accessToken', token); // Guarda tu token de acceso aquí
			localStorage.setItem('displayName', profile.displayName);
			Swal.fire({
				icon: 'success',
				title: 'Inicio de sesión exitoso!',
				showConfirmButton: false,
				timer: 1500,
			});

			if (user === 'ofvinals@gmail.com') {
				navigate('/admin', { replace: true });
			} else {
				navigate('/adminusu', { replace: true });
			}
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Ingreso rechazado',
				text: 'El inicio de sesión con Google falló.',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	};

	// FUNCION LOGOUT
	const logout = async () => {
		await signOut(auth);
		Swal.fire({
			icon: 'success',
			title: 'Su sesion fue cerrada!',
			showConfirmButton: false,
			timer: 1500,
		});
		setUser(null);
		setIsAuthenticated(false);
		localStorage.clear();
	};

	// FUNCION PARA RECUPERAR CONTRASEÑA
	const resetPassword = (email) => {
		sendPasswordResetEmail(auth, email)
			.then(() => {
				Swal.fire({
					icon: 'success',
					title: 'Revise la bandeja de entrada de su correo electronico!',
					showConfirmButton: false,
					timer: 3500,
				});
			})
			.catch((error) => {
				console.error(error);
				Swal.fire({
					icon: 'error',
					title: 'Ingreso rechazado',
					text: 'La recuperacion de contraseña falló!.',
					showConfirmButton: false,
					timer: 1500,
				});
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
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setIsLoading(true);

			try {
				if (!user) {
					console.log('No hay usuario autenticado en Firebase');
					setUser(null);
					setIsAuthenticated(false);
				} else {
					setIsAuthenticated(true);
					setIsLoading(true)
					// Obtén datos del almacenamiento local de forma síncrona
					const storedUser = await localStorage.getItem('user');
					console.log(storedUser)
					const storedAccessToken = await localStorage.getItem(
						'accessToken'
					);
					console.log(storedAccessToken)

					const storedDisplayName = await localStorage.getItem(
						'displayName'
					);
					console.log(storedDisplayName)

					// Actualiza el estado inmediatamente con los datos del almacenamiento local
					setUser(storedUser);
					setAccessToken(storedAccessToken);
					setDisplayName(storedDisplayName);
				}
			} catch (error) {
				console.error('Error durante el proceso de autenticación', error);
			} 
		});

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				accessToken,
				displayName,
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
