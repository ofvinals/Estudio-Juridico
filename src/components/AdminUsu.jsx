import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Admin.css';
import { db } from '../firebase/config';
import { getDocs, collection } from 'firebase/firestore';
import Swal from 'sweetalert2';

export const AdminUsu = () => {
	const { currentUser, logout } = useAuth({});
	const [userId, setUserId] = useState('');
	const navigate = useNavigate();
	const user = currentUser.email;
	const displayName = currentUser.displayName;
	console.log(currentUser.email);

	useEffect(() => {
		const fetchUsuario = async () => {
			try {
				const usuariosRef = collection(db, 'usuarios');
				const snapshot = await getDocs(usuariosRef);
				const userDoc = snapshot.docs.find(
					(doc) => doc.data().email === user
				);
				const userId = userDoc.id;
				setUserId(userId);
			} catch (error) {
				console.error('Error al obtener usuario:', error);
			}
		};
		fetchUsuario();
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
			<div className='bodycontact container-lg'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, {displayName} </h4>
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
					<button className='botonadm' type='button'>
						<a
							className='linkadmin'
							href='https://api.whatsapp.com/send?phone=+543814581382&text=Hola!%20Quiero%20consultar%20por%20servicios%20de%20asesoramiento%20legal.%20'
							target='_blank'>
							<i className='iconavbar bi bi-whatsapp'></i>
							Consultas Online
						</a>
					</button>
					<button
						className='botonadm'
						type='button'
						onClick={() => {
							navigate(`/editarusu/${userId}`);
						}}>
						<i className='iconavbar bi bi-person-fill-gear'></i>
						Modificar Datos
					</button>
					<Link className='botonadm' to='/pagos'>
						<i className='iconavbar bi bi-cash-coin'></i>
						Ver Medios de Pago
					</Link>

					<button onClick={handleLogOut} className='botonlogoutadmin'>
						<i className='iconavbar bi bi-x-circle'></i>
						Cerrar Sesion
					</button>
				</div>
			</div>
		</>
	);
};
