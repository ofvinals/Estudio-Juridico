import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';

import '../css/Interes.css';

export const Interes = () => {
	return (
		<section className='interes container-lg'>
			<h1 className='titleint'>Webs de Interes</h1>
			<Container>
				<Row>
					<CardGroup className='d-flex flex-wrap justify-content-center'>
						
						<Col xs={10} md={4} className='mb-3'>
							<Card className='articleint'>
								<Card.Body className='d-flex flex-column align-items-center'>
									<Card.Title className='subtitleint '>
										Poder Judicial de Tucuman
									</Card.Title>
									<NavLink to='https://www.justucuman.gov.ar/'>
										<Card.Img
											className='imgcard'
											variant='top'
											src='/poder judicial tuc1.png'
											width='100px'
											height='100px'
										/>
									</NavLink>
								</Card.Body>
							</Card>
						</Col>
						
						<Col xs={10} md={4}className='mb-3'>
							<Card className='articleint'>
								<Card.Body className='d-flex flex-column align-items-center'>
									<Card.Title className='subtitleint'>
										Colegio de Abogados de Tucuman
									</Card.Title>
									<NavLink to='https://colegioabogadostuc.org.ar/'>
										<Card.Img
											className='imgcard'
											variant='top'
											src='/colegio abogados.jpeg'
											width='100px'
											height='100px'
										/>
									</NavLink>
								</Card.Body>
							</Card>
						</Col>
						
						<Col xs={10} md={4}className='mb-3'>
							<Card className='articleint'>
								<Card.Body className='d-flex flex-column align-items-center'>
									<Card.Title className='subtitleint'>
										Poder Judicial de la Nacion
									</Card.Title>
									<NavLink to='https://www.pjn.gov.ar/'>
										<Card.Img
											className='imgcard'
											variant='top'
											src='/poder judicial tuc.png'
											width='100px'
											height='100px'
										/>
									</NavLink>
								</Card.Body>
							</Card>
						</Col>
						
						<Col xs={10} md={4}className='mb-3'>
							<Card className='articleint'>
								<Card.Body className='d-flex flex-column align-items-center'>
									<Card.Title className='subtitleint'>
										Direccion General de Rentas de Tucuman
									</Card.Title>
									<NavLink to='https://www.rentastucuman.gob.ar/'>
										<Card.Img
											className='imgcard'
											variant='top'
											src='/rentas.png'
											width='100px'
											height='100px'
										/>
									</NavLink>
								</Card.Body>
							</Card>
						</Col>
						
						<Col xs={10} md={4}className='mb-3'>
							<Card className='articleint'>
								<Card.Body className='d-flex flex-column align-items-center'>
									<Card.Title className='subtitleint'>
										Boletin Judicial de Tucuman
									</Card.Title>
									<NavLink to='https://edictos.justucuman.gov.ar/'>
										<Card.Img
											className='imgcard'
											variant='top'
											src='/edictos.jpeg'
											width='100px'
											height='100px'
										/>
									</NavLink>
								</Card.Body>
							</Card>
						</Col>
						
						<Col xs={10} md={4}className='mb-3'>
							<Card className='articleint'>
								<Card.Body className='d-flex flex-column align-items-center'>
									<Card.Title className='subtitleint'>
										Jurisprudencia de la Provincia de Tucuman
									</Card.Title>
									<NavLink to='https://www.justucuman.gov.ar/jurisprudencia'>
										<Card.Img
											className='imgcard'
											variant='top'
											src='/jurisprudencia.jpg'
											width='100px'
											height='100px'
										/>
									</NavLink>
								</Card.Body>
							</Card>
						</Col>
					</CardGroup>
				</Row>
			</Container>
		</section>
	);
};
