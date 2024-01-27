import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Login } from '../src/components/Login';
import { Header } from '../src/components/Header';
import { Footer } from '../src/components/Footer';
import { Nosotros } from '../src/components/Nosotros';
import { Contact } from '../src/components/Contact';
import { Registro } from '../src/components/Registro';
import { Especialidad } from '../src/components/Especialidad';
import { Recuperar } from '../src/components/Recuperar';
import { Home } from '../src/components/Home';
import { Interes } from '../src/components/Interes';
import { Admin } from '../src/components/Admin';
import { GestionUsuarios } from '../src/components/GestionUsuarios';
import { GestionExpedientes } from '../src/components/GestionExpedientes';
import { GestionAgenda } from '../src/components/GestionAgenda';
import { GestionGastos } from '../src/components/GestionGastos';
import { AgendaUsu } from '../src/components/AgendaUsu';
import { AdminUsu } from '../src/components/AdminUsu';
import { CargaExptes } from '../src/components/CargaExptes';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from '../src/context/AuthContext';
import { EditarExptes } from '../src/components/EditarExptes';
import { CargaUsu } from '../src/components/CargaUsu';
import { EditarUsu } from '../src/components/EditarUsu';
import { EditarTurnos } from '../src/components/EditarTurnos';
import { GestionMovimientos } from '../src/components/GestionMovimientos';
import { ExptesArchivados } from '../src/components/ExptesArchivados';
import { GastosArchivados } from '../src/components/GastosArchivados';
import { CajasArchivadas } from '../src/components/CajasArchivadas';
import { EditarMov } from '../src/components/EditarMov';
import { CargaGastos } from '../src/components/CargaGastos';
import { EditarGastos } from '../src/components/EditarGastos';
import { EditarCajas } from '../src/components/EditarCajas';
import { GestionCaja } from '../src/components/GestionCaja';
import { CargaMov } from '../src/components/CargaMov';
import { CargaCajas } from '../src/components/CargaCajas';
import { Pagos } from '../src/components/Pagos';

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
							<Route
								path='/gestioncaja'
								element={<GestionCaja />}></Route>
							<Route
								path='/exptesarchivados'
								element={<ExptesArchivados />}></Route>
							<Route
								path='/cajasarchivadas'
								element={<CajasArchivadas />}></Route>
							<Route
								path='/gastosarchivados'
								element={<GastosArchivados />}></Route>
							<Route
								path='/gestionmovimientos/:id'
								element={<GestionMovimientos />}></Route>
							<Route
								path='/gestiongastos'
								element={<GestionGastos />}></Route>
							<Route
								path='/cargagastos'
								element={<CargaGastos />}></Route>
							<Route
								path='/editargastos/:id'
								element={<EditarGastos />}></Route>
							<Route
								path='/editarcajas/:id'
								element={<EditarCajas />}></Route>
							<Route
								path='/editarusu/:id'
								element={<EditarUsu />}></Route>
							<Route
								path='/editarmov/:id'
								element={<EditarMov />}></Route>
							<Route
								path='/editarturnos/:id'
								element={<EditarTurnos />}></Route>
							<Route path='/pagos' element={<Pagos />}></Route>
							<Route
								path='/editarexptes/:id'
								element={<EditarExptes />}></Route>
							<Route path='/cargamov/:id' element={<CargaMov />}></Route>
							<Route path='/cargausu' element={<CargaUsu />}></Route>
							<Route path='/cargacajas' element={<CargaCajas />}></Route>
							<Route path='/admin' element={<Admin />}></Route>
							<Route
								path='/gestionusuarios'
								element={<GestionUsuarios />}></Route>
							<Route
								path='/gestionexpedientes'
								element={<GestionExpedientes />}></Route>
							<Route
								path='/gestionagenda'
								element={<GestionAgenda />}></Route>
							<Route
								path='/gestiongastos'
								element={<GestionGastos />}></Route>
							<Route path='/adminusu' element={<AdminUsu />}></Route>
							<Route
								path='/cargaexptes'
								element={<CargaExptes />}></Route>
							<Route path='/agendausu' element={<AgendaUsu />}></Route>
						</Route>
					</Routes>
					<Footer />
				</AuthProvider>
			</GoogleOAuthProvider>
		</BrowserRouter>
	);
};
