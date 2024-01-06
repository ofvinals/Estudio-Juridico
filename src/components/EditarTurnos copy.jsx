import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTurnos } from '../context/TurnosContext';

export const EditarTurnos = ({}) => {
	const { user } = useAuth();
	const params = useParams();
	const navigate = useNavigate();
	const { getTurno, updateTurno, getTurnos } = useTurnos();
	const { register, handleSubmit, setValue } = useForm();
	const [turno, setTurno] = useState({});
	const [turnos, setTurnos] = useState([]);
	const redirectURL = user.email === 'admin@gmail.com' ? '/gestionagenda' : '/agendausu';

	// funcion para editar datos del turno
	useEffect(() => {
		async function loadTurno() {
			try {
				if (params.id) {
					const turnoData = await getTurno(params.id);
					setTurno(turnoData)
					setValue('turno', turnoData.turno);
					setValue('email', turnoData.email);
					setValue('motivo', turnoData.motivo);
				}
			} catch (error) {
				console.error('Error al cargar el expediente', error);
			}
		}
		loadTurno();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedTurnos = await getTurnos();
				setTurnos(fetchedTurnos);
			} catch (error) {
				console.error('Error al obtener turnos:', error);
			}
		};

		fetchData();
	}, []);

	const onSubmit = handleSubmit(async (data) => {
		await updateTurno(params.id, data);
		if (user.email === 'admin@gmail.com') {
			navigate('/gestionagenda');
		} else {
			navigate('/agendausu');
		}
	});

	return (
		<>
			<div className='bodyedit'>
				<Form className='formedit container-fluid bg-dark' onSubmit={onSubmit}>
					<h2 className='titleedit'>Modificar Turno</h2>

					<Form.Group className='mb-3' controlId='turnoEditarTurno'>
						<Form.Label className='labeledit'>Cliente</Form.Label>
						<Form.Control
							className='inputedit'
							type='text'
							defaultValue={turno.email}
							{...register('email')}
							readOnly
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='turnoEditarTurno'>
						<Form.Label className='labeledit'>Turno</Form.Label>
						<Form.Control
							className='inputedit'
							type='text'
							{...register('turno')}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='motivoEditarTurno'>
						<Form.Label className='labeledit'>Motivo</Form.Label>
						<Form.Control
							className='inputedit'
							as='textarea'
							rows={7}
							cols={70}
							{...register('motivo')}
						/>
					</Form.Group>

					<Form.Group className='botonesedit'>
						<button className='botonedit' type='submit'>
							<i className='iconavbar bi bi-check2-square'></i>
							Guardar cambios
						</button>
						<Link to={redirectURL} className='botoncancedit'>
							<i className='iconavbar bi bi-x-circle-fill'></i>
							Cancelar
						</Link>
					</Form.Group>
				</Form>
			</div>
		</>
	);
};
