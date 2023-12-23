import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/EditaUsu.css';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

export const EditarUsu = () => {
	const auth = useAuth();
	const { id } = useParams();
	const { email } = auth.user;
	const navigate = useNavigate();

	const [show, setShow] = useState(false);
	const [usuarios, setUsuarios] = useState([]);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [formValues, setFormValues] = useState({
		nombreEditarUsuario: '',
		apellidoEditarUsuario: '',
		dniEditarUsuario: '',
		domicilioEditarUsuario: '',
		celularEditarUsuario: '',
		emailEditarUsuario: '',
		usuarioIndex: '',
	});

	const handleCancel = () => {
		navigate('/gestionusuarios');
	};

	const handleShow = () => setShow(true);

	// Cargar usuarios desde el localStorage al montar el componente
	useEffect(() => {
		const ListaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(ListaUsuarios);
	}, []);

	// funcion para mostrar  edicion de usuarios
	useEffect(() => {
		const usuario = usuarios.find((user) => user.id === parseInt(id, 10));
		// Establecer los valores en el estado
		if (usuario) {
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
		}
	}, [id, usuarios]);

	// Funcion para editar datos de usuarios
	function editarUsuarios() {
		const {
			nombreEditarUsuario,
			apellidoEditarUsuario,
			dniEditarUsuario,
			domicilioEditarUsuario,
			celularEditarUsuario,
			emailEditarUsuario,
			usuarioIndex,
		} = formValues;

		const usuarioIndexInt = parseInt(usuarioIndex, 10);
		const nuevosUsuarios = usuarios.map((user) =>
			user.id === usuarioIndexInt
				? {
						...user,
						nombre: nombreEditarUsuario,
						apellido: apellidoEditarUsuario,
						dni: dniEditarUsuario,
						domicilio: domicilioEditarUsuario,
						celular: celularEditarUsuario,
						email: emailEditarUsuario,
				  }
				: { ...user }
		);

		//expresion regular para validar email
		const validarEmail = /^[\w+.-]+@\w+([.-]?\w+)*(\.\w{2,})+$/;
		const resultadoValidacionEmail = validarEmail.test(emailEditarUsuario);
		//expresion regular para validar nombre
		const validarNombre = /^[a-zA-Z]+$/;
		const resultadoValidacionNombre = validarNombre.test(nombreEditarUsuario);

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
				timer: 1500,
			});
		}

		// Actualizar el estado de usuarios, luego de editar
		setUsuarios(nuevosUsuarios);

		localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
		setShow(false);
		setShowConfirmationModal(false);
		{
			navigate('/gestionusuarios');
		}
	}

	return (
		<>
			<section className='editusu'>
				<Form className='editusuForm container-fluid bg-dark'>
					<h2 className='titleeditusu'>Modificar Datos de Usuario</h2>
					<Form.Group className='mb-3' controlId='nombreEditarUsuario'>
						<Form.Label className='labeleditusu'>Nombre</Form.Label>
						<Form.Control
							className='inputeditusu'
							type='text'
							placeholder='Nombre'
							value={formValues.nombreEditarUsuario}
							onChange={(e) =>
								setFormValues({
									...formValues,
									nombreEditarUsuario: e.target.value,
								})
							}
							autoFocus
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='apellidoEditarUsuario'>
						<Form.Label className='labeleditusu'>Apellido</Form.Label>
						<Form.Control
							className='inputeditusu'
							type='text'
							placeholder='Apellido'
							value={formValues.apellidoEditarUsuario}
							onChange={(e) =>
								setFormValues({
									...formValues,
									apellidoEditarUsuario: e.target.value,
								})
							}
							autoFocus
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='dniEditarUsuario'>
						<Form.Label className='labeleditusu'>DNI/CUIT</Form.Label>
						<Form.Control
							className='inputeditusu'
							type='text'
							placeholder='DNI/CUIT'
							value={formValues.dniEditarUsuario}
							onChange={(e) =>
								setFormValues({
									...formValues,
									dniEditarUsuario: e.target.value,
								})
							}
							autoFocus
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='domicilioEditarUsuario'>
						<Form.Label className='labeleditusu'>Domicilio</Form.Label>
						<Form.Control
							className='inputeditusu'
							type='text'
							placeholder='Domicilio'
							value={formValues.domicilioEditarUsuario}
							onChange={(e) =>
								setFormValues({
									...formValues,
									domicilioEditarUsuario: e.target.value,
								})
							}
							autoFocus
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='celularEditarUsuario'>
						<Form.Label className='labeleditusu'>Celular</Form.Label>
						<Form.Control
							className='inputeditusu'
							type='text'
							placeholder='Celular'
							value={formValues.celularEditarUsuario}
							onChange={(e) =>
								setFormValues({
									...formValues,
									celularEditarUsuario: e.target.value,
								})
							}
							autoFocus
						/>
					</Form.Group>
					<Form.Group className='mb-3' controlId='emailEditarUsuario'>
						<Form.Label className='labeleditusu'>Email</Form.Label>
						<Form.Control
							className='inputeditusu'
							type='email'
							placeholder='name@example.com'
							value={formValues.emailEditarUsuario}
							onChange={(e) =>
								setFormValues({
									...formValues,
									emailEditarUsuario: e.target.value,
								})
							}
						/>
					</Form.Group>
					<Form.Group className='mb-3 botoneseditusu'>
						<Button
							className='botoneditusu'
							onClick={(e) => setShowConfirmationModal(true)}>
							<i className='me-2 fs-6 bi bi-check2-square'></i>
							Guardar cambios
						</Button>
						<Link to='/gestionusuarios' className='botoncanceditusu'>
							<i className='me-2 fs-6 bi bi-x-circle-fill'></i>
							Cancelar
						</Link>
					</Form.Group>
				</Form>
			</section>

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
						className='btnacept'
						onClick={(e) => {
							editarUsuarios(e);
						}}>
						Confirmar
					</button>
					<button
						className='btncanc'
						onClick={() => {
							setShowConfirmationModal(false);
						}}>
						Cancelar
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
