import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import '../css/Admin.css';

export const Admin = () => {
	const auth = useAuth();
	const { email } = auth.user;
	console.log(email);

	const navigate = useNavigate();

	const handleLogOut = () => {
		auth.logout();
		navigate('/home');
		console.log('Deslogueado');
		Swal.fire({
			icon: 'success',
			title: 'Su sesion fue cerrada!',
			showConfirmButton: false,
			timer: 1500,
		});
	};
	return (
		<>
			<div className='bodycontact container-fluid'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
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
					
					<Link className='botonlogout' onClick={handleLogOut} to='/home'>
						Cerrar Sesion
					</Link>
				</div>
			</div>
		</>
	);
};
