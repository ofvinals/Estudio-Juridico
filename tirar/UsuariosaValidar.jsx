import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import { Form } from 'react-bootstrap';

const USUARIOS_PENDIENTES_KEY = 'usuariospendientes';
const USUARIOS_KEY = 'usuarios';

export const UsuariosaValidar = ({ onUsuariosChange }) => {
	const [usuarios, setUsuarios] = useState([]);
	const [tablaUsuario, setTablaUsuario] = useState([]);
	const [show, setShow] = useState(false);
	const [formValues, setFormValues] = useState({
		nombreEditarUsuario: '',
		apellidoEditarUsuario: '',
		dniEditarUsuario: '',
		domicilioEditarUsuario: '',
		celularEditarUsuario: '',
		emailEditarUsuario: '',
	});
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);

	// Cargar usuarios desde el localStorage al montar el componente
	useEffect(() => {
		try {
			const usuariosaRegistrar =
				JSON.parse(localStorage.getItem(USUARIOS_PENDIENTES_KEY)) || [];
			setUsuarios(usuariosaRegistrar);
		} catch (error) {
			console.error('Error al cargar usuarios pendientes:', error);
		}
	}, []);

	// Cargar la tabla de usuarios cada vez que la lista de usuarios cambie

	useEffect(() => {
		cargarTablaUsuario();
	}, [usuarios]);

	// Función para cargar la tabla de usuarios
	function cargarTablaUsuario() {
		const tabla = usuarios.map((usuario) => (
			<tr key={usuario.id}>
				<td className='align-middle'>{usuario.id}</td>
				<td className='align-middle '>{usuario.nombre}</td>
				<td className='align-middle '>{usuario.apellido}</td>
				<td className='align-middle '>{usuario.celular}</td>
				<td className='align-middle'>{usuario.email}</td>
				<td className='d-flex flex-row'>
					<button
						className='btnacc btn btn-success'
						onClick={() => ValidarUsuario(usuario.id)}>
						<i className='bi bi-check-circle accico'></i>
					</button>
					<button
						className='btnacc btn btn-danger'
						onClick={() => borrarUsuario(usuario.id)}>
						<i className='bi bi-trash-fill accico'></i>
					</button>
					<button
						className='btnacc btn btn-primary'
						onClick={() => verUsuario(usuario.id)}>
						<i className='bi bi-eye accico'></i>
					</button>
				</td>
			</tr>
		));
		setTablaUsuario(tabla);
	}
	// funcion para consultar datos de usuarios
	function verUsuario(id) {
		const usuario = usuarios.find((user) => user.id === id);

		// Establecer los valores en el estado
		setFormValues({
			...formValues,
			nombreEditarUsuario: usuario.nombre,
			apellidoEditarUsuario: usuario.apellido,
			dniEditarUsuario: usuario.dni,
			domicilioEditarUsuario: usuario.domicilio,
			celularEditarUsuario: usuario.celular,
			emailEditarUsuario: usuario.email,
			usuarioIndex: id,
		});

		// Mostrar el modal
		setShow(true);
	}

	// Función para validar un usuario
	function ValidarUsuario(id) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Confirmas la validacion del usuario',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#286606',
			cancelButtonColor: '#8f8e8b',
			confirmButtonText: 'Sí, confirmar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				try {
					const usuarioConfirmado = usuarios.find(
						(usuario) => usuario.id === id
					);
					const usuariosRegistrados =
						JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];
					const nuevosUsuariosRegistrados = [
						...usuariosRegistrados,
						usuarioConfirmado,
					];

					localStorage.setItem(
						USUARIOS_KEY,
						JSON.stringify(nuevosUsuariosRegistrados)
					);
					const usuariosPendientes = usuarios.filter(
						(usuario) => usuario.id !== id
					);
					localStorage.setItem(
						USUARIOS_PENDIENTES_KEY,
						JSON.stringify(usuariosPendientes)
					);

					setUsuarios(usuariosPendientes);
					cargarTablaUsuario();

					if (onUsuariosChange) {
						onUsuariosChange(nuevosUsuariosRegistrados);
					}

					Swal.fire(
						'Validado',
						'El usuario fue validado con éxito',
						'success'
					);
				} catch (error) {
					console.error('Error al validar usuario:', error);
				}
			}
		});
	}

	// funcion para eliminar usuarios
	function borrarUsuario(id) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Confirmas la eliminacion del usuario no validado?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#8f8e8b',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				// Filtrar
				const usuariosRestantes = usuarios.filter(
					(usuario) => usuario.id !== id
				);

				// Actualizar el estado de usuarios con la nueva lista filtrada
				setUsuarios(usuariosRestantes);

				// Actualizar el localStorage con la nueva lista filtrada
				localStorage.setItem(
					'usuariospendientes',
					JSON.stringify(usuariosRestantes)
				);

				// Eliminar el usuario específico del Local Storage
				const usuariosPendientes =
					JSON.parse(localStorage.getItem('usuariospendientes')) ||
					[];
				const nuevosUsuariosPendientes = usuariosPendientes.filter(
					(usuario) => usuario.id !== id
				);
				localStorage.setItem(
					'usuariospendientes',
					JSON.stringify(nuevosUsuariosPendientes)
				);

				// Cargar la tabla de usuarios actualizada
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
		<div>
			{/* <!-- tabla usuarios a validar--> */}
			<div>
				<p className=' mt-3 titleadm text-center'>
					Lista de usuarios pendientes de validar
				</p>
			</div>
			<div className='container table-responsive '>
				<Table className='text-center table striped bordered hover variant="dark" border border-secondary-subtle'>
					<thead>
						<tr>
							<th>#ID</th>
							<th>Nombre</th>
							<th>Apellido</th>
							<th>Celular</th>
							<th>Email</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody id='tablaUsuario' className='table-group-divider'>
						{tablaUsuario}
					</tbody>
				</Table>
			</div>

			{/* <!-- Modal para visualizar datos de usuarios --> */}
			<div id='verUsuarioModal' className='modal my-auto mx-auto'>
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title className='modedittitle'>
							Ver Datos de Usuario
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group
								className='mb-3'
								controlId='nombreEditarUsuario'>
								<Form.Label className='modeditlabel'>
									Nombre
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='Nombre'
									readOnly
									value={formValues.nombreEditarUsuario}
								/>
							</Form.Group>
							<Form.Group
								className='mb-3'
								controlId='apellidoEditarUsuario'>
								<Form.Label className='modeditlabel'>
									Apellido
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='Apellido'
									readOnly
									value={formValues.apellidoEditarUsuario}
								/>
							</Form.Group>
							<Form.Group
								className='mb-3'
								controlId='dniEditarUsuario'>
								<Form.Label className='modeditlabel'>
									DNI/CUIT
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='DNI/CUIT'
									readOnly
									value={formValues.dniEditarUsuario}
								/>
							</Form.Group>
							<Form.Group
								className='mb-3'
								controlId='domicilioEditarUsuario'>
								<Form.Label className='modeditlabel'>
									Domicilio
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='Domicilio'
									readOnly
									value={formValues.domicilioEditarUsuario}
								/>
							</Form.Group>
							<Form.Group
								className='mb-3'
								controlId='celularEditarUsuario'>
								<Form.Label className='modeditlabel'>
									Celular
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='Celular'
									readOnly
									value={formValues.celularEditarUsuario}
								/>
							</Form.Group>
							<Form.Group
								className='mb-3'
								controlId='emailEditarUsuario'>
								<Form.Label className='modeditlabel'>
									Email
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='email'
									placeholder='name@example.com'
									readOnly
									value={formValues.emailEditarUsuario}
								/>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<button
							className='btnacc btn btn-success w-50'
							onClick={(e) => handleClose()}>
							Cerrar
						</button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	);
};
