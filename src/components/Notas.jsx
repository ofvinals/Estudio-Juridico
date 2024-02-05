import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../css/Admin.css';
import { useForm } from 'react-hook-form';
import { Button, Form, Table } from 'react-bootstrap';
import {
	collection,
	addDoc,
	getDocs,
	deleteDoc,
	doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const Notas = () => {
	const [notas, setNotas] = useState();
	const [tablaNotas, setTablaNotas] = useState();
	const { register, handleSubmit, reset } = useForm();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const notasRef = collection(db, 'notas');
				const snapshot = await getDocs(notasRef);
				const notasArray = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				setNotas(notasArray);
				cargarTablaNotas(notasArray);
			} catch (error) {
				console.error('Error al obtener notas:', error);
			}
		};
		fetchData();
	}, []);

	// funcion para cargar notas
	function cargarTablaNotas(datosNotas) {
		if (datosNotas) {
			const tabla = datosNotas.map((nota) => (
				<tr key={nota.id}>
					<td className='align-middle w-25'>{nota.responsable}</td>
					<td className='align-middle '>{nota.recordatorio}</td>
					<td className='align-middle d-flex flex-row'>
						<button
							className='btneditgestion'
							onClick={() => borrarNota(nota.id)}>
							<i className='bi bi-check2-circle acciconoagusu'></i>
						</button>
					</td>
				</tr>
			));
			setTablaNotas(tabla);
		} else {
			setTablaNotas(
				<tr key='no-turnos'>
					<td colSpan='4'>
						<p>No hay notas o recordatorios pendientes</p>
					</td>
				</tr>
			);
		}
	}

	const onSubmit = handleSubmit(async (values) => {
		const notaRef = collection(db, 'notas');
		await addDoc(notaRef, values);
		const updatedNotas = await getDocs(collection(db, 'notas'));
		const updatedNotasArray = updatedNotas.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));
		setNotas(updatedNotasArray);
		cargarTablaNotas(updatedNotasArray);
		Swal.fire({
			icon: 'success',
			title: 'Nota Registrada!',
			showConfirmButton: false,
			timer: 1500,
		});
		reset();
	});

	// funcion para eliminar notas
	const deleteNota = (id) => deleteDoc(doc(db, 'notas', id));

	async function borrarNota(id) {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion de la nota?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});
			if (result.isConfirmed) {
				await deleteNota(id);
				Swal.fire({
					icon: 'success',
					title: 'Nota eliminada correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
				Swal.close();
				const updatedNotas = await getDocs(collection(db, 'notas'));
				const updatedNotasArray = updatedNotas.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				setNotas(updatedNotasArray);
			}
		} catch (error) {
			console.error('Error al eliminar la nota:', error);
		}
	}

	return (
		<>
			<div>
				<hr className='linea mx-3' />
				<h2 className='titlead'>Tablero de Notas y Recordatorios</h2>
				<Form className='Formcargarecord' onSubmit={onSubmit}>
					<Form.Group className='w-25 mb-3' controlId='resp'>
						<Form.Label className='labelcarga'>Responsable</Form.Label>
						<select
							className='inputcarga'
							type='text'
							{...register('responsable')}>
							<option>Selecciona..</option>
							<option value='OSCAR'>OSCAR</option>
							<option value='JORGE'>JORGE</option>
							<option value='MARIA'>MARIA</option>
						</select>
					</Form.Group>
					<Form.Group className='mb-3' controlId='record'>
						<Form.Label className='labelcarga'>
							Recordatorio/Nota
						</Form.Label>
						<Form.Control
							as='textarea'
							rows={3}
							cols={35}
							{...register('recordatorio')}
						/>
					</Form.Group>
					<Form.Group id='inputrecord'>
						<Button className='botoneditcarga' type='submit'>
							<i className='iconavbar bi bi-check2-square'></i>
							Registrar
						</Button>
					</Form.Group>
				</Form>
				<hr className='linea mx-3' />
				<div className='table-responsive'>
					<Table
						striped
						hover
						variant='dark'
						className='tablaagusu table border border-secondary-subtle'>
						<thead>
							<tr>
								<th>Responsable</th>
								<th className='w-100'>Recordatorio</th>
								<th className='accag'>Acciones</th>
							</tr>
						</thead>
						<tbody id='tablaTurnos' className='table-group-divider'>
							{tablaNotas}
						</tbody>
					</Table>
				</div>
			</div>
		</>
	);
};
