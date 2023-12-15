import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { deDE } from '@mui/x-date-pickers/locales';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

import 'dayjs/locale';
import '../css/AdminAgenda.css';

export const AgendaUsu = () => {
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
	// agarro el turno seleccionado por el cliente
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
		// Convierte el turno seleccionado al formato de cadena
		const formatoTurnoSeleccionado = startDate.format('DD/MM/YYYY HH:mm');

		// Comprueba si el turno seleccionado ya está ocupado
		const isTurnoOcupado = turnoOcupado.includes(formatoTurnoSeleccionado);

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
			const { value: motivoConsulta } = await Swal.fire({
				input: 'textarea',
				inputPlaceholder: 'Ingrese el motivo de su consulta aca...',
				inputAttributes: {
					'aria-label': 'Ingrese su mensaje aca',
				},
				showCancelButton: true,
				confirmButtonColor: '#8f8e8b',
			});
			// Guarda el nuevo turno ocupado en el Local Storage
			const nuevosTurnosOcupados = [
				...turnoOcupado,
				{ turno: formatoTurnoSeleccionado, motivo: motivoConsulta },
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
		}
		return;
	};

	return (
		<>
			<div className='container-fluid'>
				<div className='main px-3 bodycontact'>
					<h4 className='titlead'>Bienvenido de nuevo, ?????</h4>
					<p className='mb-0'>Panel de Turnos </p>
				</div>
				<div className='bodyagusu'>
					<div>
						<h1 className='titleagusu'>Selecciona tu turno: </h1>
						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							adapterLocale='en-gb'
							localeText={
								deDE.components.MuiLocalizationProvider
									.defaultProps.localeText
							}>
							<DemoContainer
								components={['NobileDateTimePicker']}>
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
								className='btnagusu'
								onClick={handleCrearCita}>
								Verificar turno
							</button>
							<Link to='/AdminUsu' className='btnagusu'>
								Volver al Panel
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
