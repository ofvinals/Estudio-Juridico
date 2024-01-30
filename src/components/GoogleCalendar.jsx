import { useState } from 'react';
import * as React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';
dayjs.locale('es');
import '../css/googlecalendar.css';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

export const GoogleCalendar = () => {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(true);
	const [start, setStart] = useState(new Date());
	const [end, setEnd] = useState(new Date());
	const [eventName, setEventName] = useState('');
	const [eventDescription, setEventDescription] = useState('');
	const user = useAuth();
	const accessToken = useAuth();
	const { loginWithGoogle } = useAuth();

	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestionagenda');
	};

	const handleGoogle = (e) => {
		e.preventDefault();
		loginWithGoogle();
	};
	console.log(user.accessToken);

	const createEvent = async function createCalendarEvent() {
		console.log('Creando evento de calendario');
		try {
			const event = {
				summary: eventName,
				description: eventDescription,
				start: {
					dateTime: start.toISOString(),
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				},
				end: {
					dateTime: end.toISOString(),
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				},
			};
			console.log(user.accessToken);
			await fetch(
				'https://www.googleapis.com/calendar/v3/calendars/365fa9c4ffc2a2c85cd2d4c3e28942427e52a6a2a6d92386566dbe9ada6d50fe@group.calendar.google.com/events',
				{
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + user.accessToken, // Access token for google ERROR. FALTA AUTORIZACION SCOPE P CALENDAR
					},
					body: JSON.stringify(event),
				}
			)
				.then((data) => data.json())
				.then((data) => {
					console.log(data);
					console.log('Evento creado, revisa tu Google Calendar');
				});
		} catch (error) {
			console.error('Error al crear evento de calendario:', error);
		}
	};

	console.log(user.accesoToken);
	console.log('Fecha de inicio:', start.toISOString());
	console.log('Fecha de finalización:', end.toISOString());
	console.log(eventName);
	console.log(eventDescription);

	const handleCrearVenc = async () => {
		// Convierte el turno seleccionado al formato
		const formatoTurnoSeleccionado = dayjs(start).format('DD/MM/YYYY HH:mm');

		const nuevoTurno = {
			turno: formatoTurnoSeleccionado,
			email: eventName,
			motivo: eventDescription,
		};
		try {
			const turnoDocRef = await addDoc(collection(db, 'turnos'), nuevoTurno);
			console.log('Documento agregado con ID: ', turnoDocRef.id);
			await Swal.fire({
				icon: 'success',
				title: 'El vencimiento fue registrado!',
				showConfirmButton: false,
				timer: 2500,
			});
			handleCloseModal();
		} catch (error) {
			console.log(error);
			Swal.fire('El vencimiento no fue agendado', '', 'info');
		}
	};

	try {
		return (
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title className='titlemodal'>
						Cargar Vencimientos / Audiencias
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='d-flex flex-column justify-content-center align-items-center'>
						{user ? (
							<>
								<p className='labelcarga'>Fecha de inicio</p>
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
												inputFormat='DD/MM/YYYY HH:mm'
												selected={start}
												onChange={(date) => setStart(date)}
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
								<p className='labelcarga'>Fecha de finalizacion</p>
								<LocalizationProvider
									dateAdapter={AdapterDayjs}
									adapterLocale='es-mx'>
									<DemoContainer components={['NobileDateTimePicker']}>
										<DemoItem label=''>
											<MobileDateTimePicker
												defaultValue=	{dayjs()}
												formatDensity='spacious'
												disablePast={true}
												ampm={false}
												inputFormat='DD/MM/YYYY HH:mm'
												selected={start}
												onChange={(date) => setEnd(date)}
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

								<p className='labelcarga'> Tipo de evento</p>
								<select
									className='inputcarga w-50'
									aria-label='Default select'
									onChange={(e) => setEventName(e.target.value)}>
									<option>Selecciona..</option>
									<option value='AUDIENCIA'>AUDIENCIA</option>
									<option value='VENCIMIENTO'>VENCIMIENTO</option>
								</select>
								<p className='labelcarga'>Descripcion</p>
								<textarea
									rows='5'
									cols='33'
									onChange={(e) => setEventDescription(e.target.value)}
								/>

								<div className='botonescarga'>
									<button
										className='botoneditcarga'
										onClick={async () => {
											try {
												await Promise.all([
													handleCrearVenc(),
													createEvent(),
												]);
											} catch (error) {
												// Manejar errores aquí si es necesario
												console.error(
													'Error al crear evento:',
													error
												);
											}
										}}>
										<i className='iconavbar bi bi-check2-square'></i>
										Crear Evento
									</button>
									<Link to='/gestionagenda' className='btncanccarga'>
										<i className='iconavbar bi bi-x-circle-fill'></i>
										Cancelar
									</Link>
								</div>
							</>
						) : (
							<>
								<button onClick={(e) => handleGoogle(e)}>
									Ingresa con Google
								</button>
								<Link to='/gestionagenda' className='btncanccarga'>
									<i className='iconavbar bi bi-x-circle-fill'></i>
									Cancelar
								</Link>
							</>
						)}
					</div>
				</Modal.Body>
			</Modal>
		);
	} catch (error) {
		console.error('Error durante el renderizado:', error);
		return null;
	}
};
