import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';

import '../css/GestionAgenda.css';

export const GestionAgenda = () => {

	const [usuarios, setUsuarios] = useState([]);
	const [divTurnoVisible, setDivTurnoVisible] = useState(false);
	const [turnosOcupados, setTurnosOcupados] = useState([]);
	const [turnos, setTurnos] = useState([]);
	const [fechaTurno, setFechaTurno] = useState('');
	const [horaTurno, setHoraTurno] = useState('');
	const [turnoSeleccionado, setTurnoSeleccionado] = useState('');
	const [motivo, setMotivo] = useState('');
	
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

	class Turno {
		constructor(id, nombre, apellido, fecha, hora, motivo) {
			this.id = id;
			this.nombre = nombre;
			this.apellido= apellido;
			this.fecha = fecha;
			this.hora = hora;
			this.motivo = motivo;
		}
	}

	class UsarTurno {
		constructor(id, nombre, apellido, fecha, hora, motivo) {
			this.id = id;
			this.nombre = nombre;
			this.apellido= apellido;
			this.fecha = fecha;
			this.hora = hora;
			this.motivo = motivo;
		}
	}

	useEffect(() => {
		let turnosOcupado = [];
		turnosOcupado =
			JSON.parse(localStorage.getItem('turnosOcupados')) || [];
		let turnos = [];
		turnos = JSON.parse(localStorage.getItem('turnos')) || [];

		cargarUsuarios();
	}, []);

	const cargarUsuarios = () => {
		const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(usuarios);
	};
	/*FECHA ACTUAL */
	const fechaActual = new Date();
	// Obtiene los componentes de la fecha
	const año = fechaActual.getFullYear();
	const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Suma 1 al mes porque los meses comienzan desde 0
	const dia = fechaActual.getDate().toString().padStart(2, '0');
	const fechaFormateada = `${año}-${mes}-${dia}`;

	console.log(fechaFormateada);

	//recorro los medicos para cargar los horarios que tengan
	//falta comparar los horarios ocupados para no incluirlos

	const cargarHorarios = () => {
		const fechaSelec = document.getElementById('fechaTurno').value;
		if (fechaSelec < fechaFormateada) {
			alert('No puede seleccionar una fecha anterior al día de hoy');
			document.getElementById('fechaTurno').value = fechaFormateada;
		}

		const horarioTurnos = document.getElementById('horarioTurnos');
		horarioTurnos.innerHTML = '';

		const turnosDisponibles = ['09', '10', '11'];

		turnosDisponibles.forEach((turno) => {
			const nuevoTurno = document.createElement('button');
			nuevoTurno.textContent = turno;

			nuevoTurno.onclick = function () {
				setTurnoSeleccionado(turno);
				this.classList.add('turnoSeleccionado');

				const otrosTurnos =
					horarioTurnos.querySelectorAll('.turnoHorario-btn');
				otrosTurnos.forEach((otroTurno) => {
					if (otroTurno !== nuevoTurno) {
						otroTurno.classList.remove('turnoSeleccionado');
					}
				});
			};
			nuevoTurno.className = 'turnoHorario-btn';
			horarioTurnos.appendChild(nuevoTurno);
		});
	};

	const confirmarTurno = () => {
		// Lógica para confirmar el turno
		Swal.fire({
			icon: 'success',
			title: 'Listo!',
			text: 'Su Turno fue agendado exitosamente!',
			timer: 1500,
		});

		// aqui deberiamos cargar el localStorage

		const id = Date.now();
		const varFechaTurno = fechaTurno.value;
		const varHorario = turnoSeleccionado.textContent;
		const varMotivo = motivo.value;
		const nombrePaciente =
			document.getElementById('listaPaciente').value || '';
		const newTurno = new Turno(
			id,
			nombrePaciente,
			varFechaTurno,
			varHorario,
			varMotivo
		);
		setTurnos([...turnos, newTurno]);
		localStorage.setItem('turnos', JSON.stringify([...turnos, newTurno]));

		const newUsarTurno = new UsarTurno(varFechaTurno, varHorario);
		setTurnosOcupados([...turnosOcupados, newUsarTurno]);
		localStorage.setItem(
			'turnosOcupados',
			JSON.stringify([...turnosOcupados, newUsarTurno])
		);

		cerrarModal();
	};

	const cargarTurnos = () => {
		let turnoCont = 0;
		const nuevaFilaTarjetas = [];

		turnos.forEach(function (turno02) {
			if (turno02.usuarios === listaPaciente.value) {
				const div = (
					<div
						key={turno02.id}
						className='mb-4 col-md-6 col-lg-4 col-xl-4 col-xxl-3'>
						<div className='card'>
							<div className='card-body'>
								<p className='card-text'>
									Fecha y hora: {turno02.fecha} -{' '}
									{turno02.horario} hs.{' '}
								</p>
								<p className='card-text'>
									Motivo: {turno02.motivo}
								</p>
							</div>
						</div>
					</div>
				);
				nuevaFilaTarjetas.push(div);

				turnoCont++;

				// Si hemos alcanzado 4 tarjetas, crear una nueva fila
				if (turnoCont === 4) {
					nuevaFilaTarjetas.push(
						<div key={`saltoLinea-${turnoCont}`} />
					);
					turnoCont = 0;
				}
			}
		});

		setTurnos(nuevaFilaTarjetas);
	};

	const mostrarModal = () => {
		var modal = document.getElementById('modal');
		modal.style.display = 'block';
	};

	const cerrarModal = () => {
		var modal = document.getElementById('modal');
		setFechaTurno('');
		setTurnoSeleccionado('');
		setMotivo('');
		modal.style.display = 'none';
		cargarTurnos();
	};

	const mostrarModal2 = () => {
		// Obtener el modal por su ID
		var modal = document.getElementById('modal2');

		// Mostrar el modal
		modal.style.display = 'block';
	};

	const cerrarModal2 = () => {
		// Obtener el modal por su ID
		var modal = document.getElementById('modal2');
		document.getElementById('divTurno').hidden = true;
		// Cerrar el modal
		modal.style.display = 'none';

		cargarTurnos();
	};

	const validarDatos = () => {
		if (fechaTurno === '' || turnoSeleccionado === '' || motivo === '') {
			Swal.fire({
				icon: 'warning',
				title: 'Atención',
				text: 'Debes completar todos los campos para agendar tu turno!',
			});
		}
	};

	return (
		<>
			<div className='bodygestionag container-fluid bg-dark'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, Admin</h4>
					<p className=''>Panel de Administracion de Agenda</p>
				</div>
			</div>
			<div className='bg-dark'>
				<div className='d-flex justify-content-around'>
					<Link
						to='/Admin'
						className='btnusu modal m-3 align-self-center p-2'>
						Volver al Panel
					</Link>
				</div>
			</div>

			<div>
				<div>
					<h2>Paciente:</h2>
					<select
						id='listaPaciente'
						onChange={cargarTurnos}
						className='form-control'></select>
				</div>

				<div>
					<button onClick={() => setDivTurnoVisible(true)}>
						Nuevo turno
					</button>
				</div>
			</div>
			<hr />
			<div id='divTurno' hidden={!divTurnoVisible}>
				<div id='datosTurno'>
					<h2 className='w-50'>Disponible</h2>
					<input
						id='fechaTurno'
						type='date'
						onChange={cargarHorarios}
					/>

					<div id='horarioTurnos'></div>

					<div>
						<label>Motivo de la consulta:</label>
						<textarea id='motivo' cols='80' rows='10'></textarea>
					</div>
				</div>

				<p id='turnoSeleccionado'></p>
				<div>
					<button onClick={validarDatos}>Confirmar</button>
					<button onClick={mostrarModal2}>Cancelar</button>
				</div>
			</div>

			<div id='modal' className='modal'>
				<div className='modal-content'>
					<p>¿Quiere confirmar el turno?</p>
					<button onClick={confirmarTurno}>Sí</button>
					<button onClick={cerrarModal}>No</button>
				</div>
			</div>

			<div id='modal2' className='modal2'>
				<div className='modal-content2'>
					<p>
						Estás por borrar los datos ingresados ¿Quiere cancelar
						el turno?
					</p>
					<button onClick={confirmarTurno}>Sí</button>
					<button onClick={cerrarModal2}>No</button>
				</div>
			</div>

			<hr />

			<div id='pruebaM'>Turnos pendientes:</div>

			<div className='container mt-4 ' id='contenedorCard'>
				<div className='row ' id='filaTarjetas'></div>
			</div>
		</>
	);
};
