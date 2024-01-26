import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useExptes } from '../context/ExptesContext';
import { db } from '../firebase/config';
import { doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

export const EditarMov = () => {
	const user = useAuth();
	const params = useParams();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const { register, handleSubmit, setValue } = useForm();
	const { getMov, updateMov } = useExptes();

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = (movId) => {
		console.log(movId);
		setShowModal(false);
		navigate(`/gestionmovimientos/${movId}`, { replace: true });
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const exptesRef = collection(db, 'expedientes');
				const fetchedExptes = await getDocs(exptesRef);
				const exptesArray = Object.values(
					fetchedExptes.docs.map((doc) => doc.data())
				);
				setExptes(exptesArray);
			} catch (error) {
				console.error('Error al obtener expedientes:', error);
			}
		};
		fetchData();
	}, []);

	// Función para cargar los datos del expediente al abrir la página
	useEffect(() => {
		async function loadMov() {
			try {
				Swal.showLoading();
				const expteRef = doc(db, 'expedientes', expedienteId);
				const snapshot = await getDoc(expteRef);
				if (snapshot.exists()) {
					const expedienteData = snapshot.data();
					const selectedMovimiento = expedienteData.movimientos.find(
						(mov) => mov.id === movimientoId
					);
				}
				const movData = snapshot.data();
				setValue('nroexpte', movData.nroexpte);
				setValue('fecha', formattedDate);
				setValue('descripcion', movData.descripcion);
				setValue('adjunto', movData.adjunto);
				setTimeout(() => {
					Swal.close();
					handleOpenModal();
				}, 500);
				return () => clearTimeout(timer);
			} catch (error) {
				console.error('Error al cargar el movimiento', error);
			}
		}
		loadMov();
	}, []);

	const onSubmit = handleSubmit(async (data) => {
		try {
			Swal.showLoading();
			await updateMov(params.id, data);
			Swal.fire({
				icon: 'success',
				title: 'Movimiento de caja eliminado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			setTimeout(() => {
				Swal.close();
				handleCloseModal();
			}, 500);
			return () => clearTimeout(timer);
		} catch (error) {
			console.error('Error al eliminar el movimiento:', error);
		}
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Modificar Datos de Movimiento
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form
							className='formedit container fluid bg-dark'
							onSubmit={onSubmit}>
							<Form.Group className='' controlId='inputname'>
								<Form.Label className='labeledit'>Fecha</Form.Label>
								<Form.Control
									className='inputedit'
									type='date'
									{...register('fecha')}
								/>
							</Form.Group>

							<Form.Group className='' controlId='inputdomic'>
								<Form.Label className='labeledit'>
									Descripcion
								</Form.Label>
								<Form.Control
									className='inputedit'
									{...register('descripcion')}
								/>
							</Form.Group>

							<Form.Group className='' controlId='inputcel'>
								<Form.Label className='labeledit'>Adjunto</Form.Label>
								<Form.Control
									className='inputedit'
									type='text'
									{...register('adjunto')}
								/>
							</Form.Group>

							<Form.Group className='botonesedit'>
								<button className='botonedit' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Guardar Cambios
								</button>
								<Link
									to='/gestionmovimientos'
									className='botoncancedit'>
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
