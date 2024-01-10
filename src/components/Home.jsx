import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import '../css/Home.css';

export const Home = () => {
	return (
		<div className='bg-dark container-fluid'>
			<a
				href='https://api.whatsapp.com/send?phone=+543814581382&text=Hola!%20Quiero%20consultar%20por%20servicios%20de%20asesoramiento%20legal.%20'
				className='float'
				target='_blank'>
				<i className='fa fa-whatsapp my-float'></i>
			</a>
			<div className='imagennav'>
				<p className='parrafo1'>
					Evolucionamos el concepto de estudio juridico
				</p>
				<p className='parrafo2'>
					PRIMER ESTUDIO JURIDICO ONLINE DE TUCUMAN
				</p>
				<Link className=' botonturno' to='/login'>
					<i className='icosec4 bi bi-calendar-check me-2'></i>
					Agenda tu turno ahora!
				</Link>
			</div>

			<Carousel fade>
				<Carousel.Item>
					<div className='imagencar1'>
						<Carousel.Caption>
							<h3 className='titlecar1'>Disponibilidad</h3>
							<ul className='listacar1'>
								<li>Varias vias de comunicacion</li>
								<li>Videollamadas - Reuniones Virtuales</li>
								<li>Meet - Zoom - Discord</li>
								<li>Whatsapp - Telegram</li>
								<li>Correo Electronico</li>
							</ul>
						</Carousel.Caption>
					</div>
				</Carousel.Item>
				<Carousel.Item>
					<div className='imagencar2'>
						<Carousel.Caption>
							<h3 className='titlecar2'>Expediente Virtual</h3>
							<ul className='listacar2'>
								<li>
									Conoce el estado y situacion de tu expediente
									judicial en tiempo real
								</li>
								<li>Adjunta documentacion digitalizada</li>
								<li>
									Recordatorios automaticos de audiencias,reuniones y
									vencimientos
								</li>
							</ul>
						</Carousel.Caption>
					</div>
				</Carousel.Item>
				<Carousel.Item>
					<div className='imagencar3'>
						<Carousel.Caption>
							<h3 className=' titlecar3'>Formas de pago</h3>
							<ul className='listacar3'>
								<li>Paga de la forma que mas te convenga</li>
								<li>Planes de Pago</li>
								<li>Abonos mensuales para empresas</li>
								<li>Efectivo o transferencias bancarias</li>
								<li>Tarjeta de credito - Debito - MercadoPago</li>
								<li>Criptomonedas</li>
							</ul>
						</Carousel.Caption>
					</div>
				</Carousel.Item>

				<Carousel.Item>
					<div className='imagencar2'>
						<Carousel.Caption>
							<h3 className='titlecar2'>Estudio Juridico 2.0</h3>
							<p className='listacar2'>
								Ponemos a tu disposicion el mejor servicio es nuestro
								objetivo, por ello evolucionamos hacia el concepto
								asesoría legal online para brindarte respuestas con
								agilidad y eficiencia.
							</p>
						</Carousel.Caption>
					</div>
				</Carousel.Item>

				<Carousel.Item>
					<div className='imagencar2'>
						<Carousel.Caption>
							<h3 className='titlecar2'>Asesoramiento para empresas</h3>
							<ul className='listacar2'>
								<li>
									Asesoramiento empresario, laboral, civil,
									administrativo
								</li>
								<li>Gestión de cobranzas</li>
								<li>
									Revisión y redacción de contratos en general,
									comercial, laboral y de confidencialidad
								</li>
								<li>
									Creación, transformacion y liquidacion de todo tipo
									de sociedades y/o sucursales
								</li>
							</ul>
						</Carousel.Caption>
					</div>
				</Carousel.Item>
			</Carousel>

			<div className='imagensection4'>
				<h1 className='titlecontac'>Contactanos!</h1>
				<div className='conttel'>
					<i className='icosec4 bi bi-telephone-fill me-2'></i>
					<p className='textosec4'>+54 381-4581382</p>
				</div>
				<div className='contmail'>
					<i className='icosec4 bi bi-envelope-at-fill me-2'></i>
					<p className='textosec4'>ofvinals@gmail.com</p>
				</div>
				<div className='contdir'>
					<i className='icosec4 bi bi-geo-alt-fill me-2'></i>
					<p className='textosec4'>9 de Julio 620 Planta Baja C - SMT</p>
				</div>
				<Link className='botonturnoabajo' to='/login'>
					<i className='icosec4 bi bi-calendar-check me-1'></i>
					AGENDA TU TURNO ONLINE!
				</Link>
			</div>
		</div>
	);
};
