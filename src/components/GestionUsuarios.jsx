import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../css/Gestion.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton } from '@mui/material';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const GestionUsuarios = () => {
	const { currentUser } = useAuth();
	const [data, setData] = useState([]);
	const [users, setUsers] = useState([]);
	const navigate = useNavigate();
	const user = currentUser.email;
	const displayName = currentUser.displayName;

	useEffect(() => {
		const fetchUsuarios = async () => {
			try {
				const usuariosRef = collection(db, 'usuarios');
				const snapshot = await getDocs(usuariosRef);
				const fetchedUsuarios = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				setData(fetchedUsuarios);
				setUsers(fetchedUsuarios);
			} catch (error) {
				console.error('Error al obtener usuarios:', error);
			}
		};
		fetchUsuarios();
	}, []);

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
				size: 50,
			},
			{
				header: 'Email',
				accessorKey: 'email',
				size: 50,
			},
			{
				header: 'DNI',
				accessorKey: 'dni',
				size: 50,
			},
		],
		[]
	);

	const table = useMaterialReactTable({
		columns,
		data,
		enableColumnFilterModes: true,
		enableColumnOrdering: true,
		enableGlobalFilterModes: true,
		enableColumnPinning: true,
		enableRowActions: true,
		enableGrouping: true,
		paginationDisplayMode: 'pages',
		positionToolbarAlertBanner: 'bottom',
		localization: MRT_Localization_ES,
		muiSearchTextFieldProps: {
			size: 'medium',
			variant: 'outlined',
		},
		muiPaginationProps: {
			color: 'primary',
			rowsPerPageOptions: [5, 10, 20, 30],
			shape: 'rounded',
			variant: 'outlined',
		},
		renderRowActions: ({ row, table }) => (
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'nowrap',
					gap: '3px',
				}}>
				<IconButton
					color='primary'
					onClick={() => {
						navigate(`/verusu/${row.original.id}`);
					}}>
					<VisibilityIcon />
				</IconButton>
				{user === 'ofvinals@gmail.com' ||
				user === 'estudioposseyasociados@gmail.com' ? (
					<IconButton
						hidden={
							row.original.email === 'ofvinals@gmail.com' ||
							row.original.email === 'estudioposseyasociados@gmail.com'
						}
						color='success'
						onClick={() => {
							navigate(`/editarusu/${row.original.id}`);
						}}>
						<EditIcon />
					</IconButton>
				) : null}
				{user === 'ofvinals@gmail.com' && (
					<IconButton
						hidden={
							row.original.email === 'ofvinals@gmail.com' ||
							row.original.email === 'estudioposseyasociados@gmail.com'
						}
						color='error'
						onClick={() => borrarUsuario(row.original.id)}>
						<DeleteIcon />
					</IconButton>
				)}
			</Box>
		),
	});
	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	// funcion para eliminar usuarios
	const deleteUsuario = (id) => deleteDoc(doc(db, 'usuarios', id));
	async function borrarUsuario(id) {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
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
				await deleteUsuario(id);
				Swal.fire({
					icon: 'success',
					title: 'Usuario eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});

				setData((prevData) => prevData.filter((users) => users.id !== id));
			}
			Swal.close();
		} catch (error) {
			console.error('Error al eliminar el usuario:', error);
		}
	}

	return (
		<>
			<div className='container-lg bodygestion bg-dark'>
				<div className='main'>
					<h4 className='titlegestion'>Bienvenido, {displayName}</h4>
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
						to={
							user === 'ofvinals@gmail.com' ||
							user === 'estudioposseyasociados@gmail.com'
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
					<p className='mt-3 titletabla'>Usuarios registrados</p>
				</div>

				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<MaterialReactTable table={table} />
				</ThemeProvider>
			</div>
		</>
	);
};
