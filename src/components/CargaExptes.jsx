import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import '../css/CargaExpedientes.css';
import { Button } from 'react-bootstrap';

export const CargaExptes = () => {
	const auth = useAuth();
	const { email } = auth.user;
	console.log(email);

	const navigate = useNavigate();
	const initialForm = {
		nroexpte: '',
		radicacion: '',
		caratula: '',
		actor: '',
		demandado: '',
		proceso: '',
	};
	const [form, setForm] = useState(initialForm);
	const [show, setShow] = useState(false);
	const [exptes, setExptes] = useState([]);
	const [tablaExpte, setTablaExpte] = useState();
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Cargar expedientes desde el localStorage al montar el componente
	useEffect(() => {
		const ListaExpte = JSON.parse(localStorage.getItem('exptes')) || [];
		setExptes(ListaExpte);
	}, []);

	//funcion para agregar expedientes
	const agregarExpte = (newExpte) => {
		const ListaExptes = [...exptes, newExpte];
		setExptes(ListaExptes);
		localStorage.setItem('exptes', JSON.stringify(ListaExptes));
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Verifica que todos los campos contengan datos
	const handleBlur = (e) => {
		if (e.target.value === '' || +e.target.value === 0) {
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Todos los campos son obligatorios!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		}
	};
	function handleSubmit(e) {
		const { nroexpte, radicacion, caratula, actor, demandado, proceso } =
			form;

		// Verifica si el expediente ya se encuentran registrados en el Local Storage
		const existeExpte = exptes.find((expte) => expte.nroexpte === expte);

		if (existeExpte !== undefined) {
			Swal.fire({
				icon: 'error',
				title: 'Expediente Existente',
				text: 'Lo siento, el expediente ingresado ya esta registrado!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		}
		const id = Date.now();
		const newExpte = {
			id,
			nroexpte,
			radicacion,
			caratula,
			actor,
			demandado,
			proceso,
		};

		agregarExpte(newExpte);

		Swal.fire({
			icon: 'success',
			title: 'Expediente registrado correctamente',
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			// Después de mostrar el SweetAlert, redirigir al expte al formulario de inicio de sesión (login.html)

			window.location.href = '/gestionexpedientes';

			// Restablecer el formulario después de la redirección
			setForm(initialForm);
		});
	}
	return (
		<>
			<div className='container-fluid bg-dark'>
				<div className='main px-3 bodyadexped '>
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
					<p className=''>Panel de Administracion de Expedientes</p>
				</div>
            <div className='d-flex justify-content-around'>
               <Link to='/gestionexpedientes' className='btnadexp'>
							Volver al Panel
						</Link>
            </div>
				<section className='registerexpe'>
					<Form
						id='cargaexpForm'
						className='cargaexpForm container fluid bg-dark'>
						<h2 className='titlecargaexp'>Agregar Nuevo Expediente</h2>

						<Form.Group className='mb-3' controlId='inputname'>
							<Form.Label className='labelcargaexp'>
								Nro Expediente
							</Form.Label>
							<Form.Control
								className='inputcargaexp'
								type='text'
								name='nroexpte'
								value={form.nroexpte}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Group>

						<Form.Group className='mb-3' controlId='inputsubname'>
							<Form.Label className='labelreg'>Radicacion</Form.Label>
							<Form.Control
								className='inputreg'
								type='text'
								name='radicacion'
								value={form.radicacion}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Group>

						<Form.Group className='mb-3' controlId='inputdomic'>
							<Form.Label className='labelreg'>Actor</Form.Label>
							<Form.Control
								className='inputreg'
								type='text'
								name='actor'
								value={form.actor}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Group>

						<Form.Group className='mb-3' controlId='inputcel'>
							<Form.Label className='labelreg'>Demandado</Form.Label>
							<Form.Control
								className='inputreg'
								type='text'
								name='demandado'
								value={form.demandado}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Group>
                  
						<Form.Group className='mb-3' controlId='inputdni'>
							<Form.Label className='labelreg'>Caratula</Form.Label>
							<Form.Control
								className='inputreg'
								type='text'
								name='caratula'
								value={form.caratula}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Group>

						<Form.Group className='mb-3' controlId='inputemail'>
							<Form.Label className='labelreg'>
								Tipo de Proceso
							</Form.Label>
							<Form.Control
								className='inputreg'
								type='text'
								name='proceso'
								value={form.proceso}
								onChange={(e) => {
									handleChange(e);
								}}
								onBlur={handleBlur}
							/>
						</Form.Group>

						{/* <Form.Group className='mb-3'>
							<Form.Label className='labelreg'>Contraseña</Form.Label>
							<Form.Control
								className='inputreg'
								type='password'
								name='password'
								value={form.password}
								onChange={(e) => {
									handleChange(e);
									setPasswordRegister(e.target.value);
								}}
								onBlur={handleBlur}
							/>
						</Form.Group>

						<Form.Group className='mb-3'>
							<Form.Label className='labelreg' controlid='inputconfirm'>
								Confirmar Contraseña
							</Form.Label>
							<Form.Control
								className='inputreg'
								type='password'
								name='confpassword'
								value={form.confpassword}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Group> */}

						<Form.Group
							className='mb-3 d-flex justify-content-center flex-column align-items-center'
							controlId='inputpassword'>
							<Button
								disabled={Object.values(form).some(
									(valor) => valor === '' || valor === 0
								)}
								className='botoncargaexp'
								onClick={handleSubmit}>
								Agregar
							</Button>
						</Form.Group>
					</Form>
				</section>
			</div>
		</>
	);
};
