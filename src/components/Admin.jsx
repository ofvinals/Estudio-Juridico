import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import '../css/Admin.css';

export const Admin = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogOut = () => {
		logout();
		Swal.fire({
			icon: 'success',
			title: 'Su sesion fue cerrada!',
			showConfirmButton: false,
			timer: 1500,
		});
		navigate('/home');
	};

	return (
		<>
			<div className='bodycontact container-fluid'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, {user.email}</h4>
					<p className='subtitleadusu'>Panel de Administracion</p>
				</div>

				<div className='botonesadm'>
					<Link className='botonadm' to='/gestionusuarios'>
						<i className='iconavbar bi bi-people-fill'></i>
						Gestionar Usuarios
					</Link>
					<Link className='botonadm' to='/gestionexpedientes'>
						<i className='iconavbar bi bi-archive-fill'></i>
						Gestionar Expedientes
					</Link>
					<Link className='botonadm' to='/gestionagenda'>
						<i className='iconavbar bi bi-calendar-check'></i>
						Gestionar Agenda
					</Link>
					<Link className='botonadm' to='/gestiongastos'>
						<i className='iconavbar bi bi-coin'></i>
						Gestionar Gastos
					</Link>
					<Link className='botonadm' to='/gestioncaja'>
					<i className="iconavbar bi bi-cash-coin"></i>
						Gestion de Caja
					</Link>

					<Link className='botonlogout' onClick={handleLogOut} to='/home'>
						<i className='iconavbar bi bi-x-circle'></i>
						Cerrar Sesion
					</Link>
				</div>
			</div>
		</>
	);
};
