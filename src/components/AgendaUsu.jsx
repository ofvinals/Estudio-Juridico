import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { useAuth } from '../context/AuthContext';
import { Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import '../css/AgendaUsu.css';
import {
	doc,
	addDoc,
	getDocs,
	collection,
	deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
dayjs.locale('es');
import emailjs from '@emailjs/browser';

export const AgendaUsu = () => {
	const { currentUser  } = useAuth();
	const form = useRef();
	const [tablaTurnos, setTablaTurnos] = useState();
	const [startDate, setStartDate] = useState(dayjs());
	const [turnoOcupado, setTurnoOcupado] = useState([]);
	const user = currentUser.email
	const displayName = currentUser.displayName
	// deshabilita seleccion de dias de fin de semana
	const lastMonday = dayjs().startOf('week');
	const nextSunday = dayjs().endOf('week').startOf('day');
	const isWeekend = (date) => {
		const day = date.day();

		return day === 0 || day === 6;
	};
	// deshabilita seleccion de horario despues de las 18 hs y antes de las 9 hs
	const shouldDisableTime = (value, view) => {
		const isHourBefore9 = value.hour() < 9;
		const isHourAfter6 = value.hour() >= 19;

		return view === 'hours' && (isHourBefore9 || isHourAfter6);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const turnosRef = collection(db, 'turnos');
				const snapshot = await getDocs(turnosRef);
				const turnossArray = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				setTurnoOcupado(turnossArray);
				cargarTablaTurnos(turnossArray);
			} catch (error) {
				console.error('Error al obtener turnos:', error);
			}
		};
		fetchData();
	}, []);

	// funcion para crear nuevo turno
	const handleCrearCita = async () => {
		// Convierte el turno seleccionado al formato
		const formatoTurnoSeleccionado =
			dayjs(startDate).format('DD/MM/YYYY HH:mm');
		// Comprueba si el turno seleccionado ya está ocupado

		const isTurnoOcupado = turnoOcupado.some(
			(turno) => turno.turno === formatoTurnoSeleccionado
		);
		if (isTurnoOcupado) {
			Swal.fire({
				icon: 'error',
				title: 'Turno no disponible',
				text: 'Lo siento, elige otro turno',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		} else {
			// si no esta ocupado lanza modal para ingresar motivo de consulta y guarda en Localstorage
			const { value: motivoConsulta, isConfirmed } = await Swal.fire({
				input: 'textarea',
				title: 'Ingrese el motivo de su consulta',
				inputPlaceholder: 'Ingrese el motivo aca...',
				inputAttributes: {
					'aria-label': 'Ingrese su mensaje aca',
				},
				showCancelButton: true,
				confirmButtonColor: '#8f8e8b',
			});
			if (isConfirmed) {
				const nuevoTurno = {
					turno: formatoTurnoSeleccionado,
					email: user,
					motivo: motivoConsulta,
				};
				try {
					await emailjs.send(
						'service_iew5q2g',
						'template_fgl8bsq',
						nuevoTurno,
						'saMzvd5sdlHj2BhYr'
					);
					const turnoDocRef = await addDoc(
						collection(db, 'turnos'),
						nuevoTurno
					);
					await Swal.fire({
						icon: 'success',
						title: 'Su turno fue registrado!',
						showConfirmButton: false,
						timer: 2500,
					});
					window.location.reload();
				} catch (error) {
					console.error(
						'Error al enviar el formulario por EmailJS:',
						error
					);
				}
			} else {
				Swal.fire('Su turno no fue agendado', '', 'info');
			}
		}
		return;
	};

	// funcion para cargar turnos
	function cargarTablaTurnos(datosTurnos) {
		if (datosTurnos) {
			const turnosFiltrados = datosTurnos.filter(
				(turno) => user === turno.email
			);
			if (turnosFiltrados.length > 0) {
				const tabla = turnosFiltrados.map((turno) => (
					<tr key={turno.id}>
						<td className='align-middle w-25'>{turno.turno}</td>
						<td className='align-middle '>{turno.email}</td>
						<td className='align-middle '>{turno.motivo}</td>
						<td className='align-middle d-flex flex-row'>
							<button
								className='btnborraagusu'
								onClick={() => borrarTurno(turno.id)}>
								<i className='bi bi-trash-fill acciconoagusu'></i>
							</button>
						</td>
					</tr>
				));
				setTablaTurnos(tabla);
			} else {
				setTablaTurnos(
					<tr key='no-turnos'>
						<td colSpan='4'>
							<p>Usted no tiene turno/s pendiente/s</p>
						</td>
					</tr>
				);
			}
		}
	}

	// funcion para borrar turnos
	const deleteTurno = (id) => deleteDoc(doc(db, 'turnos', id));
	async function borrarTurno(id) {
		try {
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion del turno',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteTurno(id);
				Swal.fire(
					'Eliminado',
					'El turno fue eliminado con exito',
					'success'
				);
				window.location.reload();
			}
			setTurnoOcupado((prevData) =>
				prevData.filter((turno) => turno.id !== id)
			);
		} catch (error) {
			console.error('Error al eliminar el turno:', error);
			Swal.fire({
				icon: 'error',
				title: 'Hubo un error al eliminar su turno!',
				showConfirmButton: false,
				timer: 2500,
			});
		}
	}

	return (
		<>
			<div>
				<div className='main bodyagusu container-lg'>
					<h4 className='titleagusu'>Bienvenido, {displayName}</h4>
					<p className='subtitleagusu'>Panel de Turnos Online</p>
				</div>
				<div className='d-flex justify-content-center'>
					<Link to='/AdminUsu' className='btnpanelagusu'>
						<i className='iconavbar bi bi-box-arrow-left'></i>
						Volver al Panel
					</Link>
				</div>
				<hr className='linea mx-3' />

				<div className='formagusu'>
					<div>
						<h1 className='titleagusu'>Turnos Online</h1>
						<p className='horario'>
							(Horario de atencion al publico: Lunes a Jueves de 09 a 19hs.)
						</p>
						<p className='subtitleagusu'>
							Seleccioná el dia y hora de tu preferencia:
						</p>

						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							adapterLocale='es-mx'>
							<DemoContainer components={['NobileDateTimePicker']}>
								<DemoItem label=''>
									<MobileDateTimePicker
										defaultValue={dayjs()}
										formatDensity='spacious'
										disablePast={true}
										ampm={false}
										shouldDisableTime={shouldDisableTime}
										inputFormat='DD/MM/YYYY HH:mm'
										shouldDisableDate={isWeekend}
										selected={startDate}
										onChange={(date) => setStartDate(date)}
										minutesStep={30}
										views={[
											'year',
											'month',
											'day',
											'hours',
											'minutes',
										]}
										slotProps={{
											textField: ({ position }) => ({
												color: 'success',
												focused: true,
												size: 'medium',
											}),
										}}
										disableHighlightToday={false}
									/>
								</DemoItem>
							</DemoContainer>
						</LocalizationProvider>
						<div className='btnesagusu'>
							<button
								className='btnagusuverif'
								ref={form}
								onClick={handleCrearCita}>
								<i className='iconavbar bi bi-calendar-check'></i>
								Verificar turno
							</button>
						</div>
						<hr className='linea mx-3' />

						<h2 className='titleagusu'>Turnos Registrados</h2>
						<div className='table-responsive'>
							<Table
								striped
								hover
								variant='dark'
								className='tablaagusu table border border-secondary-subtle'>
								<thead>
									<tr>
										<th>Turno</th>
										<th>Usuario</th>
										<th className='w-100'>Motivo de consulta</th>
										<th className='accag'>Acciones</th>
									</tr>
								</thead>
								<tbody id='tablaTurnos' className='table-group-divider'>
									{tablaTurnos}
								</tbody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
