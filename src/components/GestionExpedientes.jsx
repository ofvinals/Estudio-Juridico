import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
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
import Swal from 'sweetalert2';
import '../css/Gestion.css';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const GestionExpedientes = () => {
	const { id } = useParams();
	const {displayName} = useAuth();
	const user = useAuth();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const columns = useMemo(
		() => [
			{
				header: 'Expte',
				accessorKey: 'nroexpte',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'Caratula',
				accessorKey: 'caratula',
				enableColumnOrdering: false,
				size: 300,
			},
			{
				header: 'Fuero',
				accessorKey: 'radicacion',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'Juzgado',
				accessorKey: 'juzgado',
				enableColumnOrdering: false,
				size: 50,
			},
		],
		[]
	);

	// Trae exptes y guarda en data y exptes
	useEffect(() => {
		const fetchData = async () => {
			try {
				Swal.showLoading();
				const exptesRef = collection(db, 'expedientes');
				const snapshot = await getDocs(exptesRef);
				const fetchedExptes = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});

				const filteredExptes =
					user.user === 'ofvinals@gmail.com' || user.user === 'estudioposseyasociados@gmail.com'
						? fetchedExptes
						: fetchedExptes.filter(
								(expte) => expte.cliente === user.user
						  );
				setTimeout(() => {
					Swal.close();
					setData(filteredExptes);
				}, 500);
				return () => clearTimeout(timer)
			} catch (error) {
				console.error('Error al obtener expedientes', error);
			}
		};

		fetchData();
	}, []);

		// Funcion para cargar tabla 
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
						navigate(`/gestionmovimientos/${row.original.id}`);
					}}>
					<VisibilityIcon />
				</IconButton>
				{user.user === 'ofvinals@gmail.com' || user.user === 'estudioposseyasociados@gmail.com' ? (
					<IconButton
						color='success'
						onClick={() => {
							navigate(`/editarexptes/${row.original.id}`);
						}}>
						<EditIcon />
					</IconButton>
				):null }
				{user.user === 'ofvinals@gmail.com' && (
					<IconButton
						color='error'
						onClick={() => borrarExpte(row.original.id)}>
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

	// funcion para eliminar expedientes
	const deleteExpte = (id) => deleteDoc(doc(db, 'expedientes', id));
	async function borrarExpte(id) {
		try {
			Swal.showLoading();
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
				setTimeout(() => {
					Swal.close();
					setData((prevData) => prevData.filter((expte) => expte.id !== id));
				}, 500);
				return () => clearTimeout(timer);
			}
		} catch (error) {
			console.error('Error al eliminar el expediente:', error);
		}
	}

	return (
		<>
			<div className='container-lg bg-dark'>
				<div className='main bodygestion '>
					<h4 className='titlegestion'>
						Bienvenido, {displayName}
					</h4>
					<p className='subtitlegestion'>
						Panel de Administracion de Expedientes
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{user.user === 'ofvinals@gmail.com' || user.user === 'estudioposseyasociados@gmail.com' && (
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
						{user.user === 'ofvinals@gmail.com' && (
							<Link to='/exptesarchivados' className='btnpanelgestion'>
								<i className='iconavbar bi bi-archive'></i>
								Expedientes Archivados
							</Link>
						)}
						<Link
							to={
								user.user === 'ofvinals@gmail.com'|| user.user === 'estudioposseyasociados@gmail.com'
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
					<div>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<MaterialReactTable table={table} />
						</ThemeProvider>
					</div>
				</div>
			</div>
		</>
	);
};
