import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import '../css/Admin.css';

export const Admin = () => {
	// maneja provisoriamente el logout
	const navigate = useNavigate();

	const handleLogOut = () => {
		localStorage.removeItem('token');
		navigate('/admin');
	};

	return (
		<>
			<div className='bodycontact container-fluid'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, Admin</h4>
					<p className='mb-0'>Panel de Administracion</p>
				</div>
				<div className='botonesadm'>
					<Link className='botonadm' to='/gestionusuarios'>
						Gestionar Usuarios
					</Link>
					<Link className='botonadm' to='/gestionexpedientes'>
						Gestionar Expedientes
					</Link>
					<Link className='botonadm' to='/gestionagenda'>
						Gestionar Agenda
					</Link>
					<Link className='botonadm' to='/gestiongastos'>
						Gestionar Gastos
					</Link>
					<Link onClick={handleLogOut} to='/home' className='botonadm'>
						Cerrar Sesion
					</Link>
				</div>
			</div>
		</>
	);
};
