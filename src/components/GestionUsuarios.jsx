import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import Swal from 'sweetalert2';
import '../components/UsuariosaValidar';
import '../css/GestionUsuarios.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const GestionUsuarios = () => {
	const auth = useAuth();
	const { email } = auth.user;

	const [show, setShow] = useState(false);
	const [usuarios, setUsuarios] = useState([]);
	const [tablaUsuario, setTablaUsuario] = useState();

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Cargar usuarios desde el localStorage al montar el componente
	useEffect(() => {
		const ListaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(ListaUsuarios);
	}, []);

	useEffect(() => {
		cargarTablaUsuario();
	}, [usuarios]);

	// Funcion para cargar tabla de Usuario traida de Local Storage
	function cargarTablaUsuario() {
		const tabla = usuarios.map((usuario) => (
			<tr key={usuario.id}>
				<td className='align-middle '>{usuario.nombre}</td>
				<td className='align-middle '>{usuario.apellido}</td>
				<td className='align-middle '>{usuario.celular}</td>
				<td className='align-middle'>{usuario.email}</td>
				<td className='align-middle'>{usuario.dni}</td>
				<td>
					<div className='d-flex flex-row justify-content-around'>
						<Link
							hidden={usuario.email === 'admin@gmail.com'}
							className='btnaccusu '
							to={`/editarusu/${usuario.id}`}>
							<i className='bi bi-pen  accico'></i>
						</Link>
						<button
							className='btnborrarusu'
							onClick={() => borrarUsuario(usuario.id)}
							hidden={usuario.email === 'admin@gmail.com'}>
							<i className='bi bi-trash-fill  accico'></i>
						</button>
					</div>
				</td>
			</tr>
		));
		setTablaUsuario(tabla);
	}

	// funcion para eliminar usuarios
	function borrarUsuario(id) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Confirmas la eliminacion de un usuario',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#8f8e8b',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				// Filtrar
				const nuevosUsuarios = usuarios.filter(function (usuario) {
					return usuario.id !== id;
				});
				localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
				setUsuarios(nuevosUsuarios);
				cargarTablaUsuario();
				Swal.fire(
					'Eliminado',
					'El usuario fue eliminado con exito',
					'success'
				);
			}
		});
	}

	return (
		<>
			<div className='bodygestion container-fluid bg-dark'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
					<p className='subtitleadusu'>Panel de Administracion de Usuarios</p>
				</div>
			</div>

			<div className='bg-dark'>
				<div className='d-flex justify-content-around'>
					<Link
						to='/cargausu'
						type='button'
						className='btnusu align-self-center '
						data-bs-toggle='modal'
						data-bs-target='#Modal'>
						<i className='iconavbar bi bi-file-earmark-plus'></i>
						Agregar usuario
					</Link>
					<Link to='/Admin' className='btnusu align-self-center '>
						<i className='iconavbar bi bi-box-arrow-left'></i>
						Volver al Panel
					</Link>
				</div>

				{/* <!-- Tabla de usuarios --> */}
				<div>
					<p className='mt-3 subtitleadusu text-center'>Usuarios registrados</p>
				</div>

				<div className='container table-responsive'>
					<Table
						striped
						hover
						variant='dark'
						className='tablausuarios text-center table  border border-secondary-subtle'>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Apellido</th>
								<th>Celular</th>
								<th>Email</th>
								<th>DNI</th>
								<th className='acciones'>Acciones</th>
							</tr>
						</thead>
						<tbody id='tablaUsuario' className='table-group-divider'>
							{tablaUsuario}
						</tbody>
					</Table>
				</div>
			</div>			
		</>
	);
};
