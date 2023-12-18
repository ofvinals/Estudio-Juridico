import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export const AdminUsu = () => {
	const auth = useAuth();
	const { email } = auth.user;
	console.log(email);

	const navigate = useNavigate();

	const handleLogOut = () => {
		auth.logout();
		// localStorage.removeItem('token');
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
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
					<p className='mb-0'>Panel de usuario</p>
				</div>

				<div className='botonesadm'>
					<Link className='botonadm' to='/consultaexpedientes'>
						Consultar Expedientes
					</Link>
					<Link className='botonadm' to='/agendausu'>
						Solicitar Turnos
					</Link>
					<Link className='botonadm' to='/gestiongastos'>
						Consultar Gastos
					</Link>
					
					<button onClick={handleLogOut} className='botonlogout'>
						Cerrar Sesion
					</button>
				</div>
			</div>
		</>
	);
};
