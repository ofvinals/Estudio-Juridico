import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/Gestion.css';
import { Button, Form, Modal } from 'react-bootstrap';

export const GestionGastos = () => {
	const auth = useAuth();
	const { id } = useParams();
	const { email } = auth.user;
	const navigate = useNavigate();
	const [usuarios, setUsuarios] = useState([]);
	const [gastos, setGastos] = useState([]);
	const [tablaGastos, setTablaGastos] = useState();
	const [showVerGasto, setShowVerGasto] = useState(false);
	const [form, setForm] = useState({
		expte: '',
		caratula: '',
		concepto: '',
		monto: '',
		comprobante: '',
		estado: '',
		id: '',
	});
	// Cierra modales
	const handleCancel = () => {
		setShowVerGasto(false);
	};

	// Cargar usuarios desde el localStorage al montar el componente
	useEffect(() => {
		const ListaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(ListaUsuarios);
	}, []);

	// Cargar gastos desde el localStorage al montar el componente
	useEffect(() => {
		const ListaGastos = JSON.parse(localStorage.getItem('gastos')) || [];
		setGastos(ListaGastos);
	}, []);

	useEffect(() => {
		cargarTablaGastos();
	}, [gastos]);

	// Funcion para cargar tabla de Usuario traida de Local Storage
	async function cargarTablaGastos() {
		const tabla = gastos.map((gasto) => (
			<tr key={gasto.id}>
				<td className='align-middle '>{gasto.expte}</td>
				<td className='align-middle '>{gasto.caratula}</td>
				<td className='align-middle '>{gasto.concepto}</td>
				<td className='align-middle '>{gasto.comprobante}</td>
				<td className='align-middle'>$ {gasto.monto}</td>
				<td className='align-middle'> {gasto.estado}</td>
				<td className='align-middle'>
					<div className='d-flex flex-row justify-content-center'>
						{email === 'admin@gmail.com' && (
							<Link
								className='btneditgestion'
								to={`/editargastos/${gasto.id}`}>
								<i className='bi bi-pen  acciconogestion'></i>
							</Link>
						)}
						{email === 'admin@gmail.com' && (
							<button
								className='btnborragestion'
								onClick={() => borrarGasto(gasto.id)}>
								<i className='bi bi-trash-fill  acciconogestion'></i>
							</button>
						)}
						<button
							className='btnvergestion'
							onClick={(e) => {
								setShowVerGasto(true);
								verGasto(gasto.id);
							}}>
							<i className='bi bi-search acciconogestion'></i>
						</button>
					</div>
				</td>
			</tr>
		));
		setTablaGastos(tabla);
	}

	// funcion para eliminar gastos
	function borrarGasto(id) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Confirmas la eliminacion del gasto',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#8f8e8b',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				// Filtrar
				const nuevosGastos = gastos.filter(function (gasto) {
					return gasto.id !== id;
				});
				localStorage.setItem('gastos', JSON.stringify(nuevosGastos));
				setGastos(nuevosGastos);
				cargarTablaGastos();
				Swal.fire(
					'Eliminado',
					'El gasto fue eliminado con exito',
					'success'
				);
			}
		});
	}

	// funcion para ver movimientos en Modal
	function verGasto(id) {
		const gastoSeleccionado = gastos.find((gasto) => gasto.id === id);
		setForm(gastoSeleccionado);
		setShowVerGasto(true);
	}

	return (
		<>
			<div className='container-fluid bg-dark'>
				<div className='main px-3 bodygestion'>
					<h4 className='titlegestion'>Bienvenido de nuevo, {email}</h4>
					<p className='subtitlegestion'>
						Panel de Administracion de Gastos
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{email === 'admin@gmail.com' && (
							<Link
								type='button'
								className='btnpanelgestion'
								to='/cargagastos'>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar gastos
							</Link>
						)}
						{email === 'admin@gmail.com' && (
							<Link to='' className='btnpanelgestion'>
								<i className='iconavbar bi bi-search'></i>
								Gastos Cancelados
							</Link>
						)}
						<Link to='' className='btnpanelgestion'>
							<i className='iconavbar bi bi-search'></i>
							Buscar Gastos
						</Link>
						<Link
							to={email === 'admin@gmail.com' ? '/Admin' : '/AdminUsu'}
							className='btnpanelgestion'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>

					<div>
						<p className='titlegestion'>Gastos pendientes</p>
					</div>

					<div className='container table-responsive'>
						<Table
							striped
							hover
							variant='dark'
							className='tablagestion table border border-secondary-subtle'>
							<thead>
								<tr>
									<th>Expte</th>
									<th className='w-50'>Caratula</th>
									<th>Concepto</th>
									<th>Comprobante</th>
									<th>Monto</th>
									<th>Estado</th>
									<th className='botonescciongestion'>Acciones</th>
								</tr>
							</thead>
							<tbody id='tablaTurnos' className='table-group-divider'>
								{tablaGastos}
							</tbody>
						</Table>
					</div>
				</div>
			</div>

			{/* Modal para ver gasto seleccionado */}
			<Modal show={showVerGasto} onHide={() => setShowVerGasto(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Ver Gasto seleccionado</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Nro Expte: {form.expte}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Concepto: {form.concepto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Monto: $ {form.monto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>
								Comprobante Adjuntos: {form.comprobante}
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
