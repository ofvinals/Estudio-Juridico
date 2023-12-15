import React from 'react';
import { Link } from 'react-router-dom';

export const AdminUsu = () => {
	
	// maneja provisoriamente el logout
	const handleLogOut = () => {
		localStorage.removeItem('token');
		<Navigate to='/home' />;
	};
	return (
		<>
			<div className='bodycontact container-fluid'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, ?????</h4>
					<p className='mb-0'>Panel de usuario</p>
				</div>
				<div className='botonesadm'>
					<Link className='botonadm' to='/gestionexpedientes'>
						Gestionar Expedientes
					</Link>
					<Link className='botonadm' to='/agendausu'>
						Solicitar Turnos
					</Link>
					<Link className='botonadm' to='/gestiongastos'>
						Gestionar Gastos
					</Link>
					<button onClick={handleLogOut} className='botonadm'>
						Cerrar Sesion
					</button>
				</div>
			</div>
		</>
	);
};
