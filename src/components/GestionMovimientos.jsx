import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from '@tanstack/react-table';
import '../css/MovExptes.css';
import { Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useExptes } from '../context/ExptesContext';
import { format } from 'date-fns';

export const GestionMovimientos = () => {
	const { user } = useAuth();
	const params = useParams();
	const navigate = useNavigate();
	const { getExpte, createMov, deleteMov } = useExptes();
	const [data, setData] = useState([]);
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [selectedMov, setSelectedMov] = useState([]);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [expte, setExpte] = useState([]);
	const { register, handleSubmit, reset } = useForm();

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		reset();
		setShowModal(false);
		setShowCreateModal(false);
	};

	// Cierra modales
	const handleCancel = () => {
		setShowModal(false);
		setShowCreateModal(false);
	};

	const columns = React.useMemo(
		() => [
			{
				header: 'Fecha',
				accessorKey: 'fecha',
			},
			{
				header: 'Descripcion',
				accessorKey: 'descripcion',
			},
			{
				header: 'Adjunto',
				accessorKey: 'adjunto',
			},
		],
		[]
	);

	// carga exptes de getExptes y guarda en exptes
	useEffect(() => {
		const fetchExpte = async () => {
			try {
				const fetchedExptes = await getExpte(params.id);
				setExpte(fetchedExptes);
				setData(fetchedExptes.movimientos);
			} catch (error) {
				console.error('Error al obtener movimientos del expediente', error);
			}
		};
		fetchExpte();
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

	// Agrega nuevos movimientos
	const onSubmit = handleSubmit(async (data) => {
		const fechaFormateada = format(new Date(data.fecha), 'dd/MM/yyyy');
		await createMov({ ...data, fecha: fechaFormateada }, params.id);
		Swal.fire({
			icon: 'success',
			title: 'Movimiento creado correctamente',
			showConfirmButton: false,
			timer: 1500,
		});
		const updatedExpte = await getExpte(params.id);
		setExpte(updatedExpte);
		setData(updatedExpte.movimientos);
		// Cierra el modal después de guardar los cambios
		await handleCloseModal();
	});

	// funcion para ver movimientos en Modal
	async function verMov(id) {
		const movimientoSeleccionado = expte.movimientos.find(
			(mov) => mov._id === id
		);
		setSelectedMov(movimientoSeleccionado);
		setShowModal(true);
	}

	// funcion para eliminar movimientos
	async function borrarMov(expedienteId, movimientoId) {
		try {
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion del movimiento?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteMov(expedienteId, movimientoId);
				Swal.fire({
					icon: 'success',
					title: 'Movimiento eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
				setData((prevData) =>
					prevData.filter((mov) => mov._id !== movimientoId)
				);
			}
		} catch (error) {
			console.error('Error al eliminar el movimiento:', error);
		}
	}

	return (
		<>
			<div className='container-fluid bg-dark'>
				<div className='main px-3 bodygestion'>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {user.email}
					</h4>
					<p className='subtitlegestion'>
						Panel de Movimientos de Expedientes
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{user.email === 'admin@gmail.com' && (
							<button
								className='btnpanelgestion'
								onClick={() => setShowCreateModal(true)}>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar movimiento
							</button>
						)}
						<Link to='/gestionexpedientes' className='btnpanelgestion'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>
					<hr className='linea mx-3' />

					<div>
						<h2 className='titletabla'>Datos del Expediente</h2>

						<div className=''>
							<p className='datosexptes'>Nro Expte: {expte.nroexpte}</p>
							<p className='datosexptes'>Caratula: {expte.caratula}</p>
							<p className='datosexptes'>Fuero: {expte.radicacion}</p>
							<p className='datosexptes'>Juzgado: {expte.juzgado}</p>

							<p></p>
						</div>
						<hr className='linea mx-3' />
					</div>
					<h2 className='titletabla'>Movimientos del Expediente</h2>
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
														to={`/editarmov/${row.original._id}?nroexpte=${expte._id}`}>
														<i className='bi bi-pen  acciconogestion'></i>
													</Link>
												)}
												{user.email === 'admin@gmail.com' && (
													<button
														className='btnborragestion'
														onClick={() =>
															borrarMov(
																expte._id,
																row.original._id
															)
														}>
														<i className='bi bi-trash-fill  acciconogestion'></i>
													</button>
												)}
												<button
													className='btnvergestion'
													onClick={() => verMov(row.original._id)}>
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
							<i classname=' me-2 bi bi-chevron-bar-left'></i>Primer Pagina
						</button>
						<button
							className='btnvpaginagestion'
							onClick={() => table.previousPage()}>
							<i classname=' me-2 bi bi-chevron-left'></i>
							Pagina Anterior
						</button>
						<button
							className='btnvpaginagestion'
							onClick={() => table.nextPage()}>
							Pagina Siguiente<i classname=' ms-2 bi bi-chevron-right'></i>
						</button>
						<button
							className='btnvpaginagestion'
							onClick={() =>
								table.setPageIndex(table.getPageCount() - 1)
							}>
							Ultima Pagina<i classname=' ms-2 bi bi-chevron-bar-right'></i>
						</button>
					</div>
				</div>
			</div>

			{/* Modal para agregar movimientos al expediente */}
			<div className='bodyedit'>
				<Modal show={showCreateModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Cargar Nuevo Movimiento
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form className='Formcarga ' onSubmit={onSubmit}>
							<Form.Group
								className='formcargagroup'
								controlId='inputname'>
								<Form.Label className='labelcarga'>Fecha</Form.Label>
								<Form.Control
									type='date'
									className='inputcarga'
									aria-label='Default select'
									{...register('fecha')}></Form.Control>
							</Form.Group>

							<Form.Group
								className='formcargagroup'
								controlId='inputname'>
								<Form.Label className='labelcarga'>
									Descripcion
								</Form.Label>
								<Form.Control
									placeholder='Ingrese la descripcion del movimiento..'
									className='inputcarga'
									as='textarea'
									rows={7}
									cols={70}
									{...register('descripcion')}
								/>
							</Form.Group>

							<Form.Group
								className='formcargagroup'
								controlId='inputsubname'>
								<Form.Label className='labelcarga'>Adjunto</Form.Label>
								<Form.Control
									type='text'
									className='inputcarga'
									aria-label='Default select'
									{...register('adjunto')}></Form.Control>
							</Form.Group>

							<Form.Group className='botonescarga'>
								<button className='botoneditcarga' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Guardar Movimiento
								</button>
								<button
									onClick={(e) => {
										handleCancel(e);
									}}
									type='button'
									className='btncanccarga'>
									<i className='iconavbar bi bi-x-circle-fill'></i>
									Cancelar
								</button>
							</Form.Group>
						</Form>
					</Modal.Body>
				</Modal>
			</div>

			{/* Modal para ver movimientos del expediente */}
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Consultar Movimiento</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Fecha: {selectedMov.fecha}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>
								Movimiento: {selectedMov.descripcion}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>
								Archivos Adjuntos: {selectedMov.archivo}
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
