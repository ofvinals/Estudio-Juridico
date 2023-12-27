import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import '../css/Carga.css';
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
	const [exptes, setExptes] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	const [tablaExpte, setTablaExpte] = useState();

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
			<section className='bodycarga'>
				<Form className='Formcarga container fluid bg-dark'>
					<h2 className='titlecarga'>Agregar Nuevo Expediente</h2>

					<Form.Group className='formcargagroup' controlId='inputname'>
						<Form.Label className='labelcarga'>Cliente</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
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

					<Form.Group className='formcargagroup' controlId='inputname'>
						<Form.Label className='labelcarga'>
							Nro Expediente
						</Form.Label>
						<Form.Control
							className='inputcarga'
							type='text'
							name='nroexpte'
							value={form.nroexpte}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='formcargagroup' controlId='inputsubname'>
						<Form.Label className='labelcarga'>
							Fuero de Radicacion
						</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
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

					<Form.Group className='formcargagroup' controlId='inputsubname'>
						<Form.Label className='labelcarga'>
							{' '}
							Juzgado de Radicacion
						</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
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
						className='formcargagroup'
						controlId='inputdomic'>
						<Form.Label className='labelcarga'>Actor</Form.Label>
						<Form.Control
							className='inputcarga'
							type='text'
							name='actor'
							value={form.actor}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='formcargagroup' controlId='inputcel'>
						<Form.Label className='labelcarga'>Demandado</Form.Label>
						<Form.Control
							className='inputcarga'
							type='text'
							name='demandado'
							value={form.demandado}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='formcargagroup' controlId='inputemail'>
						<Form.Label className='labelcarga'>
							Tipo de Proceso
						</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
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

					<Form.Group className='formcargagroup' controlId='inputsubname'>
						<Form.Label className='labelcarga'>Estado</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
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
						<Form.Label className='labelcarga'>
							Caratula
						</Form.Label>
						<Form.Label
							className='labelcarga'
							type='text'
							name='caratula'>
							{`${form.actor} C/ ${form.demandado} S/ ${form.proceso}`}
						</Form.Label>
					</Form.Group>

					<Form.Group className='botonescarga'>
						<Button className='botoneditcarga' onClick={handleSubmit}>
							<i className='iconavbar bi bi-check2-square'></i>
							Agregar Expediente
						</Button>
						<Link to='/gestionexpedientes' className='btncanccarga'>
							<i className='iconavbar bi bi-x-circle-fill'></i>
							Cancelar
						</Link>
					</Form.Group>
				</Form>
			</section>
		</>
	);
};
