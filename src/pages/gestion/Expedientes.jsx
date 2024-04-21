/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
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
import { db } from '../../firebase/config';
import { Table } from '../../components/Gestion/Table';
import { Detail } from '../../components/Gestion/Detail';

export const Expedientes = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const user = currentUser.email;

	useEffect(() => {
		const fetchExptes = async () => {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const exptesRef = collection(db, 'expedientes');
				const snapshot = await getDocs(exptesRef);
				const fetchedExptes = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				const filteredExptes =
					user === 'ofvinals@gmail.com' ||
					user === 'estudioposseyasociados@gmail.com'
						? fetchedExptes
						: fetchedExptes.filter((expte) => expte.cliente === user);
				Swal.close();
				setData(filteredExptes);
			} catch (error) {
				console.error('Error al obtener expedientes', error);
			}
		};

		fetchExptes();
	}, []);

	const columns = useMemo(
		() => [
			{
				header: 'Expte',
				accessorKey: 'nroexpte',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'Caratula',
				accessorKey: 'caratula',
				enableColumnOrdering: false,
				size: 300,
			},
			{
				header: 'Fuero',
				accessorKey: 'radicacion',
				enableColumnOrdering: false,
				size: 50,
			},
			{
				header: 'Juzgado',
				accessorKey: 'juzgado',
				enableColumnOrdering: false,
				size: 50,
			},
		],
		[]
	);

	const actions = [
		{
			text: 'Ver',
			icon: <VisibilityIcon color='primary' />,
			onClick: () => {
				navigate(`/gestionmovimientos/${row.original.id}`);
			},
		},
		{
			text: 'Editar',
			icon: (user === 'ofvinals@gmail.com' ||
				user === 'estudioposseyasociados@gmail.com') && (
				<EditIcon color='success' />
			),
			onClick: () => {
				navigate(`/editarexptes/${row.original.id}`);
			},
		},
		{
			text: 'Eliminar',
			icon: user === 'ofvinals@gmail.com' && <DeleteIcon color='error' />,
			onClick: () => borrarExpte(row.original.id),
		},
	];

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	// funcion para eliminar expedientes
	const deleteExpte = (id) => deleteDoc(doc(db, 'expedientes', id));
	async function borrarExpte(id) {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminación del expediente?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteExpte(id);
				Swal.fire({
					icon: 'success',
					title: 'Expediente eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
				Swal.close();
				setData((prevData) => prevData.filter((expte) => expte.id !== id));
			}
		} catch (error) {
			console.error('Error al eliminar el expediente:', error);
		}
	}

	return (
		<>
			<div className='container-lg bg-dark'>
			<Detail modulo={"Expedientes"}/>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{user === 'ofvinals@gmail.com' ||
						user === 'estudioposseyasociados@gmail.com' ? (
							<Link
								type='button'
								className='btnpanelgestion'
								to='/CargaExptes'
								data-bs-toggle='modal'
								data-bs-target='#Modal'>
								<i className='iconavbar bi bi-file-earmark-plus'></i>
								Agregar expediente
							</Link>
						) : null}
						{user === 'ofvinals@gmail.com' && (
							<Link to='/exptesarchivados' className='btnpanelgestion'>
								<i className='iconavbar bi bi-archive'></i>
								Expedientes Archivados
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
						<p className='titletabla'>Expedientes en Tramite</p>
					</div>
					<div className='table-responsive'>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<Table
								columns={columns}
								data={data}
								actions={actions}
								borrarExpte={borrarExpte}
							/>
						</ThemeProvider>
					</div>
				</div>
			</div>
		</>
	);
};
export default Expedientes;
