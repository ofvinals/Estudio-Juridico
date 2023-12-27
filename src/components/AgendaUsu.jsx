import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { esES } from '@mui/x-date-pickers/locales';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { useAuth } from '../context/AuthContext';
import { Table } from 'react-bootstrap';

import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale';
import '../css/AgendaUsu.css';

export const AgendaUsu = () => {
	const auth = useAuth();
	const { email } = auth.user;
	const [tablaTurnos, setTablaTurnos] = useState();

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

	useEffect(() => {
		const turnosOcupados =
			JSON.parse(localStorage.getItem('turnosOcupados')) || [];
			turnosOcupados.sort((a, b) => a.turno.localeCompare(b.turno));

		setturnoOcupado(turnosOcupados);
	}, []);

	// funcion para crear nuevo turno
	const handleCrearCita = async () => {
		// Convierte el turno seleccionado al formato
		const formatoTurnoSeleccionado = dayjs(startDate).format('DD-MM-YYYY HH:mm')
		console.log(formatoTurnoSeleccionado)
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

	useEffect(() => {
		cargarTablaTurnos();
	}, [turnoOcupado]);

	// funcion para cargar turnos
	function cargarTablaTurnos() {
		const turnosFiltrados = turnoOcupado.filter(
			(turno) => email === turno.email
		);
		if (turnosFiltrados.length > 0) {
			const tabla = turnosFiltrados.map((turnos) => (
				<tr key={turnos.id}>
					<td className='align-middle w-25'>{turnos.turno}</td>
					<td className='align-middle '>{turnos.email}</td>
					<td className='align-middle '>{turnos.motivo}</td>
					<td className='align-middle d-flex flex-row'>
						<Link className='btneditagusu' to={`/editarturnos/${turnos.id}`}>
							<i className='bi bi-pen acciconoagusu'></i>
						</Link>
						<button
							className='btnborraagusu'
							onClick={() => borrarTurno(turnos.id)}>
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
						<p>Usted no tiene turnos pendientes</p>
					</td>
				</tr>
			);
		}
	}

	// funcion para borrar turnos
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
				const eliminaTurno = turnoOcupado.filter(function (turno) {
					return turno.id !== id;
				});
				localStorage.setItem(
					'turnosOcupados',
					JSON.stringify(eliminaTurno)
				);
				setturnoOcupado(eliminaTurno);
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
			<div className='container-fluid'>
				<div className='main px-3 bodyagusu'>
					<h4 className='titleagusu'>Bienvenido, {email}</h4>
					<p className='subtitleagusu'>Panel de Turnos </p>
				</div>
				<div className='d-flex justify-content-center'>
					<Link to='/AdminUsu' className='btnpanelagusu'>
						<i className='iconavbar bi bi-box-arrow-left'></i>
						Volver al Panel
					</Link>
				</div>
				<div className='formagusu'>
					<div>
						<h1 className='titleagusu'>Turnos Online</h1>
						<p className='subtitleagusu'>
							Seleccioná el dia y hora de tu preferencia:{' '}
						</p>

						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							adapterLocale='en-gb'
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
							<button
								className='btnagusuverif'
								onClick={handleCrearCita}>
								<i className='iconavbar bi bi-calendar-check'></i>
								Verificar turno
							</button>
						</div>
						<h2 className='titleagusu'>Turnos pendientes</h2>
						<div className='container table-responsive'>
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
