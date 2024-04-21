import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../css/Gestion.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Table } from '../../components/Gestion/Table';
import { Detail } from '../../components/Gestion/Detail';
import { VerUsu } from '../../components/ViewModals/VerUsu';
import { EditarUsu } from '../../components/EditModals/EditarUsu';
export const Usuarios = () => {
	const { currentUser } = useAuth();
	const [data, setData] = useState([]);
	const user = currentUser.email;
	const [openViewModal, setopenViewModal] = useState(false);
	const [openEditModal, setopenEditModal] = useState(false);
	const [rowId, setRowId] = useState(null);

	const handleOpenViewModal = (turnoId) => {
		setopenViewModal(true);
		setRowId(turnoId);
	};

	const handleOpenEditModal = (turnoId) => {
		setopenEditModal(true);
		setRowId(turnoId);
	};

	useEffect(() => {
		const fetchUsuarios = async () => {
			try {
				const usuariosRef = collection(db, 'usuarios');
				const snapshot = await getDocs(usuariosRef);
				const fetchedUsuarios = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				setData(fetchedUsuarios);
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

	const actions = [
		{
			text: 'Ver',
			icon: <VisibilityIcon color='primary' />,
			onClick: (row) => {
				handleOpenViewModal(row.original.id);
			},
		},
		{
			text: 'Editar',
			icon: (user === 'ofvinals@gmail.com' ||
				user === 'estudioposseyasociados@gmail.com') && (
				<EditIcon color='success' />
			),
			onClick: (row) => {
				handleOpenEditModal(row.original.id);
			},
		},
		{
			text: 'Eliminar',
			icon: user === 'ofvinals@gmail.com' && <DeleteIcon color='error' />,
			onClick: (row) => {
				if (row.original.email !== 'ofvinals@gmail.com') {
					borrarUsuario(row.original.id);
				} else {
					Swal.fire({
						icon: 'error',
						title: 'No puedes eliminar este usuario',
						text: 'Este usuario no puede ser eliminado.',
					});
				}
			},
		},
	];

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
			<Detail modulo={'Usuarios'} />

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
				<div className='table-responsive'>
					<ThemeProvider theme={darkTheme}>
						<CssBaseline />
						<Table
							columns={columns}
							data={data}
							actions={actions}
							borrarUsuario={borrarUsuario}
						/>
					</ThemeProvider>
				</div>
			</div>
			{openViewModal && <VerUsu id={rowId} />}
			{openEditModal && <EditarUsu id={rowId} />}
		</>
	);
};
export default Usuarios;
