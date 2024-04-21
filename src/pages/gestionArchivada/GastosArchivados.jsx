/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../../css/Gestion.css';
import { Box } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Detail } from '../../components/Gestion/Detail';
import { Table } from '../../components/Gestion/Table';
import { VerGasto } from '../../components/ViewModals/VerGasto';

export const GastosArchivados = () => {
	const { currentUser } = useAuth();
	const [data, setData] = useState([]);
	const user = currentUser.email;
	const [openViewModal, setopenViewModal] = useState(false);
	const [rowId, setRowId] = useState(null);

	const handleOpenViewModal = (gastoId) => {
		setopenViewModal(true);
		setRowId(gastoId);
	};

	useEffect(() => {
		const fetchGastos = async () => {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const gastosRef = collection(db, 'gastos');
				const snapshot = await getDocs(gastosRef);
				const fetchedGastos = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				const filteredByEstado = fetchedGastos.filter(
					(gasto) => gasto.estado === 'Cancelado'
				);
				const filteredGastos =
					user === 'ofvinals@gmail.com'
						? filteredByEstado
						: filteredByEstado.filter((gasto) => gasto.cliente === user);
				Swal.close();
				setData(filteredGastos);
			} catch (error) {
				console.error('Error al obtener gastos', error);
			}
		};
		fetchGastos();
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
				<Detail modulo={'Gastos Archivados'} />
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						<Link to={'/gestiongastos'} className='btnpanelgestion'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>
					<hr className='linea mx-3' />

					<div>
						<p className='titletabla'>Gastos Archivados</p>
					</div>

					<div className='table-responsive'>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<Table columns={columns} data={data} actions={actions} />
						</ThemeProvider>
					</div>
				</div>
			</div>
			{openViewModal && <VerGasto id={rowId} />}
		</>
	);
};
