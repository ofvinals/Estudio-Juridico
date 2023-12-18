import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import Swal from 'sweetalert2';
import '../css/Especialidad.css';

export const Especialidad = () => {
	const handleClickCiv = (e) => {
		Swal.fire({
			title: 'Derecho Civil',
			text: 'lorem',
			confirmButtonColor: '#8f8e8b',
		});
	};

	const handleClickLab = (e) => {
		Swal.fire({
			title: 'Derecho Laboral',
			text: 'lorem',
			confirmButtonColor: '#8f8e8b',
		});
	};

	const handleClickSus = (e) => {
		Swal.fire({
			title: 'Derecho Sucesorio',
			text: 'lorem',
			confirmButtonColor: '#8f8e8b',
		});
	};

	const handleClickConc = (e) => {
		Swal.fire({
			title: 'Derecho Concursal',
			text: 'lorem',
			confirmButtonColor: '#8f8e8b',
		});
	};

	const handleClickSoc = (e) => {
		Swal.fire({
			title: 'Derecho Societario',
			text: 'lorem',
			confirmButtonColor: '#8f8e8b',
		});
	};

	const handleClickCom = (e) => {
		Swal.fire({
			title: 'Derecho Comercial',
			text: 'lorem',
			confirmButtonColor: '#8f8e8b',
		});
	};

	return (
		<section className='esp p-2'>
			<h2 className='titlees'>Areas de Actuacion</h2>
			<Container>
				<Row>
					<CardGroup className='d-flex flex-wrap flex-row justify-content-center'>
						
						<Col xs={4} md={3}>
							<Card className='cardbody'>
								<div className=' '>
									<Card.Title className='titlecard'>
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
								<button to='#' className='cardlink1' onClick={handleClickCiv}>
									Ver mas
								</button>
							</Card>
						</Col>

						<Col xs={4} md={3}>
							<Card className='cardbody'>
								<div className=''>
									<Card.Title className='titlecard'>
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
								<button to='#' className='cardlink1' onClick={handleClickLab}>
									Ver mas
								</button>
							</Card>
						</Col>

						<Col xs={4} md={3}>
							<Card className='cardbody'>
								<div className=''>
									<Card.Title className='titlecard'>
										Derecho Sucesorio
									</Card.Title>
									<div className='listado'>
										<ul className='ps-0 text-start'>
											<li>Declaratoria de herederos</li>
											<li>Adjudicacion de bienes</li>
											<li>Acciones de recupero de herencia</li>
										</ul>
									</div>
								</div>
								<button to='#' className='cardlink1' onClick={handleClickSus}>
									Ver mas
								</button>
							</Card>
						</Col>

						<Col xs={4} md={3}>
							<Card className='cardbody'>
								<div className=''>
									<Card.Title className='titlecard'>
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
								<button to='#' className='cardlink1' onClick={handleClickCom}>
									Ver mas
								</button>
							</Card>
						</Col>

						<Col xs={4} md={3}>
							<Card className='cardbody'>
								<div className=''>
									<Card.Title className='titlecard'>
										Derecho Societario
									</Card.Title>
									<div className='listado'>
										<ul className='ps-0 text-start'>
											<li>Constitucion de sociedades</li>
											<li>Acuerdo de accionistas</li>
											<li>Conflictos societarios</li>
											<li>Liquidacion y disolucion</li>
										</ul>
									</div>
								</div>
								<button to='#' className='cardlink1' onClick={handleClickSoc}>
									Ver mas
								</button>
							</Card>
						</Col>

						<Col xs={4} md={3}>
							<Card className='cardbody'>
								<div className='y'>
									<Card.Title className='titlecard'>
										Derecho Concursal
									</Card.Title>
									<div className='listado'>
										<ul className='ps-0 text-start'>
											<li>Reestructuracion de deudas</li>
											<li>Acuerdos preventivos</li>
											<li>Verificacion de creditos</li>
											<li>Salvataje de empresas</li>
										</ul>
									</div>
								</div>

								<button
									to='#'
									className='cardlink1'
									onClick={handleClickConc}>
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
