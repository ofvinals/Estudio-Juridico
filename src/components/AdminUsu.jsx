import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import '../css/Admin.css'

export const AdminUsu = () => {
	const {user, logout} = useAuth();
	const navigate = useNavigate();

	const handleLogOut = () => {
		logout();
		navigate('/home');
		console.log('Deslogueado');
		Swal.fire({
			icon: 'success',
			title: 'Su sesion fue cerrada!',
			showConfirmButton: false,
			timer: 2500,
		});
	};
	return (
		<>
			<div className='bodycontact container-fluid'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, {user.email}</h4>
					<p className='subtitleadusu'>Panel de Usuario</p>
				</div>

				<div className='botonesadm'>
					<Link className='botonadm' to='/gestionexpedientes'>
						<i className='iconavbar bi bi-archive-fill'></i>
						Consultar Expedientes
					</Link>
					<Link className='botonadm' to='/agendausu'>
						<i className='iconavbar bi bi-calendar-check'></i>
						Solicitar Turno
					</Link>
					<Link className='botonadm' to='/gestiongastos'>
						<i className='iconavbar bi bi-coin'></i>
						Consultar Gastos
					</Link>

					<button onClick={handleLogOut} className='botonlogout'>
						<i className='iconavbar bi bi-x-circle'></i>
						Cerrar Sesion
					</button>
				</div>
			</div>
		</>
	);
};
