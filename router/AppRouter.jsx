import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import { AuthContext } from '../src/context/AuthContext';
import { CargaUsu } from '../src/components/CargaUsu';
import { EditarUsu } from '../src/components/EditarUsu';
import { EditarTurnos } from '../src/components/EditarTurnos';
import { MovExptes } from '../src/components/MovExptes';
import { ExptesArchivados } from '../src/components/ExptesArchivados';
import { EditarMov } from '../src/components/EditarMov';
import { CargaGastos } from '../src/components/CargaGastos';
import { EditarGastos } from '../src/components/EditarGastos';

export const AppRouter = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path='/' element={<Home />}></Route>
					<Route path='/home' element={<Home />}></Route>
					<Route path='/login' element={<Login />}></Route>
					<Route path='/authcontext' element={<AuthContext />}></Route>
					<Route path='/registro' element={<Registro />}></Route>
					<Route path='/nosotros' element={<Nosotros />}></Route>
					<Route path='/contact' element={<Contact />}></Route>
					<Route path='/recuperar' element={<Recuperar />}></Route>
					<Route path='/especialidad' element={<Especialidad />}></Route>
					<Route path='/interes' element={<Interes />}></Route>
					<Route element={<PrivateRoute />}>
						<Route
							path='/exptesarchivados'
							element={<ExptesArchivados />}></Route>
						<Route path='/movexptes/:id' element={<MovExptes />}></Route>
						<Route
							path='/gestiongastos'
							element={<GestionGastos />}></Route>
						<Route path='/cargagastos' element={<CargaGastos />}></Route>
						<Route
							path='/editargastos/:id'
							element={<EditarGastos />}></Route>
						<Route path='/editarusu/:id' element={<EditarUsu />}></Route>
						<Route path='/editarmov/:id' element={<EditarMov />}></Route>
						<Route
							path='/editarturnos/:id'
							element={<EditarTurnos />}></Route>
						<Route
							path='/editarexptes/:id'
							element={<EditarExptes />}></Route>
						<Route path='/cargausu' element={<CargaUsu />}></Route>
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
						<Route path='/cargaexptes' element={<CargaExptes />}></Route>
						<Route path='/agendausu' element={<AgendaUsu />}></Route>
					</Route>
				</Routes>
				<Footer />
			</BrowserRouter>
		</AuthProvider>
	);
};
