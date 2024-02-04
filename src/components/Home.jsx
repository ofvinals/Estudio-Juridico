import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import '../css/Home.css';

export const Home = () => {
	return (
		<div className='container-lg'>
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
				<p className='parrafo2'>ESTUDIO JURIDICO POSSE & ASOC</p>
				<div className='contbtn'>
					<Link className=' botonturno' to='/login'>
						<i className='icosecboton bi bi-calendar-check me-2'></i>
						Agenda tu turno ahora!
					</Link>
				</div>
			</div>

			<div className='imagenlogosec2'>
				<a className='text-decoration-none' href='/login'>
					<button className='btnhome'>
						<i className='fa-solid fa-right-to-bracket me-2'></i>Ingresa a
						tu cuenta
					</button>
				</a>
			</div>
			<p className='textosec2'>
				Somos el primer Estudio Juridico online de Tucuman!
			</p>

			<Carousel slide={false}>
				<Carousel.Item>
					<div className='imagencar1'>
						<div className='d-flex flex-column'>
							<h3 className='titlecar'>Disponibilidad</h3>
							<ul className='listacar'>
								<li>Varias vias de comunicacion</li>
								<li>Videollamadas - Reuniones Virtuales</li>
								<li>Meet - Zoom - Discord</li>
								<li>Whatsapp - Telegram</li>
								<li>Correo Electronico</li>
							</ul>
						</div>
					</div>
				</Carousel.Item>
				<Carousel.Item>
					<div className='imagencar2'>
						<div className='d-flex flex-column'>
							{' '}
							<h3 className='titlecar'>Expediente Virtual</h3>
							<ul className='listacar'>
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
						</div>{' '}
					</div>
				</Carousel.Item>
				<Carousel.Item>
					<div className='imagencar3'>
						<div className='d-flex flex-column'>
							{' '}
							<h3 className=' titlecar'>Formas de pago</h3>
							<ul className='listacar'>
								<li>Paga de la forma que mas te convenga</li>
								<li>Abonos mensuales para empresas</li>
								<li>Efectivo o transferencias bancarias</li>
								<li>Tarjeta de credito - Debito - MercadoPago</li>
								<li>Criptomonedas</li>
							</ul>
						</div>{' '}
					</div>
				</Carousel.Item>

				<Carousel.Item>
					<div className='imagencar2'>
						<div className='d-flex flex-column'>
							<h3 className='titlecar'>Estudio Juridico 2.0</h3>
							<p className='listacar'>
								Ponemos a tu disposicion el mejor servicio es nuestro
								objetivo, por ello evolucionamos hacia el concepto
								asesoría legal online para brindarte respuestas con
								agilidad y eficiencia.
							</p>
						</div>{' '}
					</div>
				</Carousel.Item>

				<Carousel.Item>
					<div className='imagencar2'>
						<div className='d-flex flex-column'>
							{' '}
							<h3 className='titlecar'>Asesoramiento para empresas</h3>
							<ul className='listacar'>
								<li>Asesoramiento empresario integral</li>
								<li>Gestión de cobranzas</li>
								<li>Revisión y redacción de contratos en general</li>
								<li>
									Creación, transformacion y liquidacion de todo tipo
									de sociedades
								</li>
							</ul>
						</div>{' '}
					</div>
				</Carousel.Item>
			</Carousel>
			<div className='d-flex flex-row'>
				<div className='imagenlogosec4'></div>
				<div className='w-75 d-flex flex-column justify-content-center align-content-center'>
					<p className='titlesect4'>PORQUE ELEGIRNOS</p>
					<p className='textsec4'>
						Mas de 35 años de ejercicio de la abogacia avalan el profesionalismo con el que llevamos a cabo un
						servicio de asesoría legal de excelencia. Nos caracteriza la seriedad y responsabilidad en la
						relacion con nuestros clientes.-
					</p>
				</div>
			</div>
			<div className='imagensection4'>
				<p className='titlecontac'>CONTACTO</p>
				<div className='conttel'>
					<i className='icosec4 bi bi-telephone-fill me-2 mb-3'></i>
					<p className='textosec4'>+54 381-458 1382</p>
				</div>
				<div className='contmail'>
					<i className='icosec4 bi bi-envelope-at-fill me-2 mb-lg-4'></i>
					<p className='textosec4'>ofvinals@gmail.com</p>
				</div>
				<div className='contdir'>
					<i className='icosec4 bi bi-geo-alt-fill me-2 '></i>
					<p className='textosec4'>9 de Julio 620 Planta Baja C - SMT</p>
				</div>
				<div className='contbtn'>
					<Link className='botonturno' to='/login'>
						<i className='icosecboton bi bi-calendar-check me-2'></i>
						AGENDA TU TURNO ONLINE!
					</Link>
				</div>
			</div>
		</div>
	);
};
