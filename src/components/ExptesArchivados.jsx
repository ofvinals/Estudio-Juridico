import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import '../css/Gestion.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const ExptesArchivados = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const displayName = currentUser.displayName

	useEffect(() => {
		const fetchData = async () => {
			try {
				const exptesRef = collection(db, 'expedientes');
				const snapshot = await getDocs(exptesRef);
				const fetchedExptes = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				setData(fetchedExptes);
			} catch (error) {
				console.error('Error al obtener expedientes', error);
			}
		};
		fetchData();
	}, []);

	// Funcion para filtrar y cargar datos en la tabla
	const expedientesTerminados = data.filter(
		(expte) => expte.estado === 'Terminado'
	);

	const columns = React.useMemo(
		() => [
			{
				header: 'Nro Expte',
				accessorKey: 'nroexpte',
			},
			{
				header: 'Caratula',
				accessorKey: 'caratula',
			},
			{
				header: 'Fuero',
				accessorKey: 'radicacion',
			},
			{
				header: 'Juzgado',
				accessorKey: 'juzgado',
			},
		],
		[]
	);

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	return (
		<>
			<div className='container-fluid bg-dark'>
				<div className='main px-3 bodygestion'>
					<h4 className='titlegestion'>
						Bienvenido de nuevo, {displayName}
					</h4>
					<p className='subtitlegestion'>
						Panel de Administracion de Expedientes Archivados
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						<Link to='/gestionexpedientes' className='btnpanelgestion'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>
					<hr className='linea mx-3' />

					<div>
						<p className='titletabla text-center'>
							Expedientes Archivados
						</p>
					</div>

					<ThemeProvider theme={darkTheme}>
						<CssBaseline />
						<MaterialReactTable
							localization={MRT_Localization_ES}
							columns={columns}
							data={expedientesTerminados}
							enableColumnOrdering
							enableEditing
							enableColumnPinning
							enableRowActions
							enableGlobalFilterModes
							renderRowActions={({ row, table }) => (
								<Box
									sx={{
										display: 'flex',
										flexWrap: 'nowrap',
										gap: '3px',
									}}>
									<IconButton
										color='primary'
										onClick={() => {
											navigate(
												`/gestionmovimientos/${row.original.id}`
											);
										}}>
										<VisibilityIcon />
									</IconButton>
								</Box>
							)}
						/>
					</ThemeProvider>
				</div>
			</div>
		</>
	);
};
