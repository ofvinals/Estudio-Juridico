import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
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
	updateEmail,
	sendEmailVerification,
} from 'firebase/auth';
import { getDocs, collection, addDoc } from 'firebase/firestore';
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
	const [user, setUser] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthChecked, setIsAuthChecked] = useState(false);
	const navigate = useNavigate();

	// FUNCION REGISTRO DE USUARIOS
	const registro = async (values) => {
		try {
			const response = await createUserWithEmailAndPassword(
				auth,
				values.email,
				values.password
			);
			const usuariosRef = collection(db, 'usuarios');
			await addDoc(usuariosRef, values).then;
			Swal.fire({
				icon: 'success',
				title: 'Bienvenido! Registro de cuenta exitoso!',
				showConfirmButton: false,
				timer: 2500,
			});
			const displayNameValue = `${values.username} ${values.apellido}`;
			setDisplayName(displayNameValue);
			setIsAuthenticated(true);
			console.log('displayName:', displayName);
			localStorage.setItem('displayName', displayNameValue);
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

	// FUNCION LOGIN CON CORREO ELECTRONICO
	const login = async (data) => {
		try {
			await signInWithEmailAndPassword(auth, data.email, data.password);
			const maillog = data.email;
			setUser(maillog);
			Swal.fire({
				icon: 'success',
				title: 'Inicio de sesión exitoso!',
				showConfirmButton: false,
				timer: 1500,
			});
			const usuariosRef = collection(db, 'usuarios');
			const snapshot = await getDocs(usuariosRef);
			const fetchedUsuario = snapshot.docs.find(
				(doc) => doc.data().email === data.email
			);
			if (fetchedUsuario) {
				const usuarioData = await {
					...fetchedUsuario.data(),
					id: fetchedUsuario.id,
				};
				const displayNameValue = `${usuarioData.username} ${usuarioData.apellido}`;
				setDisplayName(displayNameValue);
				setIsAuthenticated(true);
				localStorage.setItem('displayName', displayNameValue);
			}
			if (data.email === 'ofvinals@gmail.com') {
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
			const responseGoogle = new GoogleAuthProvider();
			responseGoogle.addScope('email');
			responseGoogle.addScope('profile');
			signInWithPopup(auth, responseGoogle)
				.then((result) => {
					const userRes = result.user;
					const display = result.user.displayName;
					const email = userRes.providerData.map((profile) => {
						return profile.email;
					});
					const userEmail = email[0];
					setIsAuthenticated(true);
					setDisplayName(display);
					setUser(userEmail);
					console.log('display:', displayName, 'user:', user);
					localStorage.setItem('displayName', displayName);
					Swal.fire({
						icon: 'success',
						title: 'Inicio de sesión exitoso!',
						showConfirmButton: false,
						timer: 1500,
					});
					if (userEmail === 'ofvinals@gmail.com') {
						navigate('/admin', { replace: true });
					} else {
						navigate('/adminusu', { replace: true });
					}
				})
				.catch((error) => {
					console.error(error);
					Swal.fire({
						icon: 'error',
						title: 'Ingreso rechazado',
						text: 'El inicio de sesión con Google falló.',
						showConfirmButton: false,
						timer: 1500,
					});
				});
		} catch (error) {
			console.error(error);
		}
	};

	// FUNCION LOGOUT
	const logout = async () => {
		await signOut(auth);
		Cookies.remove('token');
		Swal.fire({
			icon: 'success',
			title: 'Su sesion fue cerrada!',
			showConfirmButton: false,
			timer: 1500,
		});
		setUser(null);
		setIsAuthenticated(false);
		localStorage.removeItem('displayName');
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
				console.log(auth.currentUser);
				// Actualiza la contraseña
				await updatePassword(auth.currentUser, newPassword);
				const token = await auth.currentUser.getIdToken();
			} else {
				console.error('Usuario no autenticado');
			}
		} catch (error) {
			console.error(error);
		}
	};

	// // FUNCION PARA MODIFICAR EMAIL
	const updateMail = async (newMail) => {
		try {
			if (auth.currentUser) {
				await updateEmail(auth.currentUser, newMail)
					.then(async () => {
						await auth.currentUser.reload();
						const updatedUser = auth.currentUser;
						// Envía un correo electrónico de verificación al nuevo correo electrónico
						await sendEmailVerification(updatedUser);
						const newUser = auth.currentUser.email
						console.log(newUser)
						setUser(newUser);
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				console.error('Usuario no autenticado');
			}
		} catch (error) {
			console.error(error);
		}
	};

	// Función que se ejecutará al cambiar el estado de autenticación
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				console.log('No hay usuario autenticado en Firebase');
				setUser(null);
				setIsAuthenticated(false);
			} else {
				const userEmail =
					user.providerData.find(
						(profile) => profile.providerId === 'google.com'
					)?.email || user.email;
				setIsAuthenticated(true);
				const storedDisplayName = localStorage.getItem('displayName');
				if (storedDisplayName) {
					setDisplayName(storedDisplayName);
				}
				setUser(userEmail);
			}
			setIsLoading(false);
			setIsAuthChecked(true);
		});
		return () => unsubscribe();
	}, [setUser, setIsAuthenticated, setIsLoading, setDisplayName]);
	if (!isAuthChecked) {
		return null;
	}
	console.log('displayName:', displayName, 'user:', user);

	return (
		<AuthContext.Provider
			value={{
				user,
				displayName,
				loginWithGoogle,
				isAuthenticated,
				registro,
				login,
				logout,
				resetPassword,
				isLoading,
				updatePass,
				updateMail,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
export default AuthContext;
