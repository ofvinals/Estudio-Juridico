import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import '../css/Carga.css';
import Swal from 'sweetalert2';
import { Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useExptes } from '../context/ExptesContext';

import { format } from 'date-fns';

export const CargaMov = () => {
	const { user } = useAuth();
	const { id } = useParams();
	const { register, handleSubmit } = useForm();
	const { createMov, getExpte,  } = useExptes([]);
	const [expte, setExpte] = useState([]);
	const [movs, setMovs] = useState([]);
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(true);
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const nroExpte = searchParams.get('nroexpte') || id;

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = (movId) => {
		console.log(movId);
		setShowModal(false);
	};

	useEffect(() => {
		const fetchExpte = async () => {
			try {
				const fetchedExptes = await getExpte(nroExpte);
				setExpte(fetchedExptes);
				console.log(expte);
			} catch (error) {
				console.error('Error al obtener expedientes', error);
			}
		};

		fetchExpte();
	}, []);

	const onSubmit = handleSubmit(async (values) => {
		const id = window.location.pathname.split('/').pop();
		const formattedFecha = format(new Date(values.fecha), 'dd/MM/yyyy', {
			useAdditionalDayOfYearTokens: true,
			useAdditionalWeekYearTokens: true,
		});
		createMov({ ...values, nroexpte: expte.nroexpte, fecha: formattedFecha });
		navigate(`/gestionmovimientos/${id}`);
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Cargar Nuevo Movimiento
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form className='Formcarga ' onSubmit={onSubmit}>
							<Form.Group
								className='formcargagroup'
								controlId='inputname'>
								<Form.Label className='labelcarga'>Fecha</Form.Label>
								<Form.Control
									type='date'
									className='inputcarga'
									aria-label='Default select'
									{...register('fecha')}></Form.Control>
							</Form.Group>

							<Form.Group
								className='formcargagroup'
								controlId='inputname'>
								<Form.Label className='labelcarga'>
									Descripcion
								</Form.Label>
								<Form.Control
									placeholder='Ingrese la descripcion del movimiento..'
									className='inputcarga'
									as='textarea'
									rows={7}
									cols={70}
									{...register('descripcion')}
								/>
							</Form.Group>

							<Form.Group
								className='formcargagroup'
								controlId='inputsubname'>
								<Form.Label className='labelcarga'>Adjunto</Form.Label>
								<Form.Control
									type='text'
									className='inputcarga'
									aria-label='Default select'
									{...register('adjunto')}></Form.Control>
							</Form.Group>

							<Form.Group className='botonescarga'>
								<Button className='botoneditcarga' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Agregar Movimiento
								</Button>
								<Link to='/gestionmovimientos' className='btncanccarga'>
									<i className='iconavbar bi bi-x-circle-fill'></i>
									Cancelar
								</Link>
							</Form.Group>
						</Form>
					</Modal.Body>
				</Modal>
			</div>
		</>
	);
};
