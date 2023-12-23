import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import '../css/GestionExpteUsu.css';

export const GestionExpteUsu = () => {
	const auth = useAuth();
	const { email } = auth.user;

	const navigate = useNavigate();
	const [show, setShow] = useState(false);
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

	// Funcion para cargar tabla de Exptes traida de Local Storage
	function cargarTablaExpte() {
		const ExptesFiltrados = exptes.filter((expte) => email === expte.cliente);
		console.log(email, ExptesFiltrados);

		if (ExptesFiltrados.length > 0) {
			const tabla = ExptesFiltrados.map((expte) => (
				<tr key={expte.id}>
					<td className='align-middle'>{expte.nroexpte}</td>
					<td className='align-middle '>{expte.radicacion}</td>
					<td className='align-middle '>{expte.juzgado}</td>
					<td className='align-middle '>{expte.caratula}</td>
					<td>
						<div className='d-flex flex-row justify-content-around'>
							<Link className='btnverexp' to={`/exptes/${expte.id}`}>
								<i className='bi bi-search accico'></i>
							</Link>
						</div>
					</td>
				</tr>
			));
			setTablaExpte(tabla);
		} else {
			setTablaExpte(
				<div>
					<p>Usted no tiene expedientes en tramite actualmente</p>
				</div>
			);
		}
	}

	return (
		<>
			<div className='container-fluid bg-dark'>
				<div className='main px-3 bodyexpusu '>
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
					<p className='subtitleadusu'>Panel de Consulta de Expedientes</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						<Link to='' className='btnaccexpteusu align-self-center '>
							<i className='me-2 fs-6 bi bi-search'></i>
							Buscar Expediente
						</Link>
						<Link
							to='/adminusu'
							className='btnaccexpteusu align-self-center '>
							<i className='me-2 fs-6 bi bi-box-arrow-left'></i>
							Volver al Panel
						</Link>
					</div>

					<div>
						<p className='titleexpusu text-center'>
							Expedientes en tramite
						</p>
					</div>

					<div className='container table-responsive'>
						<Table
							striped
							hover
							variant='dark'
							className='tablaexpusu text-center table border border-secondary-subtle'>
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
