import React from 'react';
import Swal from 'sweetalert2';
import { db } from '../firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';

export const BorraUsu = () => {
	const borraUsuario = async (id, setData) => {
		try {
			Swal.showLoading();

			const result = await Swal.fire({
				title: '¿Estás seguro?',
				text: 'Confirmas la eliminacion del usuario',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#8f8e8b',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
			});

			if (result.isConfirmed) {
				await deleteDoc(doc(db, 'usuarios', id));

				Swal.fire({
					icon: 'success',
					title: 'Usuario eliminado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});

				Swal.close();

				// Actualiza el estado de los datos después de la eliminación
				setData((prevData) => prevData.filter((user) => user.id !== id));
			}
		} catch (error) {
			console.error('Error al confirmar la eliminación del usuario:', error);
			// Manejar el error según tus necesidades
		}
	};

	return (
		<div>{/* Puedes renderizar aquí el componente o lo que necesites */}</div>
	);
};
