import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/GestionExpedientes.css';

export const ExptesArchivados = () => {
	const auth = useAuth();
	const { email } = auth.user;
	const navigate = useNavigate();
	const [exptes, setExptes] = useState([]);
	const [tablaExpte, setTablaExpte] = useState();

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
		const tabla = exptes.map((expte) => {
			if (expte.estado === 'Terminado') {
				return (
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
									to={`/movexptes/${expte.id}`}>
									<i className='bi bi-search accico'></i>
								</Link>
							</div>
						</td>
					</tr>
				);
			}
			return null;
		});
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
					<p className='subtitleadusu'>
						Panel de Administracion de Expedientes Archivados
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						<Link to='' className='btngestexpad'>
							<i className='iconavbar bi bi-search'></i>
							Buscar Expediente
						</Link>
						<Link to='/gestionexpedientes' className='btngestexpad'>
							<i className='iconavbar bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>

					<div>
						<p className='titleagexp text-center'>
							Expedientes Archivados
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
