/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Swal from 'sweetalert2';
import '../../css/Gestion.css';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config.js';
import { Detail } from '../../components/Gestion/Detail.jsx';
import { Table } from '../../components/Gestion/Table';
import { VerCaja } from '../../components/ViewModals/VerCaja';
import { EditarCajas } from '../../components/EditModals/EditarCajas';

export const Caja = () => {
	const { currentUser } = useAuth();
	const [data, setData] = useState([]);
	const [openViewModal, setopenViewModal] = useState(false);
	const [openEditModal, setopenEditModal] = useState(false);
	const [rowId, setRowId] = useState(null);
	const user = currentUser.email;
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
	const handleOpenViewModal = (turnoId) => {
		setopenViewModal(true);
		setRowId(turnoId);
	};

	const handleOpenEditModal = (turnoId) => {
		setopenEditModal(true);
		setRowId(turnoId);
	};

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

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
			onClick: (row) => borrarCaja(row.original.id),
		},
	];

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
				<Detail modulo={'Agenda'} />
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
					<div className='table-responsive'>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<Table
								columns={columns}
								data={data}
								actions={actions}
								borrarCaja={borrarCaja}
								handleOpenViewModal={handleOpenViewModal}
							/>
						</ThemeProvider>
					</div>
				</div>
			</div>
			{openViewModal && <VerCaja id={rowId} />}
			{openEditModal && <EditarCajas id={rowId} />}
		</>
	);
};
export default Caja;
