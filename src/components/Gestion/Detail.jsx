/* eslint-disable react/prop-types */
import { useAuth } from '../../context/AuthContext';

export const Detail = ({modulo}) => {
   const nombreModulo= modulo
   const { currentUser } = useAuth();
	const displayName = currentUser.displayName;

	return (
		<div>
	
			<div className='bodygestion container-lg bg-dark'>
				<div className='main px-3 '>
					<h4 className='titlegestion'>Bienvenido, {displayName}</h4>
					<p className='subtitlegestion'>
						Panel de Administracion de {nombreModulo}
					</p>
				</div>
			</div>
		</div>
	);
};
