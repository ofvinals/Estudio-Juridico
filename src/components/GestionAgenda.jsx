import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../css/Gestion.css';
import { Form, Modal } from 'react-bootstrap';
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
import dayjs from 'dayjs';
import {
	collection,
	getDocs,
	getDoc,
	deleteDoc,
	doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const GestionAgenda = () => {
	const user = useAuth();
	const { displayName } = useAuth();
	const navigate = useNavigate();
	const [turno, setTurno] = useState([]);
	const [turnosVencidos, setTurnosVencidos] = useState([]);
	const [data, setData] = useState([]);
	const [showVerTurno, setShowVerTurno] = useState(false);
	const [summary, setSummary] = useState('');
	const [description, setDescription] = useState('');
	const [location, setLocation] = useState('');
	const [startDateTime, setStartDateTime] = useState('');
	const [endDateTime, setendDateTime] = useState('');
	const { loginWithGoogle, createEvents } = useAuth();
	const [showCargaVenc, setShowCargaVenc] = useState(false);
	// Cierra modales
	const handleCancel = () => {
		setShowVerTurno(false);
	};

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

	useEffect(() => {
		const fetchData = async () => {
			try {
				Swal.showLoading();
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
				setTimeout(() => {
					Swal.close();
					setTurno(turnosPendientes);
					setData(turnosPendientes);
					setTurnosVencidos(turnosVencidos);
				}, 500);
				return () => clearTimeout(timer);
			} catch (error) {
				console.error('Error al obtener turnos', error);
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
					onClick={() => verTurno(row.original.id)}>
					<VisibilityIcon />
				</IconButton>
				{user.user === 'ofvinals@gmail.com' ||
				user.user === 'admin@estudio.com' ? (
					<IconButton
						color='success'
						onClick={() => {
							navigate(`/editarturnos/${row.original.id}`);
						}}>
						<EditIcon />
					</IconButton>
				) : null}
				{user.user === 'ofvinals@gmail.com' && (
					<IconButton
						color='error'
						onClick={() => borrarTurno(row.original.id)}>
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
				Swal.fire(
					'Eliminado',
					'El turno fue eliminado con éxito',
					'success'
				);
				setTimeout(() => {
					Swal.close();
					setData((prevData) =>
						prevData.filter((turno) => turno.id !== id)
					);
				}, 500);
			}
		} catch (error) {
			console.error('Error al eliminar el turno:', error);
			Swal.fire('Error', 'Hubo un problema al eliminar el turno', 'error');
		}
	}

	// funcion para ver turnos en Modal
	async function verTurno(id) {
		Swal.showLoading();
		const turnoRef = doc(db, 'turnos', id);
		const snapshot = await getDoc(turnoRef);
		const turnoData = snapshot.data();
		setTurno(turnoData);
		setTimeout(() => {
			Swal.close();
			setShowVerTurno(true);
		}, 500);
		return () => clearTimeout(timer);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createEvents(
				summary,
				description,
				startDateTime,
				endDateTime,
				location
			);
		} catch (error) {
			console.error('Error handling create-event request:', error);
		}
	};

	return (
		<>
			<div className='bodygestion container-lg bg-dark'>
				<div className='main px-3 '>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {displayName}
					</h4>
					<p className='subtitlegestion'>
						Panel de Administracion de Agenda
					</p>
				</div>
			</div>

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
					<button
						type='button'
						// onClick={loginWithGoogle}
						className='btnpanelgestion'>
						<i className='iconavbar bi bi-file-earmark-plus'></i>Cargar
						vencimientos
					</button>
					<Link to='/Admin' className='btnpanelgestion'>
						<i className='iconavbar bi bi-box-arrow-left'></i>
						Volver al Panel
					</Link>
				</div>
				<hr className='linea mx-3' />

				<div>
					<p className='titletabla'>Turnos Registrados</p>
				</div>
				<div>
					<ThemeProvider theme={darkTheme}>
						<CssBaseline />
						<MaterialReactTable table={table} />
					</ThemeProvider>
				</div>
			</div>

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
							<Form.Label>Motivo: {turno.motivo}</Form.Label>
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

			{/* Modal para cargar vencimientos */}
			<Modal show={showCargaVenc} onHide={() => setShowCargaVenc(false)}>
				<Modal.Header closeButton>
					<Modal.Title className='text-white'>
						Cargar Vencimientos
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						{/* <div>
					<form onSubmit={handleSubmit}>
						<label htmlFor='summary'>Sumary</label>
						<br />
						<input
							type='text'
							id='summary'
							value={summary}
							onChange={(e) => setSummary(e.target.value)}
						/>
						<label htmlFor='description'>Description</label>
						<br />
						<textarea
							id='descripcion'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<label htmlFor='location'>Location</label>
						<br />
						<input
							type='text'
							id='location'
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
						<label htmlFor='startDateTime'>Start Date Time</label>
						<br />
						<input
							type='datetime-local'
							id='startDateTime'
							value={startDateTime}
							onChange={(e) => setStartDateTime(e.target.value)}
						/>
						<label htmlFor='endDateTime'>End Date Time</label>
						<br />
						<input
							type='datetime-local'
							id='endDateTime'
							value={endDateTime}
							onChange={(e) => setendDateTime(e.target.value)}
						/>
						<button type='submit'>Create Event</button>
					</form>
				</div> */}
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
