import React, { useState } from 'react';
import appFirebase from '../credenciales';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
const auth = getAuth(appFirebase);

export const Loginfire = () => {

	const functAutenticacion = async (e) => {
		e.preventDefault();
		const correo = e.target.email? e.target.email.value:'';
		const contrasena = e.target.password? e.target.password.value:'';
		try{
		await signInWithEmailAndPassword(auth, correo, contrasena);
	} catch (error){
		console.error(error.message);
	}
	};


return (
	<div>
		<form onSubmit={functAutenticacion}>
			<input type='text' placeholder='Ingresa Email' id='email' name='email' />
			<input
				type='password'
				placeholder='Ingresa contraseña'
				id='password'
				name='password'
			/>
			<button>Iniciar sesion</button>
		</form>
	</div>
);
};