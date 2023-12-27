import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/Carga.css';
import { useAuth } from '../context/AuthContext';

export const CargaGastos = () => {
	const auth = useAuth();
	const { email } = auth.user;
	const { id } = useParams();
	const navigate = useNavigate();
	const [exptes, setExptes] = useState([]);
	const [gastos, setGastos] = useState([]);
	const [form, setForm] = useState({
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

	// funcion para agregar usuarios
	const agregarGastos = (newGasto) => {
		const ListaGastos = [...gastos, newGasto];
		setGastos(ListaGastos);
		localStorage.setItem('gastos', JSON.stringify(ListaGastos));
	};

	const handleExpteChange = (e) => {
		const selectedExpte = exptes.find(
			(expte) => expte.nroexpte === e.target.value
		);

		if (selectedExpte) {
			setForm((prevForm) => ({
				...prevForm,
				expte: e.target.value,
				caratula: selectedExpte.caratula,
			}));
		} else {
			console.warn('No se encontró el elemento en exptes');
		}
	};

	const handleConceptoChange = (e) => {
		setForm((prevForm) => ({
			...prevForm,
			concepto: e.target.value,
		}));
	};

	const handleMontoChange = (e) => {
		setForm((prevForm) => ({
			...prevForm,
			monto: e.target.value,
		}));
	};

	const handleEstadoChange = (e) => {
		setForm((prevForm) => ({
			...prevForm,
			estado: e.target.value,
		}));
	};

	const handleComprobanteChange = (e) => {
		setForm((prevForm) => ({
			...prevForm,
			comprobante: e.target.files[0], // Usar el primer archivo seleccionado
		}));
	};
	// funcion para registrar mail y contraseña solamente en Firebase
	function handleSubmit(e) {
		e.preventDefault();
		const { expte, caratula, concepto, monto, estado } = form;

		const id = Date.now();
		const newGasto = {
			id,
			expte,
			caratula,
			concepto,
			monto,
			estado,
		};

		agregarGastos(newGasto);

		Swal.fire({
			icon: 'success',
			title: 'Gasto registrado correctamente',
			showConfirmButton: false,
			timer: 1500,
		});
		// Restablece el formulario y redirecciona después del registro
		setForm(form);
		navigate('/gestiongastos');
	}

	return (
		<>
			<section className='bodycarga'>
				<Form className='Formcarga container fluid bg-dark'>
					<h2 className='titlecarga'>Registrar Nuevo Gasto</h2>

					<Form.Group className='mb-3' controlId='inputname'>
						<Form.Label className='labelcarga'>Expediente</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
							name='expte'
							value={form.expte}
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
							value={form.concepto}
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
							value={form.monto}
							onChange={handleMontoChange}
						/>
					</Form.Group>

					<Form.Group className='' controlId='inputcel'>
						<Form.Label className='labelcarga'>
							Comprobante de gasto
						</Form.Label>
						{form.comprobante !== null && (
							<Form.Control
								className='inputcarga'
								type='file'
								name='comprobante'
								value={form.comprobante}
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
							value={form.estado}
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
							value={form.caratula}
							onChange={(e) =>
								setForm({ ...form, caratula: e.target.value })
							}
						/>
					</Form.Group>

					<Form.Group
						className='mb-3 botonescarga'
						controlId='inputpassword'>
						<Button className='botoneditcarga' onClick={handleSubmit}>
							<i className='iconavbar bi bi-check2-square'></i>
							Registrar Gasto
						</Button>
						<Link to='/gestiongastos' className='btncanccarga'>
							<i className='iconavbar bi bi-x-circle-fill'></i>
							Cancelar
						</Link>
					</Form.Group>
				</Form>
			</section>
		</>
	);
};
