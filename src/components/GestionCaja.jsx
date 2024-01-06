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
import { useGastos } from '../context/GastosContext.jsx';
import { Modal, Form } from 'react-bootstrap';


export const GestionCaja = () => {
	const { user } = useAuth();
	const params = useParams();
	const { getGastos, deleteGasto, gastos, getGasto } = useGastos();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [gasto, setGasto] = useState([]);
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');
	const [showVerGasto, setShowVerGasto]= useState(false)

		// Cierra modales
		const handleCancel = () => {
			setShowVerGasto(false);
		};
		
	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedGastos = await getGastos();
				setData(fetchedGastos);
				setGasto(fetchedGastos);
			} catch (error) {
				console.error('Error al obtener gastos', error);
			}
		};
		fetchData();
	}, []);

	const columns = React.useMemo(
		() => [
			{
				header: 'Nro Expte',
				accessorKey: 'nroexpte',
			},
			{
				header: 'Caratula',
				accessorKey: 'caratula',
			},
			{
				header: 'Concepto',
				accessorKey: 'concepto',
			},
			{
				header: 'Comprobante',
				accessorKey: 'comprobante',
			},
			{
				header: 'Monto',
				accessorKey: 'monto',
			},
			{
				header: 'Estado',
				accessorKey: 'estado',
			},
		],
		[]
	);

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

	// funcion para eliminar gastos
	async function borrarGasto(id) {
		try {
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion del movimiento',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteGasto(id);
				window.location.reload();
				Swal.fire(
					'Eliminado',
					'El movimiento fue eliminado con éxito',
					'success'
				);
			}
		} catch (error) {
			console.error('Error al eliminar el movimiento:', error);
			Swal.fire(
				'Error',
				'Hubo un problema al eliminar el movimiento',
				'error'
			);
		}
	}

	// funcion para ver movimientos en Modal
	async function verGasto(id) {
		const gasto = await getGasto(id);
		setGasto(gasto);
		setShowVerGasto(true);
	}

	return (
		<>
			<div className='container-fluid bg-dark'>
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
								to='/cargagastos'>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar Movimientos
							</Link>
						)}
						{user.email === 'admin@gmail.com' && (
							<Link to='' className='btnpanelgestion'>
								<i className='iconavbar bi bi-search'></i>
								Movimientos Cancelados
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
						<p className='titletabla'>Gastos e Ingresos Pendientes</p>
					</div>

					<div className='search'>
						<p className='subtitlegestion'>Buscar Movimiento</p>
						<input
							className='searchinput'
							type='text'
							value={filtering}
							onChange={(e) => setFiltering(e.target.value)}
						/>
					</div>
					<div className='container table-responsive'>
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
								{table.getRowModel().rows.map((row) => (
									<tr key={row.original._id}>
										{row.getVisibleCells().map((cell, index) => (
											<td key={index}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										))}
										<td className='align-middle'>
											<div className='d-flex flex-row justify-content-center'>
												{user.email === 'admin@gmail.com' && (
													<Link
														className='btneditgestion'
														to={`/editargastos/${row.original._id}`}>
														<i className='bi bi-pen  acciconogestion'></i>
													</Link>
												)}
												{user.email === 'admin@gmail.com' && (
													<button
														className='btnborragestion'
														onClick={() => borrarGasto(row.original._id)}>
														<i className='bi bi-trash-fill  acciconogestion'></i>
													</button>
												)}
												<button
													className='btnvergestion'
													onClick={(e) => {
														setShowVerGasto(true);
														verGasto(row.original._id);
													}}>
													<i className='bi bi-search acciconogestion'></i>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
					<div className='d-flex flex-row justify-content-center'>
						<button
							className='btnvpaginagestion'
							onClick={() => table.setPageIndex(0)}>
							Primer Pagina
						</button>
						<button
							className='btnvpaginagestion'
							onClick={() => table.previousPage()}>
							Pagina Anterior
						</button>
						<button
							className='btnvpaginagestion'
							onClick={() => table.nextPage()}>
							Pagina Siguiente
						</button>
						<button
							className='btnvpaginagestion'
							onClick={() =>
								table.setPageIndex(table.getPageCount() - 1)
							}>
							Ultima Pagina
						</button>
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
							<Form.Label>Nro Expte: {gasto.nroexpte}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Concepto: {gasto.concepto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Monto: $ {gasto.monto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>
								Comprobante Adjuntos: {gasto.comprobante}
							</Form.Label>
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
