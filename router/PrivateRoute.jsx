import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const PrivateRoute = () => {
	const auth = getAuth();
	const [authState, setAuthState] = useState('Cargando');

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setAuthState(user ? 'authenticated' : 'unauthenticated');
		});

		return () => unsubscribe();
	}, [auth]);

	if (authState === 'Cargando') {
		// Muestra un indicador de carga mientras Firebase está verificando la autenticación.
		return <div>Cargando...</div>;
	}

	return authState === 'authenticated' ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;


