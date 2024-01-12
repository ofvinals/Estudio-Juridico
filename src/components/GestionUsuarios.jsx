import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import Swal from 'sweetalert2';
import '../css/Gestion.css';
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from '@tanstack/react-table';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UsersContext';

export const GestionUsuarios = () => {
	const { user } = useAuth();
	const { getUsers, deleteUser } = useUsers();
	const [data, setData] = useState([]);
	const [users, setUsers] = useState([]);
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');

	const columns = React.useMemo(
		() => [
			{
				header: 'Nombre',
				accessorKey: 'username',
			},
			{
				header: 'Apellido',
				accessorKey: 'apellido',
			},
			{
				header: 'Celular',
				accessorKey: 'celular',
			},
			{
				header: 'Email',
				accessorKey: 'email',
			},
			{
				header: 'DNI',
				accessorKey: 'dni',
			},
		],
		[]
	);
	// Trae usuarios de getUsers y guarda en data y users
	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedUsers = await getUsers();
				setData(fetchedUsers);
				setUsers(fetchedUsers);
			} catch (error) {
				console.error('Error al obtener usuarios:', error);
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

	// funcion para eliminar usuarios
	async function borrarUsuario(id) {
		try {
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion del usuario',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteUser(id);
				Swal.fire({
					icon: 'success',
					title: 'Usuario eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
				setData((prevData) => prevData.filter((users) => users._id !== id));
			}
		} catch (error) {
			console.error('Error al eliminar el expediente:', error);
		}
	}

	return (
		<>
			<div className='bodygestion bg-dark'>
				<div className='main'>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {user.email}
					</h4>
					<p className='subtitlegestion'>
						Panel de Administracion de Usuarios
					</p>
				</div>
			</div>

			<div className='bg-dark'>
				<div className='d-flex justify-content-around'>
					<Link to='/cargausu' type='button' className='btnpanelgestion'>
						<i className='iconavbar bi bi-file-earmark-plus'></i>
						Agregar usuario
					</Link>
					<Link
						to={user.email === 'admin@gmail.com' ? '/Admin' : '/AdminUsu'}
						className='btnpanelgestion'>
						<i className='iconavbar bi bi-box-arrow-left'></i>
						Volver al Panel
					</Link>
				</div>
				<hr className='linea mx-3' />

				<div>
					<p className='mt-3 titletabla'>Usuarios registrados</p>
				</div>

				<div className='search'>
					<p className='subtitlegestion'>Buscar Usuario</p>
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
													hidden={
														row.original.email ===
														'admin@gmail.com'
													}
													className='btneditgestion'
													to={`/editarusu/${row.original._id}`}>
													<i className='bi bi-pen  acciconogestion'></i>
												</Link>
											)}
											{user.email === 'admin@gmail.com' && (
												<button
													hidden={
														row.original.email ===
														'admin@gmail.com'
													}
													className='btnborragestion'
													onClick={() =>
														borrarUsuario(row.original._id)
													}>
													<i className='bi bi-trash-fill  acciconogestion'></i>
												</button>
											)}
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
		</>
	);
};
