import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Login } from '../src/pages/Login';
import { Header } from '../src/components/Header';
import { Footer } from '../src/components/Footer';
import { Nosotros } from '../src/pages/Nosotros';
import { Contact } from '../src/pages/Contact';
import { Registro } from '../src/pages/Registro';
import { Especialidad } from '../src/pages/Especialidad';
import { Recuperar } from '../src/components/Recuperar';
import { Home } from '../src/pages/Home';
import { Interes } from '../src/pages/Interes';

import { AuthProvider } from '../src/context/AuthContext';
import PrivateRoute from './PrivateRoute';

import { Admin } from '../src/pages/dashboard/Admin';
import { AdminUsu } from '../src/pages/dashboard/AdminUsu';
import { Usuarios } from '../src/pages/gestion/Usuarios';
import { Expedientes } from '../src/pages/gestion/Expedientes';
import { Agenda } from '../src/pages/gestion/Agenda';
import { Gastos } from '../src/pages/gestion/Gastos';
import { Movimientos } from '../src/pages/gestion/Movimientos';
import { Caja } from '../src/pages/gestion/Caja';
import { AgendaUsu } from '../src/pages/gestion/AgendaUsu';

import { ExptesArchivados } from '../src/pages/gestionArchivada/ExptesArchivados';
import { GastosArchivados } from '../src/pages/gestionArchivada/GastosArchivados';
import { CajasArchivadas } from '../src/pages/gestionArchivada/CajasArchivadas';

import { Pagos } from '../src/components/Pagos';
import { GoogleCalendar } from '../src/components/GoogleCalendar';
import { Notas } from '../src/components/Notas';

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<GoogleOAuthProvider clientId='1050424447842-ekhv37d2lp8shcg8imrsbik8rrrerqh7.apps.googleusercontent.com'>
				<AuthProvider>
					<Header />
					<Routes>
						<Route path='/' element={<Home />}></Route>
						<Route path='/home' element={<Home />}></Route>
						<Route path='/login' element={<Login />}></Route>
						<Route path='/registro' element={<Registro />}></Route>
						<Route path='/nosotros' element={<Nosotros />}></Route>
						<Route path='/contact' element={<Contact />}></Route>
						<Route path='/recuperar' element={<Recuperar />}></Route>
						<Route
							path='/especialidad'
							element={<Especialidad />}></Route>
						<Route path='/interes' element={<Interes />}></Route>
						<Route element={<PrivateRoute />}>
							<Route path='/gestioncaja' element={<Caja />}></Route>
							<Route
								path='/exptesarchivados'
								element={<ExptesArchivados />}></Route>
							<Route
								path='/cajasarchivadas'
								element={<CajasArchivadas />}></Route>
							<Route
								path='/googlecalendar'
								element={<GoogleCalendar />}></Route>
							<Route
								path='/gastosarchivados'
								element={<GastosArchivados />}></Route>
							<Route
								path='/gestionmovimientos/:id'
								element={<Movimientos />}></Route>
							<Route path='/gestiongastos' element={<Gastos />}></Route>
							<Route path='/admin' element={<Admin />}></Route>
							<Route path='/notas' element={<Notas />}></Route>
							<Route
								path='/gestionusuarios'
								element={<Usuarios />}></Route>
							<Route
								path='/gestionexpedientes'
								element={<Expedientes />}></Route>
							<Route path='/gestionagenda' element={<Agenda />}></Route>
							<Route path='/gestiongastos' element={<Gastos />}></Route>
							<Route path='/adminusu' element={<AdminUsu />}></Route>
							<Route path='/agendausu' element={<AgendaUsu />}></Route>
							<Route path='/pagos' element={<Pagos />}></Route>
						</Route>
					</Routes>
					<Footer />
				</AuthProvider>
			</GoogleOAuthProvider>
		</BrowserRouter>
	);
};
