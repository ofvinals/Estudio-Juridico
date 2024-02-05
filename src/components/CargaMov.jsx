import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import '../css/Carga.css';
import { Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { uploadFile } from '../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { format } from 'date-fns';

export const CargaMov = () => {
	const { register, handleSubmit } = useForm();
	const [expte, setExpte] = useState([]);
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(true);

	// Función para cerrar el modal
	const handleCloseModal = (movId) => {
		setShowModal(false);
	};

	useEffect(() => {
		const fetchExpte = async () => {
			try {
				const exptesRef = collection(db, 'expedientes');
				const fetchedExptes = await getDocs(exptesRef);
				setExpte(fetchedExptes);
			} catch (error) {
				console.error('Error al obtener expedientes', error);
			}
		};
		fetchExpte();
	}, []);

	const onSubmit = handleSubmit(async (values) => {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const id = window.location.pathname.split('/').pop();
			let fileDownloadUrl = null;
			const formattedFecha = format(new Date(values.fecha), 'dd/MM/yyyy', {
				useAdditionalDayOfYearTokens: true,
				useAdditionalWeekYearTokens: true,
			});
			if (values.file && values.file[0]) {
				const file = values.file[0];
				fileDownloadUrl = await uploadFile(file);
			}
			const movData = {
				id: new Date().getTime(),
				fecha: formattedFecha,
				descripcion: values.descripcion,
				fileUrl: fileDownloadUrl,
			};
			await addDoc(collection(db, 'expedientes'), movData);
			Swal.fire({
				icon: 'success',
				title: 'Movimiento registrado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			Swal.close();
			handleCloseModal();
			navigate(`/gestionmovimientos/${id}`);
		} catch (error) {
			console.error(error);
		}
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title>Cargar Nuevo Movimiento</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form
							className='Formcarga '
							onSubmit={onSubmit}
							action='/uploads'
							method='post'
							encType='multipart/form-data'>
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
									type='file'
									className='inputcarga'
									aria-label='Default select'
									{...register('file')}></Form.Control>
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
