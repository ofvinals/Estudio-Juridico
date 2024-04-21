/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../css/Gestion.css';
import { Box } from '@mui/material';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { doc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Table } from '../../components/Gestion/Table';
import { Detail } from '../../components/Gestion/Detail';
import { VerGasto } from '../../components/ViewModals/VerGasto';
import { EditarGastos } from '../../components/EditModals/EditarGastos';

export const Gastos = () => {
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
					(gasto) => gasto.estado !== 'Cancelado'
				);
				const filteredGastos =
					user === 'ofvinals@gmail.com' ||
					user === 'estudioposseyasociados@gmail.com'
						? filteredByEstado
						: filteredByEstado.filter((gasto) => gasto.cliente === user);
				setData(filteredGastos);
				Swal.close();
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
			onClick: (row) => borrarGasto(row.original.id),
		},
	];

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
				Swal.close();
				setData((prevData) => prevData.filter((gasto) => gasto.id !== id));
			}
		} catch (error) {
			console.error('Error al eliminar el gasto:', error);
		}
	}

	return (
		<>
			<div className='container-lg bg-dark'>
				<Detail modulo={'Gastos'} />
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{user === 'ofvinals@gmail.com' ||
						user === 'estudioposseyasociados@gmail.com' ? (
							<Link
								type='button'
								className='btnpanelgestion'
								to='/cargagastos'>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar gastos
							</Link>
						) : null}

						<Link type='button' className='btnpanelgestion' to='/pagos'>
							<i className='iconavbar bi bi-cash-coin'></i>
							Medios de pago
						</Link>

						{user === 'ofvinals@gmail.com' && (
							<Link to='/gastosarchivados' className='btnpanelgestion'>
								<i className='iconavbar bi bi-archive'></i>
								Gastos Cancelados
							</Link>
						)}
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
						<p className='titletabla'>Gastos Pendientes de Cobro</p>
					</div>

					<div className='table-responsive'>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<Table
								columns={columns}
								data={data}
								actions={actions}
								borrarGasto={borrarGasto}
							/>
						</ThemeProvider>
					</div>
				</div>
			</div>
			{openViewModal && <VerGasto id={rowId} />}
			{openEditModal && <EditarGastos id={rowId} />}
		</>
	);
};
export default Gastos;
