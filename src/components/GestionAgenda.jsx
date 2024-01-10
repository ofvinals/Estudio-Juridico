import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import Swal from 'sweetalert2';
import '../css/Gestion.css';
import { Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTurnos } from '../context/TurnosContext';

export const GestionAgenda = () => {
	const { user } = useAuth();
	const { getTurnos, deleteTurno, getTurno } = useTurnos();
	const [turno, setTurno] = useState([]);
	const [turnosVencidos, setTurnosVencidos] = useState([]);
	const [data, setData] = useState([]);
	const [expte, setExpte] = useState([]);
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');
	const [showVerTurno, setShowVerTurno] = useState(false);

	// Cierra modales
	const handleCancel = () => {
		setShowVerTurno(false);
	};

	const columns = React.useMemo(
		() => [
			{
				header: 'Turno',
				accessorKey: 'turno',
			},
			{
				header: 'Usuario',
				accessorKey: 'email',
			},
			{
				header: 'Motivo',
				accessorKey: 'motivo',
				enableResizing: true,
			},
		],
		[]
	);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedTurnos = await getTurnos();
				// Filtrar turnos pendientes (posteriores a la fecha actual)
				const turnosPendientes = fetchedTurnos.filter((turno) => {
					const fechaTurno = dayjs(turno.turno, 'DD-MM-YYYY HH:mm');
					const fechaActual = dayjs();
					return fechaTurno.isAfter(fechaActual);
				});
				// Filtrar turnos vencidos (anteriores a la fecha actual)
				const turnosVencidos = fetchedTurnos.filter((turno) => {
					const fechaTurno = dayjs(turno.turno, 'DD-MM-YYYY HH:mm');
					const fechaActual = dayjs();
					return (
						fechaTurno.isBefore(fechaActual) ||
						fechaTurno.isSame(fechaActual)
					);
				});
				// Ordenar los turnos pendientes por fecha
				turnosPendientes.sort((a, b) => a.turno.localeCompare(b.turno));
				turnosVencidos.sort((a, b) => a.turno.localeCompare(b.turno));
				setTurno(turnosPendientes);
				setData(turnosPendientes);

				setTurnosVencidos(turnosVencidos);
			} catch (error) {
				console.error('Error al obtener turnos', error);
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
			columnResizeMode: 'onChange',
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setFiltering,
	});

	// function cargarTablaVencidos() {
	// 	const tabla = turnosVencidos.map((turno) => (
	// 		<tr key={turno.id}>
	// 			<td className='align-middle '>{turno.turno}</td>
	// 			<td className='align-middle '>{turno.email}</td>
	// 			<td className='align-middle '>{turno.motivo}</td>
	// 			<td className='d-flex flex-row justify-content-around'>
	// 				<Link
	// 					className='btneditgestion'
	// 					to={`/editarturnos/${turno._id}`}>
	// 					<i className='bi bi-pen  acciconogestion'></i>
	// 				</Link>
	// 				<button
	// 					className='btnborragestion'
	// 					onClick={() => borrarTurno(turno._id)}>
	// 					<i className='bi bi-trash-fill  acciconogestion'></i>
	// 				</button>
	// 			</td>
	// 		</tr>
	// 	));
	// 	setTablaVencidos(tabla);
	// }

	// funcion para eliminar usuarios
	async function borrarTurno(id) {
		try {
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion del turno',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteTurno(id);
				window.location.reload();
				Swal.fire(
					'Eliminado',
					'El turno fue eliminado con éxito',
					'success'
				);
			}
		} catch (error) {
			console.error('Error al eliminar el turno:', error);
			Swal.fire('Error', 'Hubo un problema al eliminar el turno', 'error');
		}
	}

	// funcion para ver turnos en Modal
	async function verTurno(id) {
		const turno = await getTurno(id);
		setTurno(turno);
		setShowVerTurno(true);
	}

	return (
		<>
			<div className='bodygestion container-fluid bg-dark'>
				<div className='main px-3 '>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {user.email}
					</h4>
					<p className='subtitlegestion'>
						Panel de Administracion de Agenda
					</p>
				</div>
			</div>

			<div className='bg-dark'>
				<div className='d-flex justify-content-around'>
					<Link to='/Admin' className='btnpanelgestion'>
						<i className='iconavbar bi bi-file-earmark-plus'></i>
						Volver al Panel
					</Link>
				</div>
				<hr className='linea mx-3' />

				<div>
					<p className='titletabla'>Turnos Registrados</p>
				</div>
				<div className='search'>
					<p className='subtitlegestion'>Buscar Turno</p>
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
															header.column.getIsSorted() ?? null
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
													to={`/editarturnos/${row.original._id}`}>
													<i className='bi bi-pen  acciconogestion'></i>
												</Link>
											)}
											{user.email === 'admin@gmail.com' && (
												<button
													className='btnborragestion'
													onClick={() =>
														borrarTurno(row.original._id)
													}>
													<i className='bi bi-trash-fill  acciconogestion'></i>
												</button>
											)}
											<button
												className='btnvergestion'
												onClick={(e) => {
													verTurno(row.original._id);
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
						<i className=' me-2 bi bi-chevron-bar-left'></i>Primer Pagina
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
						Pagina Siguiente<i className=' ms-2 bi bi-chevron-right'></i>
					</button>
					<button
						className='btnvpaginagestion'
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
						Ultima Pagina<i className=' ms-2 bi bi-chevron-bar-right'></i>
					</button>
				</div>
			</div>

			{/* <div>
					<p className='mt-3 titlegestion'>Turnos vencidos</p>
				</div>
				<div className='container table-responsive'>
					<Table
						striped
						hover
						variant='dark'
						className='tablagestion table border border-secondary-subtle'>
						<thead>
							<tr>
								<th>Turno</th>
								<th>Usuario</th>
								<th>Motivo</th>
								<th className='botonescciongestion'>Acciones</th>
							</tr>
						</thead>
						<tbody id='tablaTurnos' className='table-group-divider'>
							{tablaVencidos}
						</tbody>
					</Table>
				</div> */}

			{/* Modal para ver gasto seleccionado */}
			<Modal show={showVerTurno} onHide={() => setShowVerTurno(false)}>
				<Modal.Header closeButton>
					<Modal.Title className='text-white'>
						Ver Turno seleccionado
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Turno: {turno.turno}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Cliente: {turno.email}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Motivo: $ {turno.motivo}</Form.Label>
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
