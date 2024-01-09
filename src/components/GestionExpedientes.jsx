import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
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
import { useExptes } from '../context/ExptesContext';

export const GestionExpedientes = () => {
	const { getExptes, deleteExpte } = useExptes();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [expte, setExpte] = useState([]);
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');

	const columns = React.useMemo(
		() => [
			{
				header: 'Nro Expte',
				accessorKey: 'nroexpte',
			},
			{
				header: 'Fuero',
				accessorKey: 'radicacion',
			},
			{
				header: 'Juzgado',
				accessorKey: 'juzgado',
			},
			{
				header: 'Caratula',
				accessorKey: 'caratula',
			},
		],
		[]
	);

// Trae exptes de getExptes y guarda en data y exptes
	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedExptes = await getExptes();
				setData(fetchedExptes);
				setExpte(fetchedExptes);
			} catch (error) {
				console.error('Error al obtener expedientes', error);
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

	// funcion para eliminar expedientes
	async function borrarExpte(id) {
		try {
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminación del expediente?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteExpte(id);
				Swal.fire({
					icon: 'success',
					title: 'Expediente eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
				setData((prevData) => prevData.filter((expte) => expte._id !== id));
			}
		} catch (error) {
			console.error('Error al eliminar el expediente:', error);
		}
	}

	return (
		<>
			<div className='container-fluid bg-dark'>
				<div className='main px-3 bodygestion '>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {user.email}
					</h4>
					<p className='subtitlegestion'>
						Panel de Administracion de Expedientes
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{user.email === 'admin@gmail.com' && (
							<Link
								type='button'
								className='btnpanelgestion'
								to='/CargaExptes'
								data-bs-toggle='modal'
								data-bs-target='#Modal'>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar expediente
							</Link>
						)}
						{user.email === 'admin@gmail.com' && (
							<Link to='/exptesarchivados' className='btnpanelgestion'>
								<i className='iconavbar bi bi-search'></i>
								Expedientes Archivados
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
						<p className='titletabla'>Expedientes en Tramite</p>
					</div>

					<div className='search'>
						<p className='subtitlegestion'>Buscar Expediente</p>
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
							className='tablagestion table table-responsive border border-secondary-subtle'>
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
														to={`/editarexptes/${row.original._id}`}>
														<i className='bi bi-pen  acciconogestion'></i>
													</Link>
												)}
												{user.email === 'admin@gmail.com' && (
													<button
														className='btnborragestion'
														onClick={() =>
															borrarExpte(row.original._id)
														}>
														<i className='bi bi-trash-fill  acciconogestion'></i>
													</button>
												)}
												<Link
													className='btnvergestion'
													to={`/gestionmovimientos/${row.original._id}`}>
													<i className='bi bi-search acciconogestion'></i>
												</Link>
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
		</>
	);
};
