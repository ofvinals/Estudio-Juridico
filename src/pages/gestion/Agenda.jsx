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
import dayjs from 'dayjs';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Table } from '../../components/Gestion/Table';
import { Detail } from '../../components/Gestion/Detail';
import { VerTurno } from '../../components/ViewModals/VerTurno';
import { EditarTurnos } from '../../components/EditModals/EditarTurnos';

export const Agenda = () => {
	const { currentUser } = useAuth();
	const [turnosVencidos, setTurnosVencidos] = useState([]);
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
		const fetchTurnos = async () => {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const turnoRef = collection(db, 'turnos');
				const snapshot = await getDocs(turnoRef);
				const fetchedTurnos = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
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
				Swal.close();
				setTurnosVencidos(turnosVencidos);
				setData(turnosPendientes);
			} catch (error) {
				console.error('Error al obtener turnos', error);
			}
		};
		fetchTurnos();
	}, []);
	console.log(turnosVencidos);

	const columns = React.useMemo(
		() => [
			{
				header: 'Turno',
				accessorKey: 'turno',
				size: 50,
			},
			{
				header: 'Usuario',
				accessorKey: 'email',
				size: 50,
			},
			{
				header: 'Motivo',
				accessorKey: 'motivo',
				enableResizing: true,
				size: 250,
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
			onClick: (row) => borrarTurno(row.original.id),
		},
	];

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	// funcion para eliminar turnos
	const deleteTurno = (id) => deleteDoc(doc(db, 'turnos', id));
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
				Swal.showLoading();
				await deleteTurno(id);
				Swal.fire({
					icon: 'success',
					title: 'El turno fue eliminado!',
					showConfirmButton: false,
					timer: 2500,
				});
				Swal.close();
				setData((prevData) => prevData.filter((turno) => turno.id !== id));
			}
		} catch (error) {
			console.error('Error al eliminar el turno:', error);
			Swal.fire('Error', 'Hubo un problema al eliminar el turno', 'error');
		}
	}

	return (
		<>
			<Detail modulo={'Agenda'} />
			<div className='bg-dark'>
				<div className='d-flex justify-content-around'>
					<button
						type='button'
						onClick={() =>
							window.open(
								'https://calendar.google.com/calendar/embed?src=365fa9c4ffc2a2c85cd2d4c3e28942427e52a6a2a6d92386566dbe9ada6d50fe%40group.calendar.google.com&ctz=America%2FArgentina%2FBuenos_Aires'
							)
						}
						className='botongoogleagenda'>
						<i className='iconavbar bi bi-google'></i>Ver Agenda del
						Estudio
					</button>
					<Link to='/googlecalendar' className='btnpanelgestion'>
						<i className='iconavbar bi bi-file-earmark-plus'></i>Cargar
						vencimientos/audiencias
					</Link>
					<Link to='/Admin' className='btnpanelgestion'>
						<i className='iconavbar bi bi-box-arrow-left'></i>
						Volver al Panel
					</Link>
				</div>
				<hr className='linea mx-3' />

				<div>
					<p className='titletabla'>Turnos y Vencimientos Pendientes</p>
				</div>
				<div className='table-responsive'>
					<ThemeProvider theme={darkTheme}>
						<CssBaseline />
						<Table
							columns={columns}
							data={data}
							actions={actions}
							borrarTurno={borrarTurno}
							handleOpenViewModal={handleOpenViewModal}
						/>
					</ThemeProvider>
				</div>
			</div>
			{openViewModal && <VerTurno id={rowId} />}
			{openEditModal && <EditarTurnos id={rowId} />}
		</>
	);
};
export default Agenda;
