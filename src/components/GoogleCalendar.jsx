import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';
dayjs.locale('es');
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
	const { loginWithGoogle, accessToken } = useAuth();
	const [loggedIn, setLoggedIn] = useState(false);

	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestionagenda');
	};

	const handleGoogle = async (e) => {
		try {
			e.preventDefault();
			await loginWithGoogle();
			navigate ('/googlecalendar')
			setShowModal(true);
		} catch (error) {
			console.error('Error al iniciar sesión con Google:', error);
		}
	};

	const createEvent = async function createCalendarEvent() {
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
			await fetch(
				'https://www.googleapis.com/calendar/v3/calendars/365fa9c4ffc2a2c85cd2d4c3e28942427e52a6a2a6d92386566dbe9ada6d50fe@group.calendar.google.com/events',
				{
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + accessToken,
					},
					body: JSON.stringify(event),
				}
			)
				.then((data) => data.json())
				.then((data) => {
					console.log('Evento creado, revisa tu Google Calendar');
				});
		} catch (error) {
			console.error('Error al crear evento de calendario:', error);
		}
	};

	const handleCrearVenc = async () => {
		const formatoTurnoSeleccionado = dayjs(start).format('DD/MM/YYYY HH:mm');
		const nuevoTurno = {
			turno: formatoTurnoSeleccionado,
			email: eventName,
			motivo: eventDescription,
		};
		try {
			await addDoc(collection(db, 'turnos'), nuevoTurno);
			await Swal.fire({
				icon: 'success',
				title: 'El evento fue registrado!',
				showConfirmButton: false,
				timer: 2500,
			});
			handleCloseModal();
		} catch (error) {
			console.log(error);
			Swal.fire('El evento no fue agendado', '', 'info');
		}
	};

	return (
		<Modal show={showModal} onHide={handleCloseModal}>
			<Modal.Header closeButton>
				<Modal.Title className='titlemodal'>
					Cargar Vencimientos / Audiencias
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='d-flex flex-column justify-content-center align-items-center'>
					{accessToken ? (
						<>
							<p className='labelcarga'>Fecha del Evento</p>
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
											onChange={(startDate) => {
												setStart(startDate);
												const newEndDate = dayjs(startDate).add(
													1,
													'hour'
												);
												setEnd((prevEnd) => {
													return newEndDate.toDate();
												});
											}}
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
											console.error('Error al crear evento:', error);
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
						<p className='text-center'>Para cargar eventos en el calendario del Estudio debes estar logueado con una cuenta de Google</p>
							<button
								className='botongoogle'
								onClick={(e) => handleGoogle(e)}>
								<i className='iconavbar bi bi-google'></i>
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
};
