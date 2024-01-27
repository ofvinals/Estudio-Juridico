import React, { useEffect } from 'react';
import { useState } from 'react';
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
import {
	collection,
	getDocs,
	getDoc,
	deleteDoc,
	doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Form, Modal } from 'react-bootstrap';

export const GestionUsuarios = () => {
	const user = useAuth();
	const {displayName} = useAuth();
	const [data, setData] = useState([]);
	const [users, setUsers] = useState([]);
	const [showVerUsuario, setShowVerUsuario] = useState(false);

	// Cierra modales
	const handleCancel = () => {
		setShowVerUsuario(false);
	};

	const navigate = useNavigate();
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
	// Trae usuarios de getUsers y guarda en data y users
	useEffect(() => {
		const fetchData = async () => {
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
		fetchData();
	}, []);

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
					onClick={() => verUsuario(row.original.id)}>
					<VisibilityIcon />
				</IconButton>
				{user.user === 'ofvinals@gmail.com' || user.user === 'admin@estudio.com' ? (
					<IconButton
						hidden={row.original.email === 'ofvinals@gmail.com' || row.original.email === 'admin@estudio.com'}
						color='success'
						onClick={() => {
							navigate(`/editarusu/${row.original.id}`);
						}}>
						<EditIcon />
					</IconButton>
				):null}
				{user.user === 'ofvinals@gmail.com' && (
					<IconButton
						hidden={row.original.email === 'ofvinals@gmail.com' || row.original.email === 'admin@estudio.com'}
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

	// funcion para ver movimientos de caja en Modal
	async function verUsuario(id) {
		Swal.showLoading();
		const usuarioRef = doc(db, 'usuarios', id);
		const snapshot = await getDoc(usuarioRef);
		const usuarioData = snapshot.data();
		setUsers(usuarioData);
		setTimeout(() => {
			Swal.close();
			setShowVerUsuario(true);
		}, 500);
		return () => clearTimeout(timer);
	}

	// funcion para eliminar usuarios
	const deleteUsuario = (id) => deleteDoc(doc(db, 'usuarios', id));

	async function borrarUsuario(id) {
		try {
			Swal.showLoading();
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
				setTimeout(() => {
					Swal.close();
					setData((prevData) =>
						prevData.filter((users) => users.id !== id)
					);
				}, 500);
				return () => clearTimeout(timer);
			}
		} catch (error) {
			console.error('Error al eliminar el expediente:', error);
		}
	}

	return (
		<>
			<div className='container-lg bodygestion bg-dark'>
				<div className='main'>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {displayName}
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
						to={
							user.user === 'ofvinals@gmail.com' || user.user === 'admin@estudio.com' ? '/Admin' : '/AdminUsu'
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

			{/* Modal para ver datos de usuario seleccionada */}
			<Modal show={showVerUsuario} onHide={() => setShowVerUsuario(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Ver Datos de Usuario</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' id='nombre'>
							<Form.Label>
								<u>Nombre o Razon Social:</u> {users.username}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='apellido'>
							<Form.Label>
								<u>Apellido:</u> {users.apellido}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='dni'>
							<Form.Label>
								<u>DNI/CUIT: </u> {users.dni}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='celular'>
							<Form.Label>
								<u>Celular:</u> {users.celular}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='email'>
							<Form.Label>
								<u>Email:</u> {users.email}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='domicilio'>
							<Form.Label>
								<u>Domicilio:</u> {users.domicilio}
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
