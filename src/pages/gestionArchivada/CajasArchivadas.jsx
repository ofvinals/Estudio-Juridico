/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Swal from 'sweetalert2';
import '../../css/Gestion.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config.js';
import { Detail } from '../../components/Gestion/Detail.jsx';
import { Table } from '../../components/Gestion/Table.jsx';
import { VerCaja } from '../../components/ViewModals/VerCaja.jsx';

export const CajasArchivadas = () => {
	const [data, setData] = useState([]);
	const [openViewModal, setopenViewModal] = useState(false);
	const [rowId, setRowId] = useState(null);
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
	const handleOpenViewModal = (cajaId) => {
		setopenViewModal(true);
		setRowId(cajaId);
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
					return { ...doc.data(), id: doc.id };
				});
				// Obtener el mes actual
				const mesActual = new Date().getMonth() + 1;
				// Filtrar los datos para mostrar solamente los meses pasados
				const cajasPasadas = fetchedCajas.filter(
					(caja) => caja.mes < mesActual
				);
				Swal.close();
				setData(cajasPasadas);
			} catch (error) {
				console.error('Error al obtener caja', error);
			}
		};
		fetchCajas();
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

	const actions = [
		{
			text: 'Ver',
			icon: <VisibilityIcon color='primary' />,
			onClick: (row) => {
				handleOpenViewModal(row.original.id);
			},
		},
	];

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	return (
		<>
			<div className='container-lg bg-dark'>
				<Detail modulo={'Agenda'} />
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
					<div className='table-responsive'>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<Table
								columns={columns}
								data={data}
								actions={actions}
								handleOpenViewModal={handleOpenViewModal}
							/>
						</ThemeProvider>
					</div>
					{openViewModal && <VerCaja id={rowId} />}
				</div>
			</div>
		</>
	);
};
