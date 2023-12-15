import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import '../components/UsuariosaValidar';
import '../css/GestionUsuarios.css';
import { UsuariosaValidar } from './UsuariosaValidar';
import { Link } from 'react-router-dom';

export const GestionUsuarios = () => {
	const [show, setShow] = useState(false);
	const [usuarios, setUsuarios] = useState([]);
	const [tablaUsuario, setTablaUsuario] = useState();
	const [formValues, setFormValues] = useState({
		nombreEditarUsuario: '',
		apellidoEditarUsuario: '',
		dniEditarUsuario: '',
		domicilioEditarUsuario: '',
		celularEditarUsuario: '',
		emailEditarUsuario: '',
		usuarioIndex: null,
	});
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Actualizar la tabla después de cualquier cambio
	const handleUsuariosChange = (nuevosUsuarios) => {
		setUsuarios(nuevosUsuarios);
		cargarTablaUsuario();
	};
	// Cargar usuarios desde el localStorage al montar el componente
	useEffect(() => {
		const ListaUsuarios =
			JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(ListaUsuarios);
	}, []);

	useEffect(() => {
		cargarTablaUsuario();
	}, [usuarios]);

	function cargarTablaUsuario() {
		const tabla = usuarios.map((usuario) => (
			<tr key={usuario.id}>
				<td className='align-middle'>{usuario.id}</td>
				<td className='align-middle '>{usuario.nombre}</td>
				<td className='align-middle '>{usuario.apellido}</td>
				<td className='align-middle '>{usuario.celular}</td>
				<td className='align-middle'>{usuario.email}</td>
				<td>
					<div className='d-flex flex-row'>
						<button
							className='btnacc btn btn-success'
							onClick={() =>
								mostrarEditarUsuarioModal(usuario.id)
							}
							hidden={usuario.email === 'admin@gmail.com'}>
							<i className='bi bi-pen  accico'></i>
						</button>
						<button
							className='btnacc btn btn-danger'
							onClick={() => borrarUsuario(usuario.id)}
							hidden={usuario.email === 'admin@gmail.com'}>
							<i className='bi bi-trash-fill  accico'></i>
						</button>
						<button
							className='btnacc btn btn-primary'
							onClick={() => verUsuario(usuario.id)}>
							<i className='bi bi-eye accico'></i>
						</button>
					</div>
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
	// funcion para mostrar el modal de edicion de usuarios
	function mostrarEditarUsuarioModal(id) {
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

	function editarUsuarios(e) {
		e.preventDefault();

		const {
			nombreEditarUsuario,
			apellidoEditarUsuario,
			dniEditarUsuario,
			domicilioEditarUsuario,
			celularEditarUsuario,
			emailEditarUsuario,
			usuarioIndex,
		} = formValues;

		//expresion regular para validar email
		const validarEmail = /^[\w+.-]+@\w+([.-]?\w+)*(\.\w{2,})+$/;
		const resultadoValidacionEmail = validarEmail.test(emailEditarUsuario);
		//expresion regular para validar nombre
		const validarNombre = /^[a-zA-Z]+$/;
		const resultadoValidacionNombre =
			validarNombre.test(nombreEditarUsuario);

		//validaciones
		if (nombreEditarUsuario === '' || emailEditarUsuario === '') {
			mostrarError('*Todos los campos son obligatorios*');
			return;
		} else if (!resultadoValidacionEmail) {
			mostrarError('*Ingrese un Email valido*');
			return;
		} else if (!resultadoValidacionNombre) {
			mostrarError(
				'*Ingrese un nombre que no contenga signos, numeros ni caracteres especiales*'
			);
			return;
		} else {
			Swal.fire({
				icon: 'success',
				text: 'Editado exitosamente!',
				confirmButtonColor: '#8f8e8b',
			});
		}
		const usuarioIndexInt = parseInt(formValues.usuarioIndex, 10);
		const nuevosUsuarios = usuarios.map((user) =>
			user.id === usuarioIndexInt
				? {
						...user,
						nombre: formValues.nombreEditarUsuario,
						apellido: formValues.apellidoEditarUsuario,
						dni: formValues.dniEditarUsuario,
						domicilio: formValues.domicilioEditarUsuario,
						celular: formValues.celularEditarUsuario,
						email: formValues.emailEditarUsuario,
				  }
				: { ...user }
		);

		// Actualizar el estado de usuarios, luego de editar
		setUsuarios(nuevosUsuarios);

		localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
		cargarTablaUsuario();
		setShow(false);
		setShowConfirmationModal(false);
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
				localStorage.setItem(
					'usuarios',
					JSON.stringify(nuevosUsuarios)
				);
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

	function mostrarError(mensaje) {
		formErrorModalEditUser.textContent = mensaje;

		setTimeout(() => {
			formErrorModalEditUser.textContent = '';
		}, 3000);
	}

	return (
		<>
			{/* Encabezado del componente */}
			<div className='bodygestion container-fluid bg-dark'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, Admin</h4>
					<p className=''>Panel de Administracion de Usuarios</p>
				</div>
			</div>
			<div className='bg-dark'>
				<div className='d-flex justify-content-around'>
					<Link
						to='/registro'
						type='button'
						className='btnusu align-self-center '
						data-bs-toggle='modal'
						data-bs-target='#Modal'>
						Agregar usuarios
					</Link>
					<Link to='/Admin' className='btnusu align-self-center '>
						Volver al Panel
					</Link>
				</div>

				{/* componente para cargar usuarios a validar
				<UsuariosaValidar onUsuariosChange={handleUsuariosChange} /> */}

				{/* <!-- tabla usuarios validados--> */}
				<div>
					<p className='titleadm text-center'>Usuarios registrados</p>
				</div>
				<div className='container table-responsive'>
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
						<tbody
							id='tablaUsuario'
							className='table-group-divider'>
							{tablaUsuario}
						</tbody>
					</Table>
				</div>

				{/* <!-- Modal Editar Usuario --> */}
				<div id='editUsuarioModal' className='modal my-auto mx-auto'>
					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title className='modedittitle'>
								Editar Datos de Usuario
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
										value={formValues.nombreEditarUsuario}
										onChange={(e) =>
											setFormValues({
												...formValues,
												nombreEditarUsuario:
													e.target.value,
											})
										}
										autoFocus
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
										value={formValues.apellidoEditarUsuario}
										onChange={(e) =>
											setFormValues({
												...formValues,
												apellidoEditarUsuario:
													e.target.value,
											})
										}
										autoFocus
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
										value={formValues.dniEditarUsuario}
										onChange={(e) =>
											setFormValues({
												...formValues,
												dniEditarUsuario:
													e.target.value,
											})
										}
										autoFocus
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
										value={
											formValues.domicilioEditarUsuario
										}
										onChange={(e) =>
											setFormValues({
												...formValues,
												domicilioEditarUsuario:
													e.target.value,
											})
										}
										autoFocus
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
										value={formValues.celularEditarUsuario}
										onChange={(e) =>
											setFormValues({
												...formValues,
												celularEditarUsuario:
													e.target.value,
											})
										}
										autoFocus
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
										value={formValues.emailEditarUsuario}
										onChange={(e) =>
											setFormValues({
												...formValues,
												emailEditarUsuario:
													e.target.value,
											})
										}
									/>
								</Form.Group>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<button
								className='btnacc btn btn-success w-50'
								onClick={(e) => setShowConfirmationModal(true)}>
								Guardar cambios
							</button>
							<button
								className='btnacc btn btn-danger'
								onClick={(e) => handleClose()}>
								Cancelar
							</button>

							<p id='formErrorModalEditUser' className='m-3'></p>
						</Modal.Footer>
					</Modal>
				</div>

				{/* <!-- Modal para confirmar edicion --> */}
				<Modal
					show={showConfirmationModal}
					onHide={() => setShowConfirmationModal(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Confirmar cambios</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Estás seguro de que deseas guardar los cambios?
					</Modal.Body>
					<Modal.Footer>
						<button
							className='btnacc btn btn-success w-50'
							onClick={(e) => {
								editarUsuarios(e);
								handleClose();
							}}>
							Confirmar
						</button>
						<button
							className='btnacc btn btn-danger'
							onClick={() => {
								setShowConfirmationModal(false);
								handleClose();
							}}>
							Cancelar
						</button>
					</Modal.Footer>
				</Modal>
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
		</>
	);
};
