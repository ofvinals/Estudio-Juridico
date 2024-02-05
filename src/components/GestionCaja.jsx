import React, { useState, useEffect }from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton, Stack } from '@mui/material';
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
import {
	collection,
	getDocs,
	deleteDoc,
	doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const GestionCaja = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const user = currentUser.email;
	const displayName = currentUser.displayName;
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

	useEffect(() => {
		const fetchCajas = async () => {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const cajasRef = collection(db, 'cajas');
				const snapshot = await getDocs(cajasRef);
				const fetchedCajas = snapshot.docs.map((doc) => {
					const cajaData = { ...doc.data(), id: doc.id };
					return cajaData;
				});
				const mesActual = new Date().getMonth() + 1;
				const cajasMesActual = fetchedCajas.filter((caja) => {
					const isMesActual = caja.mes === mesActual;
					return isMesActual;
				});
				Swal.close();
				setData(cajasMesActual);
			} catch (error) {
				console.error('Error al obtener caja', error);
			}
		};
		fetchCajas();
	}, []);

	const formatValue = (value) => {
		if (value instanceof Date) {
			return value.toLocaleDateString('es-AR');
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
					desc: false,
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
					onClick={() => {
						navigate(`/vercaja/${row.original.id}`);
					}}>
					<VisibilityIcon />
				</IconButton>
				{user === 'ofvinals@gmail.com' ||
				user === 'estudioposseyasociados@gmail.com' ? (
					<IconButton
						color='success'
						onClick={() => {
							navigate(`/editarcajas/${row.original.id}`);
						}}>
						<EditIcon />
					</IconButton>
				) : null}
				{user === 'ofvinals@gmail.com' && (
					<IconButton
						color='error'
						onClick={() => borrarCaja(row.original.id)}>
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

	// funcion para eliminar movimientos de caja
	const deleteCaja = (id) => deleteDoc(doc(db, 'cajas', id));

	async function borrarCaja(id) {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion del movimiento de la caja?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteCaja(id);
				Swal.close();
				Swal.fire({
					icon: 'success',
					title: 'Movimiento de caja eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
		
				setData((prevData) => prevData.filter((caja) => caja.id !== id));
			}
		} catch (error) {
			console.error('Error al eliminar el movimiento:', error);
		}
	}

	return (
		<>
			<div className='container-lg bg-dark'>
				<div className='main px-3 bodygestion'>
					<h4 className='titlegestion'>Bienvenido, {displayName}</h4>
					<p className='subtitlegestion'>
						Panel de Gestion de Caja del Estudio
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{user === 'ofvinals@gmail.com' ||
						user === 'estudioposseyasociados@gmail.com' ? (
							<Link
								type='button'
								className='btnpanelgestion'
								to='/cargacajas'>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar Movimiento
							</Link>
						) : null}
						{user === 'ofvinals@gmail.com' && (
							<Link to='/cajasarchivadas' className='btnpanelgestion'>
								<i className='iconavbar bi bi-archive'></i>
								Movimientos Archivados
							</Link>
						)}
						<Link to={'/admin'} className='btnpanelgestion'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>

					<hr className='linea mx-3' />

					<div>
						<p className='titletabla'> Movimientos de Caja</p>
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
		</>
	);
};
