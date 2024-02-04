import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Admin.css';
import { Notas } from './Notas';
import Swal from 'sweetalert2';

export const Admin = () => {
	const { currentUser, logout } = useAuth({});
	const navigate = useNavigate();
	const user = currentUser.email
	const displayName = currentUser.displayName
	
	useEffect(() => {
		if (
			!user ||
			(user !== 'ofvinals@gmail.com' &&
				user !== 'estudioposseyasociados@gmail.com')
		) {
			navigate('/adminusu');
		}
	}, []);

	const handleLogOut = async () => {
		await logout();
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
			<div className='container-lg bodyadmin'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, {displayName} </h4>
					<h3 className='subtitleadusu'>Panel de Administracion</h3>
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
					{!user || user === 'ofvinals@gmail.com' ? (
						<Link className='botonadm' to='/gestioncaja'>
							<i className='iconavbar bi bi-cash-coin'></i>
							Gestion de Caja
						</Link>
					) : null}

					<Link
						className='botonlogoutadmin'
						onClick={handleLogOut}
						to='/home'>
						<i className='iconavbar bi bi-x-circle'></i>
						Cerrar Sesion
					</Link>
				</div>
			</div>
			<Notas />
		</>
	);
};
