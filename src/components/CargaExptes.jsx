import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import '../css/CargaExpte.css';
import { Button } from 'react-bootstrap';

export const CargaExptes = () => {
	const auth = useAuth();
	const { email } = auth.user;

	const navigate = useNavigate();
	const initialForm = {
		cliente: '',
		nroexpte: '',
		radicacion: '',
		juzgado: '',
		caratula: '',
		actor: '',
		demandado: '',
		proceso: '',
		estado: '',
	};
	const [form, setForm] = useState(initialForm);
	const [show, setShow] = useState(false);
	const [exptes, setExptes] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	const [tablaExpte, setTablaExpte] = useState();
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Cargar expedientes desde el localStorage al montar el componente
	useEffect(() => {
		const ListaExpte = JSON.parse(localStorage.getItem('exptes')) || [];
		setExptes(ListaExpte);
	}, []);

	// Cargar usuarios desde el localStorage al montar el componente
	useEffect(() => {
		const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(usuarios);
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
		const {
			cliente,
			nroexpte,
			radicacion,
			juzgado,
			caratula,
			actor,
			demandado,
			proceso,
			estado,
		} = form;

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
			cliente,
			nroexpte,
			radicacion,
			juzgado,
			caratula: `${actor} C/ ${demandado} S/ ${proceso}`,
			actor,
			demandado,
			proceso,
			estado,
		};

		agregarExpte(newExpte);

		Swal.fire({
			icon: 'success',
			title: 'Expediente registrado correctamente',
			showConfirmButton: false,
			timer: 1500,
		});
		// Restablecer el formulario después de la redirección
		setForm(initialForm);
		navigate('/gestionexpedientes');
	}

	return (
		<>
			<section className='cargaexpe'>
				<Form className='Formcargexp container fluid bg-dark'>
					<h2 className='titlecargaexp'>Agregar Nuevo Expediente</h2>

					<Form.Group className='formcargaexp' controlId='inputname'>
						<Form.Label className='labelcargaexp'>Cliente</Form.Label>
						<select
							size='sm'
							className='inputcargaexp'
							aria-label='Default select example'
							name='cliente'
							value={form.cliente}
							onChange={handleChange}
							onBlur={handleBlur}>
							<option>Selecciona..</option>
							{usuarios.map((usuario) => (
								<option key={usuario.id} value={usuario.email}>
									{usuario.email}
								</option>
							))}
						</select>
					</Form.Group>

					<Form.Group className='formcargaexp' controlId='inputname'>
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

					<Form.Group className='formcargaexp' controlId='inputsubname'>
						<Form.Label className='labelcargaexp'>
							Fuero de Radicacion
						</Form.Label>
						<select
							size='sm'
							className='inputcargaexp'
							aria-label='Default select example'
							name='radicacion'
							value={form.radicacion}
							onChange={handleChange}
							onBlur={handleBlur}>
							<option>Selecciona..</option>
							<option value='Civil y Comercial'>
								Civil y Comercial
							</option>
							<option value='Contensioso Admnistrativo'>
								Contensioso Admnistrativo
							</option>
							<option value='Documentos y Locaciones'>
								Documentos y Locaciones
							</option>
							<option value='Familia y Sucesiones'>
								Familia y Sucesiones
							</option>
							<option value='Trabajo'>Trabajo</option>
						</select>
					</Form.Group>

					<Form.Group className='formcargaexp' controlId='inputsubname'>
						<Form.Label className='labelcargaexp'>
							{' '}
							Juzgado de Radicacion
						</Form.Label>
						<select
							size='sm'
							className='inputcargaexp'
							aria-label='Default select example'
							name='juzgado'
							value={form.juzgado}
							onChange={handleChange}
							onBlur={handleBlur}>
							<option>Selecciona..</option>
							<option value='I NOM'>I NOM</option>
							<option value='II NOM'>II NOM</option>
							<option value='III NOM'>III NOM</option>
							<option value='IV NOM'>IV NOM</option>
							<option value='V NOM'>V NOM</option>
							<option value='VI NOM'>VI NOM</option>
							<option value='VII NOM'>VII NOM</option>
							<option value='VIII NOM'>VIII NOM</option>
							<option value='IX NOM'>IX NOM</option>
							<option value='X NOM'>X NOM</option>
							<option value='XI NOM'>XI NOM</option>
							<option value='XII NOM'>XII NOM</option>
						</select>
					</Form.Group>

					<Form.Group
						className='formcargaexp'
						controlId='inputdomic'>
						<Form.Label className='labelcargaexp'>Actor</Form.Label>
						<Form.Control
							className='inputcargaexp'
							type='text'
							name='actor'
							value={form.actor}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='formcargaexp' controlId='inputcel'>
						<Form.Label className='labelcargaexp'>Demandado</Form.Label>
						<Form.Control
							className='inputcargaexp'
							type='text'
							name='demandado'
							value={form.demandado}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='formcargaexp' controlId='inputemail'>
						<Form.Label className='labelcargaexp'>
							Tipo de Proceso
						</Form.Label>
						<select
							size='sm'
							className='inputcargaexp'
							aria-label='Default select example'
							name='proceso'
							value={form.proceso}
							onChange={(e) => {
								handleChange(e);
							}}
							onBlur={handleBlur}>
							<option>Selecciona..</option>
							<option value='Cobro de Pesos'>Cobro de Pesos</option>
							<option value='Daños y Perjuicios'>
								Daños y Perjuicios
							</option>
							<option value='Desalojo'>Desalojo</option>
							<option value='Cobro Ejecutivo'>Cobro Ejecutivo</option>
							<option value='Reivindicacion'>Reivindicacion</option>
							<option value='Sucesion'>Sucesion</option>
							<option value='Accion de Consumo'>
								Accion de Consumo
							</option>
						</select>
					</Form.Group>

					<Form.Group className='formcargaexp' controlId='inputsubname'>
						<Form.Label className='labelcargaexp'>Estado</Form.Label>
						<select
							size='sm'
							className='inputcargaexp'
							aria-label='Default select example'
							name='estado'
							value={form.estado}
							onChange={handleChange}
							onBlur={handleBlur}>
							<option>Selecciona..</option>
							<option value='En tramite'>En tramite</option>
							<option value='Mediacion'>Mediacion</option>
							<option value='Extrajudicial'>Extrajudicial</option>
							<option value='Terminado'>Terminado</option>
							<option value='Caduco'>Caduco</option>
						</select>
					</Form.Group>

					<Form.Group className='w-100 text-center' controlId='inputcel'>
						<Form.Label className='labelcargaexp'>
							Caratula
						</Form.Label>
						<Form.Label
							className='labelcargaexp'
							type='text'
							name='caratula'>
							{`${form.actor} C/ ${form.demandado} S/ ${form.proceso}`}
						</Form.Label>
					</Form.Group>

					<Form.Group className='botonescarexp'>
						<Button className='botoncargaexp ' onClick={handleSubmit}>
							<i className='me-2 fs-6 bi bi-check2-square'></i>
							Agregar Expediente
						</Button>
						<Link to='/gestionexpedientes' className='btncancexp'>
							<i className='me-2 fs-6 bi bi-x-circle-fill'></i>
							Cancelar
						</Link>
					</Form.Group>
				</Form>
			</section>
		</>
	);
};
