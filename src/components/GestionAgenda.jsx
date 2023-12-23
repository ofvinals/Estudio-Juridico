import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import '../css/GestionAgenda.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const GestionAgenda = () => {
	const auth = useAuth();
	const { email } = auth.user;

	const [show, setShow] = useState(false);
	const [turnos, setTurnos] = useState([]);
	const [tablaTurnos, setTablaTurnos] = useState();
	const [formValues, setFormValues] = useState({
		turnoEditarTurno: '',
		emailEditarTurno: '',
		motivoEditarTurno: '',
		turnoIndex: null,
	});
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// // Cargar turnos desde el localStorage al montar el componente
	useEffect(() => {
		const ListaTurnos =
			JSON.parse(localStorage.getItem('turnosOcupados')) || [];

		// Ordenar por la propiedad 'turno'
		ListaTurnos.sort((a, b) => a.turno.localeCompare(b.turno));

		setTurnos(ListaTurnos);
	}, []);

	useEffect(() => {
		cargarTablaTurnos();
	}, [turnos]);

	function cargarTablaTurnos() {
		const tabla = turnos.map((turnos) => (
			<tr key={turnos.id}>
				{/* <td className='align-middle'>{usuario.id}</td> */}
				<td className='align-middle '>{turnos.turno}</td>
				<td className='align-middle '>{turnos.email}</td>
				<td className='align-middle '>{turnos.motivo}</td>
				<td>
					<div className='d-flex flex-row justify-content-around'>
						<Link className='btnaccag' to={`/editarturnos/${turnos.id}`}>
							<i className='bi bi-pen  accicoag'></i>
						</Link>
						<button
							className='btnborrarag '
							onClick={() => borrarTurno(turnos.id)}>
							<i className='bi bi-trash-fill  accicoag'></i>
						</button>
					</div>
				</td>
			</tr>
		));

		setTablaTurnos(tabla);
	}

	// funcion para eliminar usuarios
	function borrarTurno(id) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Confirmas la eliminacion del turno',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#8f8e8b',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				// Filtrar
				const eliminaTurno = turnos.filter(function (turno) {
					return turno.id !== id;
				});
				localStorage.setItem(
					'turnosOcupados',
					JSON.stringify(eliminaTurno)
				);
				setTurnos(eliminaTurno);
				cargarTablaTurnos();
				Swal.fire(
					'Eliminado',
					'El turno fue eliminado con exito',
					'success'
				);
			}
		});
	}

	return (
		<>
			<div className='bodygestionag container-fluid bg-dark'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
					<p className='subtitleadusu'>
						Panel de Administracion de Turnos
					</p>
				</div>
			</div>

			<div className='bg-dark'>
				<div className='d-flex justify-content-around'>
					<Link to='/Admin' className='btnag'>
						<i className='me-2 fs-6 bi bi-file-earmark-plus'></i>
						Volver al Panel
					</Link>
				</div>
				<div>
					<p className='mt-3 subtitleadusu text-center'>
						Turnos registrados
					</p>
				</div>
				<div className='container table-responsive'>
					<Table
						striped
						hover
						variant='dark'
						className='tablaagenda table border border-secondary-subtle'>
						<thead>
							<tr>
								<th>Turno</th>
								<th>Usuario</th>
								<th>Motivo</th>
								<th className='accag'>Acciones</th>
							</tr>
						</thead>
						<tbody id='tablaTurnos' className='table-group-divider'>
							{tablaTurnos}
						</tbody>
					</Table>
				</div>
			</div>
		</>
	);
};
