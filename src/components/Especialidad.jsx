import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import { Link, NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/Especialidad.css';


export const Especialidad = () => {

	const handleClick=(e)=>{
		Swal.fire({
			title: 'Derecho Concursal',
			text: 'lorem',
			confirmButtonColor: '#8f8e8b',
		});
	}
	return (
		<section className='esp p-2'>
			<h2 className='titlees'>Areas de Actuacion</h2>
			<Container>
				<Row>
					<CardGroup className='d-flex flex-wrap flex-row justify-content-center'>
						<Col xs={5} md={4}>
							<Card className='me-3 articleesp cardbody'>
								<div className=' '>
									<Card.Title className='titleesp'>
										Derecho Civil
									</Card.Title>
									<div className='listado '>
										<ul className='ps-0 text-start'>
											<li>Contratos</li>
											<li>Prescripcion Adquisitiva</li>
											<li>Accidentes de transito</li>
											<li>Daños y perjuicios</li>
										</ul>
									</div>
								</div>
								<button to='#' className='cardlink1'>
									Ver mas
								</button>
							</Card>
						</Col>
						<Col xs={5} md={4}>
							<Card className='me-3 articleesp cardbody'>
								<div className=''>
									<Card.Title className='titleesp'>
										Derecho Laboral
									</Card.Title>

									<div className='listado'>
										<ul className='ps-0 text-start'>
											<li>Despidos</li>
											<li>Accidentes laborales</li>
											<li>Sanciones disciplinarias</li>
											<li>Acoso laboral y mobbing</li>
										</ul>
									</div>
								</div>
								<button to='#' className='cardlink1'>
									Ver mas
								</button>
							</Card>
						</Col>
						<Col xs={5} md={4}>
							<Card className='me-3 articleesp cardbody'>
								<div className=''>
									<Card.Title className='titleesp'>
										Derecho Sucesorio
									</Card.Title>

									<div className='listado'>
										<ul className='ps-0 text-start'>
											<li>Declaratoria de herederos</li>
											<li>Adjudicacion de bienes</li>
											<li>
												Acciones de recupero de herencia
											</li>
										</ul>
									</div>
								</div>
								<button to='#' className='cardlink1'>
									Ver mas
								</button>
							</Card>
						</Col>
						<Col xs={5} md={4}>
							<Card className='me-3 articleesp cardbody'>
								<div className=''>
									<Card.Title className='titleesp'>
										Derecho Comercial
									</Card.Title>

									<div className='listado'>
										<ul className=' ps-0 text-start'>
											<li>Ejecucion de pagare</li>
											<li>Incumplimiento contractual</li>
											<li>Desalojos</li>
										</ul>
									</div>
								</div>
								<button to='#' className='cardlink1'>
									Ver mas
								</button>
							</Card>
						</Col>
						<Col xs={5} md={4}>
							<Card className='me-3 articleesp cardbody'>
								<div className=''>
									<Card.Title className='titleesp'>
										Derecho Societario
									</Card.Title>
									<div className='listado'>
										<ul className='ps-0 text-start'>
											<li>
												Constitucion de
												sociedades
											</li>
											<li>Acuerdo de accionistas</li>
											<li>Conflictos societarios</li>
											<li>Liquidacion y disolucion</li>
										</ul>
									</div>
								</div>
								<button to='#' className='cardlink1'>
									Ver mas
								</button>
							</Card>
						</Col>
						<Col xs={5} md={4}>
							<Card className='me-3 articleesp cardbody'>
								<div className='y'>
									<Card.Title className='titleesp'>
										Derecho Concursal
									</Card.Title>

									<div className='listado'>
										<ul className='ps-0 text-start'>
											<li>Reestructuracion de deudas</li>
											<li>Acuerdos preventivos</li>
											<li>
												Verificacion de
												creditos
											</li>
											<li>Salvataje de empresas</li>
										</ul>
									</div>
								</div>
								<button to='#' className='cardlink1' onClick={handleClick}>
									Ver mas
								</button>
							</Card>
						</Col>
					</CardGroup>
				</Row>
			</Container>
		</section>
	);
};
