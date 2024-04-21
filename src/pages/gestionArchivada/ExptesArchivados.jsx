import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../../css/Gestion.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Detail } from '../../components/Gestion/Detail';
import { Table } from '../../components/Gestion/Table';

export const ExptesArchivados = () => {
	const navigate = useNavigate();
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const exptesRef = collection(db, 'expedientes');
				const snapshot = await getDocs(exptesRef);
				const fetchedExptes = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				const expedientesTerminados = fetchedExptes.filter(
					(expte) => expte.estado === 'Terminado'
				);
				setData(expedientesTerminados);
			} catch (error) {
				console.error('Error al obtener expedientes', error);
			}
		};
		fetchData();
	}, []);

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

	const actions = [
		{
			text: 'Ver',
			icon: <VisibilityIcon color='primary' />,
			onClick: (row) => {
				navigate(`/gestionmovimientos/${row.original.id}`);
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
			<div className='container-fluid bg-dark'>
				<Detail modulo={'Expedientes Archivados'} />
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

					<div className='table-responsive'>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<Table columns={columns} data={data} actions={actions} />
						</ThemeProvider>
					</div>
				</div>
			</div>
		</>
	);
};
