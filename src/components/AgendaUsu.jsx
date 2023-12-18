import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { esES } from '@mui/x-date-pickers/locales';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale';
import '../css/AgendaUsu.css';

export const AgendaUsu = () => {
	const auth = useAuth();
	const { email } = auth.user;
	console.log(email);

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

	// agarro el turno seleccionado por el cliente y traigo turnos ocupados del Local Storage
	const [startDate, setStartDate] = useState(dayjs());
	const [turnoOcupado, setturnoOcupado] = useState([]);
	console.log(startDate);
	useEffect(() => {
		const turnosOcupados =
			JSON.parse(localStorage.getItem('turnosOcupados')) || [];
		setturnoOcupado(turnosOcupados);
	}, []);

	// funcion para crear nuevo turno
	const handleCrearCita = async () => {
		console.log(startDate);

		// Convierte el turno seleccionado al formato de cadena
		const formatoTurnoSeleccionado = startDate.format('DD/MM/YYYY HH:mm');
		console.log(formatoTurnoSeleccionado);

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
			const {
				value: motivoConsulta,
				isConfirmed,
				isDenied,
			} = await Swal.fire({
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
				const id = Date.now();
				const nuevosTurnosOcupados = [
					...turnoOcupado,
					{
						id: id,
						email: email,
						turno: formatoTurnoSeleccionado,
						motivo: motivoConsulta,
					},
				];
				setturnoOcupado(nuevosTurnosOcupados);
				localStorage.setItem(
					'turnosOcupados',
					JSON.stringify(nuevosTurnosOcupados)
				);
				Swal.fire({
					icon: 'success',
					title: 'Su turno fue registrado!',
					showConfirmButton: false,
					timer: 2500,
				});
			} else {
				Swal.fire('Su turno no fue agendado', '', 'info');
			}
		}
		return;
	};

	return (
		<>
			<div className='container-fluid'>
				<div className='main px-3 bodycontact'>
					<h4 className='titlead'>Bienvenido, {email}</h4>
					<p className='mb-0'>Panel de Turnos </p>
				</div>

				<div className='bodyagusu'>
					<div>
						<h1 className='titleagusu'>Turnos Online</h1>
						<p className='subtitleagusu'>
							Selecciona el dia y hora de tu preferencia:{' '}
						</p>
						
						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							adapterLocale='esES'
							localeText={
								esES.components.MuiLocalizationProvider.defaultProps
									.localeText
							}>
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
							<button className='btnagusuverif' disabled={!!startDate} onClick={handleCrearCita}>
								Verificar turno
							</button>
							<Link to='/AdminUsu' className='btnagusuvolver'>
								Volver al Panel
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
