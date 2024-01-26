import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/Gestion.css';
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
import { Form, Modal } from 'react-bootstrap';
import {
	doc,
	getDoc,
	getDocs,
	collection,
	deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const GestionGastos = () => {
	const user = useAuth();
	const { displayName } = useAuth();
	const { id } = useParams();
	const [data, setData] = useState([]);
	const [gasto, setGasto] = useState([]);
	const [exptes, setExptes] = useState([]);
	const navigate = useNavigate();
	const [showVerGasto, setShowVerGasto] = useState(false);

	// Cierra modales
	const handleCancel = () => {
		setShowVerGasto(false);
	};

	const formatValue = (value) => {
		if (value instanceof Date) {
			return value.toLocaleDateString('es-ES');
		} else if (value && value.toDate instanceof Function) {
			// Convert Firestore timestamp to Date
			const date = value.toDate();
			return date.toLocaleDateString('es-ES');
		} else {
			return value?.toLocaleString?.('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			});
		}
	};

	const columns = React.useMemo(
		() => [
			{
				header: 'Expte',
				accessorKey: 'expte',
				size: 50,
			},
			{
				header: 'Caratula',
				accessorKey: 'caratula',
				size: 250,
				enableResizing: true,
			},
			{
				header: 'Concepto',
				accessorKey: 'concepto',
				size: 100,
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
			{
				header: 'Monto',
				accessorKey: 'monto',
				size: 50,
				Cell: ({ cell }) => <Box>{formatValue(cell.getValue())}</Box>,
			},
			{
				header: 'Estado',
				accessorKey: 'estado',
				size: 50,
			},
		],
		[]
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const exptesRef = collection(db, 'expedientes');
				const fetchedExptes = await getDocs(exptesRef);
				const exptesArray = Object.values(
					fetchedExptes.docs.map((doc) => doc.data())
				);
				setExptes(exptesArray);
			} catch (error) {
				console.error('Error al obtener expedientes:', error);
			}
		};
		fetchData();
	}, []);

	// Carga gastos y guarda en data y gasto
	useEffect(() => {
		const fetchData = async () => {
			try {
				Swal.showLoading();
				const gastosRef = collection(db, 'gastos');
				const snapshot = await getDocs(gastosRef);
				const fetchedGastos = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				const filteredByEstado = fetchedGastos.filter(
					(gasto) => gasto.estado !== 'Cancelado'
				);
				const filteredGastos =
					user.user === 'ofvinals@gmail.com' || user.user === 'admin@estudio.com'
						? filteredByEstado
						: filteredByEstado.filter(
								(gasto) => gasto.cliente === user.user
						  );

				setTimeout(() => {
					Swal.close();
					setData(filteredGastos);
					setGasto(filteredByEstado);
				}, 1000);
			} catch (error) {
				console.error('Error al obtener gastos', error);
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
					onClick={() => verGasto(row.original.id)}>
					<VisibilityIcon />
				</IconButton>
				{user.user === 'ofvinals@gmail.com' || user.user === 'admin@estudio.com' && (
					<IconButton
						color='success'
						onClick={() => {
							navigate(`/editargastos/${row.original.id}`);
						}}>
						<EditIcon />
					</IconButton>
				)}
				{user.user === 'ofvinals@gmail.com' && (
					<IconButton
						color='error'
						onClick={() => borrarGasto(row.original.id)}>
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

	// funcion para eliminar gastos
	const deleteGasto = (id) => deleteDoc(doc(db, 'gastos', id));

	async function borrarGasto(id) {
		try {
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion del gasto',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				Swal.showLoading();
				await deleteGasto(id);
				Swal.fire({
					icon: 'success',
					title: 'Gasto eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
				setTimeout(() => {
					Swal.close();
					setData((prevData) =>
						prevData.filter((gasto) => gasto.id !== id)
					);
				}, 500);
				return () => clearTimeout(timer);
			}
		} catch (error) {
			console.error('Error al eliminar el gasto:', error);
		}
	}

	// funcion para ver movimientos en Modal
	async function verGasto(id) {
		Swal.showLoading();
		const gastosRef = doc(db, 'gastos', id);
		const snapshot = await getDoc(gastosRef);
		const gastoData = snapshot.data();
		setTimeout(() => {
			Swal.close();
			setGasto(gastoData);
			setShowVerGasto(true);
		}, 500);
		return () => clearTimeout(timer);
	}

	return (
		<>
			<div className='container-lg bg-dark'>
				<div className='main bodygestion'>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {displayName}
					</h4>
					<p className='subtitlegestion'>
						Panel de Administracion de Gastos
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{user.user === 'ofvinals@gmail.com' || user.user === 'admin@estudio.com' && (
							<Link
								type='button'
								className='btnpanelgestion'
								to='/cargagastos'>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar gastos
							</Link>
						)}

						<Link type='button' className='btnpanelgestion' to='/pagos'>
							<i className='iconavbar bi bi-cash-coin'></i>
							Medios de pago
						</Link>

						{user.user === 'ofvinals@gmail.com' && (
							<Link to='/gastosarchivados' className='btnpanelgestion'>
								<i className='iconavbar bi bi-archive'></i>
								Gastos Cancelados
							</Link>
						)}
						<Link
							to={
								user.user === 'ofvinals@gmail.com'|| user.user === 'admin@estudio.com'
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
						<p className='titletabla'>Gastos Pendientes de Cobro</p>
					</div>

					<div>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<MaterialReactTable table={table} />
						</ThemeProvider>
					</div>
				</div>
			</div>

			{/* Modal para ver gasto seleccionado */}
			<Modal show={showVerGasto} onHide={() => setShowVerGasto(false)}>
				<Modal.Header closeButton>
					<Modal.Title className='text-white'>
						Ver Gasto seleccionado
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Nro Expte: {gasto.expte}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Concepto: {gasto.concepto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Monto: $ {gasto.monto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>
								Comprobante Adjunto:{' '}
								{gasto.fileUrl ? (
									<a
										href={gasto.fileUrl}
										target='_blank'
										className='text-white'
										rel='noopener noreferrer'>
										Ver Comprobante
									</a>
								) : (
									'Sin comprobante adjunto'
								)}
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
