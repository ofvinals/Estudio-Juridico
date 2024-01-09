import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from '@tanstack/react-table';
import Swal from 'sweetalert2';
import '../css/Gestion.css';
import { Button, Form, Modal } from 'react-bootstrap';
import { useGastos } from '../context/GastosContext.jsx';

export const GestionGastos = () => {
	const { user } = useAuth();
	const params = useParams();
	const { getGastos, deleteGasto, gastos, getGasto } = useGastos();
	const [data, setData] = useState([]);
	const [gasto, setGasto] = useState([]);
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');
	const navigate = useNavigate();
	const [showVerGasto, setShowVerGasto] = useState(false);

	// Cierra modales
	const handleCancel = () => {
		setShowVerGasto(false);
	};

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
				accessorKey:'monto',
			},
			{
				header: 'Estado',
				accessorKey: 'estado',
			},
		],
		[]
	);

// Carga gastos y guarda en data y gasto
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

	// Funcion para cargar tabla de Usuario traida de Local Storage
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
				text: 'Confirmas la eliminacion del gasto',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteGasto(id);
				Swal.fire({
					icon: 'success',
					title: 'Gasto eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
				setData((prevData) => prevData.filter((caja) => caja._id !== id));
				}
		} catch (error) {
			console.error('Error al eliminar el gasto:', error);
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
						Panel de Administracion de Gastos
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
								Agregar gastos
							</Link>
						)}
						{user.email === 'admin@gmail.com' && (
							<Link to='' className='btnpanelgestion'>
								<i className='iconavbar bi bi-search'></i>
								Gastos Cancelados
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
						<p className='titletabla'>Gastos Pendientes de Cobro</p>
					</div>

					<div className='search'>
						<p className='subtitlegestion'>Buscar Gastos</p>
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
														onClick={() =>
															borrarGasto(row.original._id)
														}>
														<i className='bi bi-trash-fill  acciconogestion'></i>
													</button>
												)}
												<button
													className='btnvergestion'
													onClick={(e) => {
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
					<Modal.Title className='text-white'>Ver Gasto seleccionado</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Nro Expte: {gasto.nroexpte}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Concepto: {gasto.concepto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Monto: $ {gasto.monto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
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
