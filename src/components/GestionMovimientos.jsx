import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
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
import '../css/MovExptes.css';
import { Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { uploadFile } from '../firebase/config';
import { db } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const GestionMovimientos = () => {
	const { currentUser } = useAuth();
	const { id } = useParams();
	const [data, setData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedMov, setSelectedMov] = useState([]);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [expte, setExpte] = useState([]);
	const { register, handleSubmit, reset, setValue } = useForm();
	const user = currentUser.email;
	const displayName = currentUser.displayName;

	const handleOpenModal = () => setShowEditModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		reset();
		setShowModal(false);
		setShowCreateModal(false);
		setShowViewModal(false);
		setShowEditModal(false);
	};

	const columns = React.useMemo(
		() => [
			{
				header: 'Fecha',
				accessorKey: 'fecha',
				size: 50,
			},
			{
				header: 'Descripcion',
				accessorKey: 'descripcion',
				size: 250,
			},
			{
				header: 'Adjunto',
				accessorKey: 'file',
				size: 50,
				Cell: ({ row }) => {
					if (row.original.fileUrl) {
						return <i className='iconavbar bi bi-paperclip'></i>;
					}
					return null;
				},
			},
		],
		[]
	);

	// Funcion para cargar tabla de movimientos
	const table = useMaterialReactTable({
		columns,
		data: data || [],
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
					onClick={() => verMov(row.original.id, expte.id)}>
					<VisibilityIcon />
				</IconButton>
				{user === 'ofvinals@gmail.com' ||
				user === 'estudioposseyasociados@gmail.com' ? (
					<IconButton
						color='success'
						onClick={() => editMov(row.original.id, expte.id)}>
						<EditIcon />
					</IconButton>
				) : null}
				{user === 'ofvinals@gmail.com' && (
					<IconButton
						color='error'
						onClick={() => borrarMov(row.original.id, expte.id)}>
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

	// carga exptes
	useEffect(() => {
		const fetchExptes = async () => {
			try {
				const expteRef = doc(db, 'expedientes', id);
				const snapshot = await getDoc(expteRef);

				if (snapshot.exists()) {
					const fetchedExpte = { ...snapshot.data(), id: snapshot.id };
					setExpte(fetchedExpte);
					setData(fetchedExpte.movimientos);
				} else {
					console.log(
						'No se encontró el expediente con el ID proporcionado.'
					);
				}
			} catch (error) {
				console.error('Error al obtener movimientos del expediente', error);
			}
		};

		fetchExptes();
	}, []);

	// Agrega nuevos movimientos
	const onSubmit = handleSubmit(async (values) => {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const fechaFormateada = format(new Date(values.fecha), 'dd/MM/yyyy');
			let fileDownloadUrl = null;

			if (values.file && values.file[0]) {
				const file = values.file[0];
				fileDownloadUrl = await uploadFile(file);
			}

			const movData = {
				id: uuidv4(),
				fecha: fechaFormateada,
				descripcion: values.descripcion,
				fileUrl: fileDownloadUrl,
			};
			const expteRef = doc(db, 'expedientes', id);
			const expteSnapshot = await getDoc(expteRef);
			const currentMovimientos = expteSnapshot.data().movimientos || [];
			const updatedMovimientos = [...currentMovimientos, movData];

			if (!('movimientos' in expteSnapshot.data())) {
				await updateDoc(expteRef, { movimientos: [] });
			}
			await updateDoc(expteRef, { movimientos: updatedMovimientos });
			Swal.fire({
				icon: 'success',
				title: 'Movimiento creado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			Swal.close();
			handleCloseModal();
			const updatedExpteSnapshot = await getDoc(expteRef);
			const updatedExpteData = updatedExpteSnapshot.data();
			setData(updatedExpteData.movimientos || []);
		} catch (error) {
			console.error(error);
		}
	});

	// funcion para ver movimientos en Modal
	async function verMov(movimientoId, expedienteId) {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const expteRef = doc(db, 'expedientes', expedienteId);
			const snapshot = await getDoc(expteRef);
			if (snapshot.exists()) {
				const expedienteData = snapshot.data();
				const selectedMovimiento = expedienteData.movimientos.find(
					(mov) => mov.id === movimientoId
				);
				if (selectedMovimiento) {
					setSelectedMov(selectedMovimiento);
					Swal.close();
					setShowViewModal(true);
				}
			}
		} catch (error) {
			console.error('Error al obtener movimientos del expediente', error);
		}
	}

	// Función para editar los datos del movimiento
	async function editMov(movimientoId, expedienteId) {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const expteRef = doc(db, 'expedientes', expedienteId);
			const snapshot = await getDoc(expteRef);
			if (snapshot.exists()) {
				const expedienteData = snapshot.data();
				const selectedMovimiento = expedienteData.movimientos.find(
					(mov) => mov.id === movimientoId
				);
			}
			const movData = snapshot.data();
			setValue('fecha', movData.fecha);
			setValue('descripcion', movData.descripcion);
			setValue('adjunto', movData.adjunto);
			Swal.close();
			handleOpenModal();
		} catch (error) {
			console.error('Error al cargar el movimiento', error);
		}
	}

	// funcion para eliminar movimientos
	const deleteMovimiento = async (movimientoId, expedienteId) => {
		try {
			Swal.showLoading();
			const expteRef = doc(db, 'expedientes', expedienteId);
			// Obtiene los movimientos actuales
			const expteSnapshot = await getDoc(expteRef);
			const expedienteData = expteSnapshot.data();
			const currentMovimientos = expedienteData.movimientos || [];
			// Filtra los movimientos para excluir el que se desea eliminar
			const updatedMovimientos = currentMovimientos.filter(
				(mov) => mov.id !== movimientoId
			);
			// Actualiza el expediente con los movimientos actualizados
			await updateDoc(expteRef, { movimientos: updatedMovimientos });
			Swal.fire({
				icon: 'success',
				title: 'Movimiento eliminado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			Swal.close();
			setData(updatedMovimientos);
		} catch (error) {
			console.error('Error al eliminar el movimiento:', error);
		}
	};

	// Función para confirmar y luego llamar a deleteMovimiento
	async function borrarMov(expedienteId, movimientoId) {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminación del movimiento?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteMovimiento(expedienteId, movimientoId);
			}
			Swal.close();
		} catch (error) {
			console.error('Error al eliminar el movimiento:', error);
		}
	}

	return (
		<>
			<div className='container-lg bg-dark'>
				<div className='main bodygestion'>
					<h4 className='titlegestion'>Bienvenido, {displayName}</h4>
					<p className='subtitlegestion'>
						Panel de Movimientos de Expedientes
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{user === 'ofvinals@gmail.com' ||
						user === 'estudioposseyasociados@gmail.com' ? (
							<button
								className='btnpanelgestion'
								onClick={() => setShowCreateModal(true)}>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar movimiento
							</button>
						) : null}
						<Link to='/gestionexpedientes' className='btnpanelgestion'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>
					<hr className='linea mx-3' />

					<div>
						<h2 className='titletabla'>Datos del Expediente</h2>

						<div className=''>
							<p className='datosexptes'>
								<u>Nro Expte:</u> {expte.nroexpte}
							</p>
							<p className='datosexptes'>
								<u>Caratula:</u> {expte.caratula}
							</p>
							<p className='datosexptes'>
								<u>Fuero:</u> {expte.radicacion}
							</p>
							<p className='datosexptes'>
								<u>Juzgado:</u> {expte.juzgado}
							</p>

							<p></p>
						</div>
						<hr className='linea mx-3' />
					</div>
					<h2 className='titletabla'>Movimientos del Expediente</h2>
					<div>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<MaterialReactTable table={table} />
						</ThemeProvider>
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
							<Form.Group className='formcargagroup' id='inputname'>
								<Form.Label className='labelcarga'>Fecha</Form.Label>
								<Form.Control
									type='date'
									className='inputcarga'
									aria-label='Default select'
									{...register('fecha')}></Form.Control>
							</Form.Group>

							<Form.Group className='formcargagroup' id='inputname'>
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

							<Form.Group className='formcargagroup' id='inputsubname'>
								<Form.Label className='labelcarga'>Adjunto</Form.Label>
								<Form.Control
									type='file'
									className='inputcarga'
									aria-label='Default select'
									{...register('file')}></Form.Control>
							</Form.Group>

							<Form.Group className='botonescarga'>
								<button className='botoneditcarga' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Guardar Movimiento
								</button>
								<button
									onClick={(e) => {
										handleCloseModal(e);
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
			<Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Consultar Movimiento</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' id=''>
							<Form.Label>Fecha: {selectedMov.fecha}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id=''>
							<Form.Label>
								Movimiento: {selectedMov.descripcion}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id=''>
							<Form.Label>
								Archivo Adjunto:{' '}
								{selectedMov.fileUrl ? (
									<a
										href={selectedMov.fileUrl}
										target='_blank'
										className='text-white'
										rel='noopener noreferrer'>
										Ver Archivo Adjunto
									</a>
								) : (
									'Sin archivo adjunto'
								)}
							</Form.Label>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button
						className='btneditgestion px-2'
						onClick={(e) => {
							handleCloseModal(e);
						}}>
						Volver
					</button>
				</Modal.Footer>
			</Modal>

			{/* Modal para editar movimientos del expediente */}
			<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Editar Movimiento</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group
							className='mb-3 grupocaratula'
							controlId='inputcaratula'>
							<Form.Label className='labelcarga'>Fecha</Form.Label>
							<Form.Control
								className='labelcarcaratula'
								type='date'
								{...register('fecha')}
							/>
						</Form.Group>
						<Form.Group
							className='mb-3 grupocaratula'
							controlId='inputcaratula'>
							<Form.Label className='labelcarga'>Descripcion</Form.Label>
							<Form.Control
								className='labelcarcaratula'
								as='textarea'
								rows={7}
								cols={70}
								{...register('descripcion')}
							/>
						</Form.Group>

						<Form.Group className='mb-3' id=''>
							<Form.Label>
								Archivo Adjunto:{' '}
								{selectedMov.fileUrl ? (
									<a
										href={selectedMov.fileUrl}
										target='_blank'
										className='text-white'
										rel='noopener noreferrer'>
										Ver Archivo Adjunto
									</a>
								) : (
									'Sin archivo adjunto'
								)}
							</Form.Label>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button
						className='btneditgestion px-2'
						onClick={(e) => {
							handleCloseModal(e);
						}}>
						Volver
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
