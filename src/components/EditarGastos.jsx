import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import { Button, Modal } from 'react-bootstrap';

export const EditarGastos = ({}) => {
	const auth = useAuth();
	const { id } = useParams();
	const { email } = auth.user;
	const navigate = useNavigate();
	const [exptes, setExptes] = useState([]);
	const [gastos, setGastos] = useState([]);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [formValues, setFormValues] = useState({
		expte: '',
		caratula: '',
		concepto: '',
		monto: '',
		comprobante: '',
		estado: '',
	});
	const handleCancel = () => {
		navigate('/gestiongastos');
	};
	// Cargar gastos desde el localStorage al montar el componente
	useEffect(() => {
		const gastosGuardados = JSON.parse(localStorage.getItem('gastos')) || [];
		setGastos(gastosGuardados);
	}, []);

	// Cargar gastos desde el localStorage al montar el componente
	useEffect(() => {
		const exptesGuardados = JSON.parse(localStorage.getItem('exptes')) || [];
		setExptes(exptesGuardados);
	}, []);

	useEffect(() => {
		const gasto = gastos.find((gasto) => gasto.id === parseInt(id, 10));
		if (gasto) {
			setFormValues({
				...formValues,
				expte: gasto.expte,
				caratula: gasto.caratula,
				concepto: gasto.concepto,
				monto: gasto.monto,
				comprobante: gasto.comprobante,
				estado: gasto.estado,
				id: id,
			});
		}
	}, [id, gastos]);

	// Funcion para editar gasto
	function editarGasto(e) {
		const gastoIndexInt = parseInt(formValues.id, 10);
		const nuevosGastos = gastos.map((gasto) =>
			gasto.id === gastoIndexInt
				? {
						...gasto,
						expte: formValues.expte,
						caratula: formValues.caratula,
						concepto: formValues.concepto,
						monto: formValues.monto,
						comprobante: formValues.comprobante,
						estado: formValues.estado,
				  }
				: { ...gasto }
		);

		// Actualizar el estado del gasto, luego de editar
		setExptes(nuevosGastos);

		localStorage.setItem('gastos', JSON.stringify(nuevosGastos));
		setShowConfirmationModal(false);
	}

	const handleExpteChange = (e) => {
		const selectedExpte = exptes.find(
			(expte) => expte.nroexpte === e.target.value
		);

		if (selectedExpte) {
			setFormValues((prevForm) => ({
				...prevForm,
				expte: e.target.value,
				caratula: selectedExpte.caratula,
			}));
		} else {
			console.warn('No se encontró el elemento en exptes');
		}
	};

	const handleConceptoChange = (e) => {
		setFormValues((prevForm) => ({
			...prevForm,
			concepto: e.target.value,
		}));
	};

	const handleMontoChange = (e) => {
		setFormValues((prevForm) => ({
			...prevForm,
			monto: e.target.value,
		}));
	};

	const handleEstadoChange = (e) => {
		setFormValues((prevForm) => ({
			...prevForm,
			estado: e.target.value,
		}));
	};

	const handleComprobanteChange = (e) => {
		setFormValues((prevForm) => ({
			...prevForm,
			comprobante: e.target.files[0], // Usar el primer archivo seleccionado
		}));
	};

	return (
		<>
			<section className='bodyedit'>
				<Form className='formedit container fluid bg-dark'>
					<h2 className='titleedit'>Editar Gastos</h2>
					<Form.Group className='mb-3' controlId='inputname'>
						<Form.Label className='labelcarga'>Expediente</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
							name='expte'
							value={formValues.expte}
							onChange={handleExpteChange}>
							<option>Selecciona..</option>
							{exptes.map((expte) => (
								<option key={expte.id} value={expte.nroexpte}>
									{expte.nroexpte}
								</option>
							))}
						</select>
					</Form.Group>

					<Form.Group className='mb-3' controlId='inputconcepto'>
						<Form.Label className='labelcarga'>Concepto</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
							name='concepto'
							value={formValues.concepto}
							onChange={handleConceptoChange}>
							<option>Selecciona..</option>
							<option value='Planilla Fiscal'>Planilla Fiscal</option>
							<option value='Gastos de Apersonamiento'>
								Gastos de Apersonamiento
							</option>
							<option value='Bonos de Movilidad'>
								Bonos de Movilidad
							</option>
							<option value='Honorarios Profesionales'>
								Honorarios Profesionales
							</option>
							<option value='Gastos de pericias'>
								Gastos de pericias
							</option>
							<option value='Gastos Extrajudiciales'>
								Gastos Extrajudiciales
							</option>
						</select>
					</Form.Group>

					<Form.Group className='mb-3' controlId='inputmonto'>
						<Form.Label className='labelcarga'>Monto</Form.Label>
						<Form.Control
							className='inputcarga'
							type='number'
							name='monto'
							value={formValues.monto}
							onChange={handleMontoChange}
						/>
					</Form.Group>

					<Form.Group className='' controlId='inputcel'>
						<Form.Label className='labelcarga'>
							Comprobante de gasto
						</Form.Label>
						{formValues.comprobante !== null && (
							<Form.Control
								className='inputcarga'
								type='file'
								name='comprobante'
								value={formValues.comprobante}
								onChange={handleComprobanteChange}
							/>
						)}
					</Form.Group>

					<Form.Group className='formcargagroup' controlId='inputsubname'>
						<Form.Label className='labelcarga'>Estado</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
							name='estado'
							value={formValues.estado}
							onChange={handleEstadoChange}>
							<option>Selecciona..</option>
							<option value='Pendiente'>Pendiente</option>
							<option value='Pagado'>Pagado</option>
							<option value='Cancelado'>Cancelado</option>
						</select>
					</Form.Group>

					<Form.Group
						className='mb-3 grupocaratula'
						controlId='inputcaratula'>
						<Form.Label className='labelcarga'>Caratula</Form.Label>
						<Form.Control
							className='labelcarcaratula'
							type='text'
							name='caratula'
							value={formValues.caratula}
							onChange={(e) =>
								setFormValues({
									...formValues,
									caratula: e.target.value,
								})
							}
						/>
					</Form.Group>

					<Form.Group className='botonesedit'>
						<Button
							className='botonedit'
							onClick={(e) => setShowConfirmationModal(true)}>
							<i className='iconavbar bi bi-check2-square'></i>
							Guardar Cambios
						</Button>
						<Link to='/gestiongastos' className='botoncancedit'>
							<i className='iconavbar bi bi-x-circle-fill'></i>
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
						className='btnconfmodal'
						onClick={(e) => {
							editarGasto(e);
							navigate('/gestiongastos');
						}}>
						Confirmar
					</button>
					<button
						className='btncancmodal'
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
