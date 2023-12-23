import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/EditarExptes.css';
import { Button, Modal } from 'react-bootstrap';

export const EditarExptes = ({}) => {
	const auth = useAuth();
	const { id } = useParams();
	const { email } = auth.user;
	const navigate = useNavigate();

	const [show, setShow] = useState(false);
	const [exptes, setExptes] = useState([]);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [formValues, setFormValues] = useState({
		nroexpteEditar: '',
		radicacionEditar: '',
		juzgadoEditar: '',
		caratulaEditar: '',
		actorEditar: '',
		demandadoEditar: '',
		procesoEditar: '',
		estadoEditar: '',
		expteIndex: '',
	});

	const handleCancel = () => {
		setShowConfirmationModal(false);
		handleClose();
		navigate('/gestionexpedientes');
	};

	const handleShow = () => setShow(true);

	// Cargar expedientes desde el localStorage al montar el componente
	useEffect(() => {
		const ListaExpte = JSON.parse(localStorage.getItem('exptes')) || [];
		setExptes(ListaExpte);
	}, []);

	useEffect(() => {
		const expte = exptes.find((expte) => expte.id === parseInt(id, 10));
		// Establecer los valores en el estado
		if (expte) {
			setFormValues({
				...formValues,
				nroexpteEditar: expte.nroexpte,
				radicacionEditar: expte.radicacion,
				juzgadoEditar: expte.juzgado,
				caratulaEditar: expte.caratula,
				actorEditar: expte.actor,
				demandadoEditar: expte.demandado,
				procesoEditar: expte.proceso,
				estadoEditar: expte.estado,
				expteIndex: id,
			});
		}
	}, [id, exptes]);

	// Funcion para editar datos de expedientes
	function editarExpte() {
		const expteIndexInt = parseInt(formValues.expteIndex, 10);
		const nuevosExptes = exptes.map((expte) =>
			expte.id === expteIndexInt
				? {
						...expte,
						nroexpte: formValues.nroexpteEditar,
						radicacion: formValues.radicacionEditar,
						juzgado: formValues.juzgadoEditar,
						caratula: formValues.caratulaEditar,
						actor: formValues.actorEditar,
						demandado: formValues.demandadoEditar,
						proceso: formValues.procesoEditar,
						estado: formValues.estadoEditar,
				  }
				: { ...expte }
		);

		// Actualizar el estado de expedientes, luego de editar
		setExptes(nuevosExptes);

		localStorage.setItem('exptes', JSON.stringify(nuevosExptes));
		setShow(false);
		setShowConfirmationModal(false);
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	return (
		<>
			<section className='editexpe'>
				<Form className='pe-4 editexpForm container fluid bg-dark'>
					<h2 className='titleeditexp'>Editar Datos de Expediente</h2>
					<Form.Group className='' controlId='inputname'>
						<Form.Label className='labeleditexp'>
							Nro Expediente
						</Form.Label>
						<Form.Control
							className='inputeditexp'
							type='text'
							name='nroexpteEditar'
							value={formValues.nroexpteEditar}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='' controlId='inputsubname'>
						<Form.Label className='labeleditexp'>
							{' '}
							Fuero de Radicacion
						</Form.Label>
						<select
							size='sm'
							className='inputeditexp'
							aria-label='Default select example'
							name='radicacionEditar'
							value={formValues.radicacionEditar}
							onChange={handleChange}>
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

					<Form.Group className='' controlId='inputsubname'>
						<Form.Label className='labeleditexp'>
							{' '}
							Juzgado de Radicacion
						</Form.Label>
						<select
							size='sm'
							className='inputeditexp'
							aria-label='Default select example'
							name='juzgadoEditar'
							value={formValues.juzgadoEditar}
							onChange={handleChange}>
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

					<Form.Group className='' controlId='inputdomic'>
						<Form.Label className='labeleditexp'>Actor</Form.Label>
						<Form.Control
							className='inputeditexp'
							type='text'
							name='actorEditar'
							value={formValues.actorEditar}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='' controlId='inputcel'>
						<Form.Label className='labeleditexp'>Demandado</Form.Label>
						<Form.Control
							className='inputeditexp'
							type='text'
							name='demandadoEditar'
							value={formValues.demandadoEditar}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='' controlId='inputemail'>
						<Form.Label className='labeleditexp'>
							Tipo de Proceso
						</Form.Label>
						<select
							size='sm'
							className='inputeditexp'
							aria-label='Default select example'
							name='procesoEditar'
							value={formValues.procesoEditar}
							onChange={(e) => {
								handleChange(e);
							}}>
							<option>Selecciona..</option>
							<option value='Cobro de Pesos'>Cobro de Pesos</option>
							<option value='Daños y Perjuicios'>
								Daños y Perjuicios
							</option>
							<option value='Desalojo'>Desalojo</option>
							<option value='Cobro Ejecutivo'>Cobro Ejecutivo</option>
							<option value='Reivindicacion'>Reivindicacion</option>
							<option value='Sucesion'>Sucesion</option>
							<option value='Sucesion'>Sucesion</option>
						</select>
					</Form.Group>

					<Form.Group className='' controlId='inputemail'>
						<Form.Label className='labeleditexp'>
							Estado
						</Form.Label>
						<select
							size='sm'
							className='inputeditexp'
							aria-label='Default select example'
							name='estadoEditar'
							value={formValues.estadoEditar}
							onChange={(e) => {
								handleChange(e);
							}}>
							<option>Selecciona..</option>
							<option value='En tramite'>En tramite</option>
							<option value='Mediacion'>Mediacion</option>
							<option value='Extrajudicial'>Extrajudicial</option>
							<option value='Terminado'>Terminado</option>
							<option value='Caduco'>Caduco</option>
						</select>
					</Form.Group>

					<Form.Group className='botoneseditexp'>
						<Button
							className='btneditexp'
							onClick={(e) => setShowConfirmationModal(true)}>
							<i className='me-2 fs-6 bi bi-check2-square'></i>
							Guardar Cambios
						</Button>
						<Link to='/gestionexpedientes' className='botoneditcancexp'>
							<i className='me-2 fs-6 bi bi-x-circle-fill'></i>
							Cancelar
						</Link>
					</Form.Group>
				</Form>
			</section>

			{/* Modal para confirmar edicion */}
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
							editarExpte(e);
							navigate('/gestionexpedientes');
						}}>
						Confirmar
					</button>
					<button
						className='btnacc btn btn-danger'
						onClick={() => {
							handleCancel();
						}}>
						Cancelar
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
