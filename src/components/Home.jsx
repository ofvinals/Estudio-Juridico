import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import '../css/Home.css';

export const Home = () => {
	return (
		<div className='bg-dark  container-fluid'>
			<div className='imagennav'>
				<p className='text-white parrafo1'>
					Evolucionamos el concepto de estudio juridico
				</p>
				<p className='text-white parrafo2'>
					SOMOS EL PRIMER ESTUDIO JURIDICO ONLINE DE TUCUMAN
				</p>
				<Link
					className=' botonturno'
					to='/login'>
					Agenda tu turno ahora!
				</Link>
			</div>
			<div className='carrousel bg-dark'>
				<Carousel fade>
					<Carousel.Item className='cardcarrousel'>
						<img
							className='imgcar'
							src='/vista-superior-elementos-orientacion-profesional-jueces.jpg'
						/>
						<Carousel.Caption className='textcar'>
							<h3 className='titlecard'>Disponibilidad</h3>
							<ul className='listacard'>
								<li>Varias vias de comunicacion</li>
								<li>Videollamadas/Reuniones Virtuales</li>
								<li>Meet/Zoom/Discord</li>
								<li>Whatsapp/Telegram</li>
								<li>Correo Electronico</li>
							</ul>
						</Carousel.Caption>
					</Carousel.Item>
					<Carousel.Item>
						<img className='imgcar' src='/descarga (1).jpeg' />
						<Carousel.Caption className='textcar'>
							<h3 className='titlecard'>Expediente Virtual</h3>
							<ul className='listacard'>
								<li>
									Conoce el estado y situacion de tu
									expediente judicial en tiempo real
								</li>
								<li>Adjunta documentacion digitalizada</li>
								<li>
									Recordatorios automaticos de
									audiencias,reuniones y vencimientos
								</li>
							</ul>
						</Carousel.Caption>
					</Carousel.Item>
					<Carousel.Item>
						<img className='imgcar' src='/descarga (2).jpeg' />
						<Carousel.Caption className='textcar'>
							<h3 className=' titlecard'>Formas de pago</h3>
							<ul className='listacard'>
								<li>Paga de la forma que mas te convenga</li>
								<li>Planes de Pago</li>
								<li>Abonos mensuales para empresas</li>
								<li>Efectivo o transferencias bancarias</li>
								<li>Tarjeta de credito/Debito/MercadoPago</li>
								<li>Criptomonedas</li>
							</ul>
						</Carousel.Caption>
					</Carousel.Item>
				</Carousel>
			</div>

			<div className='section4'>
				<div className='imgsection4'>
					<img className='img-fluid ' src='414635-PD6SLS-602-1a.jpg' alt='imagencontacto' />
				</div>
				<div className='textocontacto'>
					<h1 className='titlecontac'>Contactanos!</h1>
					<div className='d-flex flex-row  justify-content-center'>
						<i className='color icosec4 bi bi-telephone-fill me-2 '></i>
						<p>+54 381-4581383</p>
					</div>
					<div className='d-flex flex-row  justify-content-center'>
						<i className='color icosec4 bi bi-envelope-at-fill me-2 '></i>
						<p>admin@gmail.com</p>
					</div>
					<h4 className='icosec4 color'>-------- O --------</h4>
					<div className='d-flex flex-row  justify-content-center'>
						<i className='color icosec4 bi bi-calendar-check me-2 '></i>
						<h4 className='color icosec4'>
							Agenda tu consulta YA!
						</h4>
						<Link className='botonturnoabajo' to='/login'>
						AGENDA TU TURNO ONLINE!
					</Link>
					</div>

				</div>
			</div>
		</div>
	);
};
