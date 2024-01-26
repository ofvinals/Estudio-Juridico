import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton, Stack } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/Gestion.css';
import { Modal, Form } from 'react-bootstrap';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

export const CajasArchivadas = () => {
	const user = useAuth();
	const {displayName} = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [caja, setCaja] = useState([]);
	const [showVerCaja, setShowVerCaja] = useState(false);
	const meses = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];

	// Cierra modales
	const handleCancel = () => {
		setShowVerCaja(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				Swal.showLoading();
				const cajasRef = collection(db, 'cajas');
				const snapshot = await getDocs(cajasRef);
				const fetchedCajas = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				// Obtener el mes actual
				const mesActual = new Date().getMonth() + 1;

				// Filtrar los datos para mostrar solamente los meses pasados
				const cajasPasadas = fetchedCajas.filter(
					(caja) => caja.mes < mesActual
				);
				setTimeout(() => {
					Swal.close();
					setData(cajasPasadas);
				}, 1000);
			} catch (error) {
				console.error('Error al obtener caja', error);
			}
		};

		fetchData();
	}, []);

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

	const calcularSumaPorMes = (tipo, mes, data) => {
		const elementosFiltrados = data.filter(
			(item) => item.tipo === tipo && item.mes === mes
		);
		return elementosFiltrados.reduce((acc, item) => acc + item.monto, 0);
	};

	function renderAggregatedCell(cell, table, data) {
		const mesActual = cell.row.original.mes;
		const totalIngresos = calcularSumaPorMes('INGRESO', mesActual, data);
		const totalEgresos = calcularSumaPorMes('EGRESO', mesActual, data);
		const totalMonto = totalIngresos - totalEgresos;

		return (
			<Box
				sx={{
					fontSize: '16px',
					padding: '5px',
					color: 'success.main',
					fontWeight: 'bold',
				}}>
				Total mes {meses[mesActual - 1]}: {formatValue(totalMonto)}
			</Box>
		);
	}

	// Carga info de columnas
	const columns = React.useMemo(() => {
		return [
			{
				header: 'Fecha',
				accessorKey: 'fecha',
				Cell: ({ cell }) => <>{formatValue(cell.getValue())}</>,
				size: 50,
			},
			{
				header: 'Mes',
				accessorKey: 'mes',
				show: false,
				Cell: ({ cell }) => <>{meses[cell.getValue() - 1]}</>,
				size: 50,
			},
			{
				header: 'Concepto',
				accessorKey: 'concepto',
				size: 250,
			},
			{
				header: 'Tipo',
				accessorKey: 'tipo',
				size: 50,
			},
			{
				header: 'Monto',
				accessorKey: 'monto',
				size: 50,
				aggregationFn: 'mean',
				AggregatedCell: ({ cell, table }) => (
					<>{renderAggregatedCell(cell, table, data)}</>
				),
				Cell: ({ cell }) => <>{formatValue(cell.getValue())}</>,
			},
			{
				header: 'Adjunto',
				accessorKey: 'fileUrl',
				size: 30,
				Cell: ({ row }) => {
					if (row.original.fileUrl) {
						return <i className='iconavbar bi bi-paperclip'></i>;
					}
					return null;
				},
			},
			{
				header: 'Estado',
				accessorKey: 'estado',
				size: 50,
			},
		];
	}, [data]);

	const table = useMaterialReactTable({
		columns,
		data,
		enableColumnFilterModes: true,
		enableColumnOrdering: true,
		enableGlobalFilterModes: true,
		enableColumnPinning: true,
		enableRowActions: true,
		enableColumnDragging: false,
		enableGrouping: true,
		initialState: {
			expanded: true,
			grouping: ['mes'],
			sorting: [
				{
					id: 'fecha',
					desc: true,
				},
			],
		},
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
					onClick={() => verCaja(row.original.id)}>
					<VisibilityIcon />
				</IconButton>
			</Box>
		),
	});

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	// funcion para ver movimientos de caja en Modal
	async function verCaja(id) {
		Swal.showLoading();
		const cajaRef = doc(db, 'cajas', id);
		const snapshot = await getDoc(cajaRef);
		const cajaData = snapshot.data();
		setCaja(cajaData);
		setTimeout(() => {
			Swal.close();
			setShowVerCaja(true);
		}, 500);
	}

	return (
		<>
			<div className='container-lg bg-dark'>
				<div className='main px-3 bodygestion'>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {displayName}
					</h4>
					<p className='subtitlegestion'>
						Panel de Gestion de Cajas Archivadas del Estudio
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						<Link to={'/gestioncaja'} className='btnpanelgestion'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>

					<hr className='linea mx-3' />

					<div>
						<p className='titletabla'> Movimientos de Cajas Archivadas</p>
					</div>
					<div>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<Stack gap='1rem'>
								<MaterialReactTable table={table} />
							</Stack>
						</ThemeProvider>
					</div>
				</div>
			</div>

			{/* Modal para ver movimiento de caja seleccionada */}
			<Modal show={showVerCaja} onHide={() => setShowVerCaja(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Ver Movimiento de Caja</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' id='fecha'>
							<Form.Label>Fecha: {caja.fecha}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='concepto'>
							<Form.Label>Concepto: {caja.concepto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='monto'>
							<Form.Label>Monto: $ {caja.monto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='comprobante'>
							<Form.Label>
								Comprobante Adjunto:{' '}
								{caja.fileUrl ? (
									<a
										href={caja.fileUrl}
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
						<Form.Group className='mb-3' id='estado'>
							<Form.Label>Estado: {caja.estado}</Form.Label>
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
