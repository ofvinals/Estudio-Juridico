import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/MovExptes.css';
import { Button, Form, Modal } from 'react-bootstrap';

export const MovExptes = () => {
	const auth = useAuth();
	const { email } = auth.user;
	const { id } = useParams();

	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [exptes, setExptes] = useState([]);
	const [datosExpte, setDatosExpte] = useState();
	const [tablaMov, setTablaMov] = useState();
	const [movExpte, setMovExpte] = useState([]);
	const [movimientos, setMovimientos] = useState([]);
	const [showVerMovModal, setShowVerMovModal] = useState(false);
	const [showEditMovModal, setShowEditMovModal] = useState(false);
	const [showCreaMovModal, setShowCreaMovModal] = useState(false);
	const initialForm = {
		nroexpte: '',
		fecha: '',
		movimiento: '',
		archivo: '',
		id: '',
	};
	const [form, setForm] = useState(initialForm);

	const handleClose = () => setShow(false);

	// Cierra modales
	const handleCancel = () => {
		setShowVerMovModal(false);
		setShowCreaMovModal(false);
		setShowEditMovModal(false);
		handleClose();
	};

	// Carga expedientes desde el localStorage al montar el componente
	useEffect(() => {
		const ListaExpte = JSON.parse(localStorage.getItem('exptes')) || [];
		setExptes(ListaExpte);
	}, []);

	// Carga movimientos desde el localStorage al montar el componente
	useEffect(() => {
		const ListaMov = JSON.parse(localStorage.getItem('movimientos')) || [];
		setMovimientos(ListaMov);
	}, []);

	// Renderiza tabla de movimientos y datos del expediente
	useEffect(() => {
		cargarDatosExpte();
		cargarTablaMov();
	}, [id, exptes, movimientos]);

	// funcion para cargar datos del expediente
	function cargarDatosExpte() {
		const datosExpte = exptes
			.filter((expte) => expte.id === Number(id))
			.map((expte) => (
				<div key={expte.id}>
					<p className='datosmovexpte'>Nro Expte: {expte.nroexpte}</p>
					<p className='datosmovexpte'>Caratula: {expte.caratula}</p>
					<p className='datosmovexpte'>
						Radicacion: {expte.radicacion} {expte.juzgado}
					</p>
				</div>
			));
		setDatosExpte(datosExpte);
	}

	// Funcion para cargar tabla de movimientos traida de Local Storage
	function cargarTablaMov() {
		const nroExpteFiltrado = exptes.find((expte) => expte.id === Number(id));
		const movimientosFiltrados = movimientos
			.filter(
				(movimiento) => movimiento.nroexpte === nroExpteFiltrado.nroexpte
			)
			.sort((a, b) => {
				const fechaA = new Date(a.fecha);
				const fechaB = new Date(b.fecha);
				return fechaB - fechaA;
			});

		const tabla = movimientosFiltrados.map((movimiento) => (
			<tr key={movimiento.id}>
				<td className='align-middle'>{movimiento.fecha}</td>
				<td className='align-middle '>{movimiento.movimiento}</td>
				<td className='align-middle '>{movimiento.archivo}</td>
				<td>
					<div className='d-flex flex-row justify-content-around'>
						{/* Edit solo visible para admin */}
						{email === 'admin@gmail.com' && (
							<Link
								className='btnaccgestexp'
								to={`/editarmov/${movimiento.id}`}>
								<i className='bi bi-pen  accico'></i>
							</Link>
						)}
						{/* Borrar solo visible para admin */}
						{email === 'admin@gmail.com' && (
							<button
								className='btnborrargestexp'
								onClick={() => borrarMov(movimiento.id)}>
								<i className='bi bi-trash-fill  accico'></i>
							</button>
						)}
						<button
							className='btnvergestexp'
							onClick={(e) => {
								setShowVerMovModal(true);
								verMovExpte(movimiento.id);
							}}>
							<i className='bi bi-search accico'></i>
						</button>
					</div>
				</td>
			</tr>
		));
		setTablaMov(tabla);
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	//funcion para agregar movimientos
	const agregarMov = (newMov) => {
		const ListaMov = [...movimientos, newMov];
		setMovimientos(ListaMov);
		localStorage.setItem('movimientos', JSON.stringify(ListaMov));
		setShowCreaMovModal(false);
	};
	// crea nuevo movimiento y llama a agregarMov
	function handleSubmit(e) {
		const { fecha, movimiento, archivo } = form;

		const currentExpte = exptes.find((expte) => expte.id === Number(id));

		const nroexpte = currentExpte ? currentExpte.nroexpte : '';

		const newMov = {
			id: Date.now(),
			nroexpte,
			fecha,
			movimiento,
			archivo,
		};

		agregarMov(newMov);
		setForm(initialForm);
		handleClose();
	}

	// funcion para ver movimientos en Modal
	function verMovExpte(id) {
		const movimientoSeleccionado = movimientos.find(
			(movimiento) => movimiento.id === id
		);
		setMovExpte(movimientoSeleccionado);
		setShowVerMovModal(true);
	}

	// funcion para eliminar movimientos
	function borrarMov(id) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Confirmas la eliminacion del expdiente?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#8f8e8b',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				// Filtrar
				const nuevosMov = movimientos.filter(function (movimiento) {
					return movimiento.id !== id;
				});
				setMovimientos(nuevosMov);
				localStorage.setItem('movimientos', JSON.stringify(nuevosMov));
				cargarTablaMov();
				Swal.fire(
					'Eliminado',
					'El expediente fue eliminado con exito',
					'success'
				);
			}
		});
	}

	return (
		<>
			<div className='container-fluid bg-dark'>
				<div className='main px-3 bodyadexped '>
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
					<p className='subtitleadusu'>
						Panel de Movimientos de Expedientes
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{email === 'admin@gmail.com' && (
							<Button
								className='btngestexpad'
								onClick={(e) => setShowCreaMovModal(true)}>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar movimiento
							</Button>
						)}
						<Button
							onClick={() => {
								if (email === 'admin@gmail.com') {
									navigate('/gestionexpedientes');
								} else {
									navigate('/gestionexpteusu');
								}
							}}
							className='btngestexpad'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Button>
					</div>

					<div>
						<div>
							<h2 className='subtitleadusu'>Datos del Expediente</h2>
							{datosExpte}
						</div>
					</div>
					<h2 className='subtitleadusu text-center'>
						Movimientos del Expediente
					</h2>
					<div className='container table-responsive'>
						<Table
							striped
							hover
							variant='dark'
							className='tablamovexpte text-center table border border-secondary-subtle'>
							<thead>
								<tr>
									<th>Fecha</th>
									<th>Descripcion</th>
									<th>Adjunto</th>
									<th className='acciones'>Acciones</th>
								</tr>
							</thead>
							<tbody id='tablaTurnos' className='table-group-divider'>
								{tablaMov}
							</tbody>
						</Table>
					</div>
				</div>
			</div>

			{/* Modal para agregar movimientos al expediente */}
			<Modal
				show={showCreaMovModal}
				onHide={() => setShowCreaMovModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Agregar Movimientos</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Fecha</Form.Label>
							<Form.Control
								type='date'
								name='fecha'
								className='mb-3'
								onChange={handleChange}></Form.Control>
						</Form.Group>
						<Form.Group>
							<Form.Label>Movimiento</Form.Label>
							<Form.Control
								className='mb-3'
								onChange={handleChange}
								as='textarea'
								rows={3}
								name='movimiento'
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Agregar archivos</Form.Label>
							<Form.Control
								type='file'
								name='archivo'
								onChange={handleChange}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button className='btnaccag' onClick={handleSubmit}>
						Confirmar
					</button>
					<button
						className='btnborrarag '
						onClick={() => {
							handleCancel();
						}}>
						Cancelar
					</button>
				</Modal.Footer>
			</Modal>

			{/* Modal para consultar movimientos al expediente */}
			<Modal show={showVerMovModal} onHide={() => setShowVerMovModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Ver Movimiento</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Fecha: {movExpte.fecha}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Movimiento: {movExpte.movimiento}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>
								Archivos Adjuntos: {movExpte.archivo}
							</Form.Label>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button
						className='btnaccag '
						onClick={() => {
							handleCancel();
						}}>
						Volver
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
