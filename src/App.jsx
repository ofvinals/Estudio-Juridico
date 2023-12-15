import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@sweetalert2/themes/dark';
import { AppRouter } from '../router/AppRouter';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import appFirebase from './credenciales';
import { Loginfire } from './components/Loginfire';
import { AuthProvider } from './context/AuthContext';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import '../src/css/App.css';

function App() {

	return (
		<AuthProvider>
			<>
				<AppRouter />
			</>
		</AuthProvider>
	);
}

export default App;
