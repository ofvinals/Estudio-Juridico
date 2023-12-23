import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/GestionExpedientes.css';

export const GestionExpedientes = () => {
	const auth = useAuth();
	const { email } = auth.user;

	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [exptes, setExptes] = useState([]);
	const [tablaExpte, setTablaExpte] = useState();

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Cargar expedientes desde el localStorage al montar el componente
	useEffect(() => {
		const ListaExpte = JSON.parse(localStorage.getItem('exptes')) || [];
		setExptes(ListaExpte);
	}, []);

	useEffect(() => {
		cargarTablaExpte();
	}, [exptes]);

	// Funcion para cargar tabla de exptes traida de Local Storage
	function cargarTablaExpte() {
		const tabla = exptes.map((expte) => (
			<tr key={expte.id}>
				<td className='align-middle'>{expte.nroexpte}</td>
				<td className='align-middle '>{expte.radicacion}</td>
				<td className='align-middle '>{expte.juzgado}</td>
				<td className='align-middle '>{expte.caratula}</td>
				<td>
					<div className='d-flex flex-row justify-content-around'>
						<Link
							className='btnaccgestexp'
							to={`/editarexptes/${expte.id}`}>
							<i className='bi bi-pen  accico'></i>
						</Link>
						<button
							className='btnborrargestexp'
							onClick={() => borrarExpte(expte.id)}>
							<i className='bi bi-trash-fill  accico'></i>
						</button>
						<Link
							className='btnvergestexp'
							to={`/editarexptes/${expte.id}`}>
							<i className='bi bi-search accico'></i>
						</Link>
					</div>
				</td>
			</tr>
		));
		setTablaExpte(tabla);
	}

	// funcion para eliminar expedientes
	function borrarExpte(id) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Confirmas la eliminacion del expdiente?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#8f8e8b',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				// Filtrar
				const nuevosExptes = exptes.filter(function (expte) {
					return expte.id !== id;
				});
				localStorage.setItem('exptes', JSON.stringify(nuevosExptes));
				setExptes(nuevosExptes);
				cargarTablaExpte();
				Swal.fire(
					'Eliminado',
					'El expediente fue eliminado con exito',
					'success'
				);
			}
		});
	}

	return (
		<>
			<div className='container-fluid bg-dark'>
				<div className='main px-3 bodyadexped '>
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
					<p className='subtitleadusu'>Panel de Administracion de Expedientes</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						<Link
							type='button'
							className='btngestexpad'
							to='/CargaExptes'
							data-bs-toggle='modal'
							data-bs-target='#Modal'>
							<i className='me-2 fs-6 bi bi-file-earmark-plus'></i>
							Agregar expediente
						</Link>
						<Link to='' className='btngestexpad'>
							<i className='me-2 fs-6 bi bi-search'></i>
							Expedientes Archivados
						</Link>
						<Link to='' className='btngestexpad'>
							<i className='me-2 fs-6 bi bi-search'></i>
							Buscar Expediente
						</Link>
						<Link to='/Admin' className='btngestexpad'>
							<i className='me-2 fs-6 bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>

					<div>
						<p className='titleagexp text-center'>
							Expedientes en tramite
						</p>
					</div>

					<div className='container table-responsive'>
						<Table
							striped
							hover
							variant='dark'
							className='tablaexpte text-center table border border-secondary-subtle'>
							<thead>
								<tr>
									<th>Expte</th>
									<th>Fuero</th>
									<th>Juzgado</th>
									<th className='w-50'>Caratula</th>
									<th className='acciones'>Acciones</th>
								</tr>
							</thead>
							<tbody id='tablaTurnos' className='table-group-divider'>
								{tablaExpte}
							</tbody>
						</Table>
					</div>
				</div>
			</div>
		</>
	);
};
