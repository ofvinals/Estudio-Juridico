import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/Gestion.css';
import { useCajas } from '../context/CajasContext.jsx';
import { Modal, Form } from 'react-bootstrap';
import { esES } from '@mui/material/locale';

export const GestionCaja = () => {
	const { user } = useAuth();
	const params = useParams();
	const { getCajas, deleteCaja, cajas, getCaja } = useCajas();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [caja, setCaja] = useState([]);
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');
	const [showVerCaja, setShowVerCaja] = useState(false);
	const [gastosPorMes, setGastosPorMes] = useState([]);

	// Cierra modales
	const handleCancel = () => {
		setShowVerCaja(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedCajas = await getCajas();
				// Agrupa los gastos por mes
				const gastosAgrupados = {};
				fetchedCajas.forEach((caja) => {
					const fecha = new Date(caja.fecha);
					const mesKey = `${fecha.getFullYear()}-${String(
						fecha.getMonth() + 1
					).padStart(2, '0')}`;

					if (!gastosAgrupados[mesKey]) {
						gastosAgrupados[mesKey] = [];
					}
					// Agregar la propiedad fechaFormatted
					caja.fechaFormatted = fecha.toLocaleDateString();
					gastosAgrupados[mesKey].push(caja);
				});

				setGastosPorMes(gastosAgrupados);
				setData(fetchedCajas);
			} catch (error) {
				console.error('Error al obtener caja', error);
			}
		};

		fetchData();
	}, []);

	// Carga info de columnas
	const columns = React.useMemo(
		() => [
			{
				header: 'Fecha',
				accessorKey: 'fecha',
			},
			{
				header: 'Concepto',
				accessorKey: 'concepto',
			},
			{
				header: 'Tipo',
				accessorKey: 'tipo',
			},
			{
				header: 'Monto',
				accessorKey: 'monto',
			},
			{
				header: 'Adjunto',
				accessorKey: 'adjunto',
			},
			{
				header: 'Estado',
				accessorKey: 'estado',
			},
		],
		[]
	);
	// Carga tabla con datos de data y columns
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			globalFilter: filtering,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setFiltering,
	});

	// funcion para eliminar movimientos de caja
	async function borrarCaja(id) {
		try {
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion del movimient de la caja?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteCaja(id);
				Swal.fire({
					icon: 'success',
					title: 'Movimiento de caja eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
				setData((prevData) => prevData.filter((caja) => caja._id !== id));
			}
		} catch (error) {
			console.error('Error al eliminar el movimiento:', error);
		}
	}

	// funcion para ver movimientos de caja en Modal
	async function verCaja(id) {
		const caja = await getCaja(id);
		setCaja(caja);
	}

	const getMonthName = (mesKey) => {
		const [year, month] = mesKey.split('-');
		const monthIndex = parseInt(month) - 1;
		const monthNames = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre',
		];
		return `${monthNames[monthIndex]} ${year}`;
	};

	return (
		<>
			<div className='bg-dark'>
				<div className='main px-3 bodygestion'>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {user.email}
					</h4>
					<p className='subtitlegestion'>
						Panel de Gestion de Caja del Estudio
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{user.email === 'admin@gmail.com' && (
							<Link
								type='button'
								className='btnpanelgestion'
								to='/cargacajas'>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar Movimiento
							</Link>
						)}
						{user.email === 'admin@gmail.com' && (
							<Link to='' className='btnpanelgestion'>
								<i className='iconavbar bi bi-archive'></i>
								Movimientos Archivados
							</Link>
						)}
						<Link
							to={
								user.email === 'admin@gmail.com'
									? '/Admin'
									: '/AdminUsu'
							}
							className='btnpanelgestion'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>

					<hr className='linea mx-3' />

					<div>
						<p className='titletabla'> Movimientos de Caja</p>
					</div>

					<div className='search'>
						<p className='subtitlegestion'>Buscar Movimiento</p>
						<i className='iconavbar bi bi-search'></i>
						<input
							className='searchinput'
							type='text'
							value={filtering}
							onChange={(e) => setFiltering(e.target.value)}
						/>
					</div>
					<div className='table-responsive'>
						<Table
							striped
							hover
							variant='dark'
							className='tablagestion table border border-secondary-subtle'>
							<thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												onClick={header.column.getToggleSortingHandler()}>
												{header.isPlaceholder ? null : (
													<div>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}

														{
															{ asc: '⬆️', desc: '⬇️' }[
																header.column.getIsSorted() ??
																	null
															]
														}
													</div>
												)}
											</th>
										))}
										<th className='botonescciongestion'>Acciones</th>
									</tr>
								))}
							</thead>
							<tbody className='table-group-divider'>
								{Object.entries(gastosPorMes).map(([mes, gastos]) => (
									<React.Fragment key={mes}>
										<tr>
											<td colSpan='8' className='mes-header'>
												{getMonthName(mes)}
											</td>
										</tr>
										{Array.isArray(gastos) &&
											gastos.map((caja) => (
												<tr key={caja._id}>
													<td>{caja.fechaFormatted}</td>
													<td>{caja.concepto}</td>
													<td>{caja.tipo}</td>
													<td>$ {caja.monto}</td>
													<td>
														{caja.adjunto ? (
															<i className='bi bi-paperclip'></i> 
														) : (
															<span>{caja.adjunto}</span>
														)}
													</td>
													<td>{caja.estado}</td>
													<td className='align-middle'>
														<div className='d-flex flex-row justify-content-center'>
															{user.email ===
																'admin@gmail.com' && (
																<Link
																	className='btneditgestion'
																	to={`/editarcajas/${caja._id}`}>
																	<i className='bi bi-pen acciconogestion'></i>
																</Link>
															)}
															{user.email ===
																'admin@gmail.com' && (
																<button
																	className='btnborragestion'
																	onClick={() =>
																		borrarCaja(caja._id)
																	}>
																	<i className='bi bi-trash-fill acciconogestion'></i>
																</button>
															)}
															<button
																className='btnvergestion'
																onClick={(e) => {
																	setShowVerCaja(true);
																	verCaja(caja._id);
																}}>
																<i className='bi bi-search acciconogestion'></i>
															</button>
														</div>
													</td>
												</tr>
											))}
										{/* Suma total del mes */}
										<tr>
											<td colSpan='6' className='mes-header'></td>
											<td>
												<strong>
													Total mes {getMonthName(mes)}: $
													{gastos.reduce((total, caja) => {
														const monto =
															caja.tipo === 'INGRESO'
																? caja.monto
																: -caja.monto;
														return total + monto;
													}, 0)}
												</strong>
											</td>
										</tr>
									</React.Fragment>
								))}
							</tbody>
						</Table>
					</div>
					<div className='d-flex flex-row justify-content-center'>
						<button
							className='btnvpaginagestion'
							onClick={() => table.setPageIndex(0)}>
							<i className=' me-2 bi bi-chevron-bar-left'></i>Primer
							Pagina
						</button>
						<button
							className='btnvpaginagestion'
							onClick={() => table.previousPage()}>
							<i className=' me-2 bi bi-chevron-left'></i>
							Pagina Anterior
						</button>
						<button
							className='btnvpaginagestion'
							onClick={() => table.nextPage()}>
							Pagina Siguiente
							<i className=' ms-2 bi bi-chevron-right'></i>
						</button>
						<button
							className='btnvpaginagestion'
							onClick={() =>
								table.setPageIndex(table.getPageCount() - 1)
							}>
							Ultima Pagina
							<i className=' ms-2 bi bi-chevron-bar-right'></i>
						</button>
					</div>
				</div>
			</div>

			{/* Modal para ver movimiento de caja seleccionada */}
			<Modal show={showVerCaja} onHide={() => setShowVerCaja(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Ver Movimiento de Caja</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' id='fecha'>
							<Form.Label>Fecha: {caja.fecha}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='concepto'>
							<Form.Label>Concepto: {caja.concepto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='monto'>
							<Form.Label>Monto: $ {caja.monto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='comprobante'>
							<Form.Label>
								Comprobante Adjunto: {caja.comprobante}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='estado'>
							<Form.Label>Estado: {caja.estado}</Form.Label>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button
						className='btneditgestion px-2'
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
