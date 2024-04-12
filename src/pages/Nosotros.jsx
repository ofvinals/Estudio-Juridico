import React from 'react';
import Card from 'react-bootstrap/Card';

import '../css/Nosotros.css';

export const Nosotros = () => {
	return (
		<>
			<div className='container-lg about'>
				<h1 className='tituloabout'>Sobre Nosotros</h1>
				<h2 className='subtituloabout'>Historia</h2>

				<p className='parrafoabout lh-lg'>
					Fundado en ..... por ....., desde entonces nos hemos consolidado
					como un destacado estudio jurídico en Tucumán y todo el Noroeste
					Argentino. Con más de 35 años de experiencia y una trayectoria
					sólida, nos hemos dedicado a brindar servicios legales de calidad
					y a establecer relaciones solidas y duraderas con nuestros clientes.-{' '}
					<br /> Nuestro compromiso es brindar un servicio legal confiable,
					ético y orientado a obtener resultados positivos. Basados en la
					excelencia, la integridad y la atención personalizada. Trabajamos
					en estrecha colaboración con nuestros clientes, comprendiendo sus
					necesidades y objetivos legales, para ofrecerles un asesoramiento
					integral y adaptado a cada situación.
				</p>

				<div className='d-flex row row-cols-12 justify-content-center p-3'>
					<Card.Body className='cardabout'>
						<Card.Title className='cardtitleabout'>Mision</Card.Title>
						<Card.Text className='contcard '>
							Nuestra mision consiste en diagnosticar y evaluar
							correctamente los problemas, conflictos y consultas de
							nuestros clientes, alineando las alternativas de solución
							con la defensa de sus intereses. Nuestro foco está
							orientado a encontrar y lograr la solución más eficiente a
							cada uno de los desafíos planteados. Todo ello se logra con
							especialización, alta responsabilidad profesional y trabajo
							en equipo, dentro de la ley y cumpliendo con las reglas
							impuestas por la moral, las buenas costumbres y las mejores
							prácticas.-
						</Card.Text>
					</Card.Body>

					<Card.Body className='cardabout'>
						<Card.Title className='cardtitleabout'>Vision</Card.Title>
						<Card.Text className='contcard'>
							Nuestra visión se basa en el liderazgo respaldado por la
							profesionalidad, el más estricto y cuidadoso análisis del
							marco regulatorio, y la más calificada doctrina a la que
							contribuimos con nuestra opinión legal. Nuestro
							asesoramiento es y debe tomar como objetivo central
							prevenir conflictos, minimizar contingencias, y resolver
							problemas complejos planteados por nuestros Clientes.-
						</Card.Text>
					</Card.Body>

					<Card.Body className='cardabout'>
						<Card.Title className='cardtitleabout'>Valores</Card.Title>
						<Card.Text className='contcard'>
							Los valores son esenciales en cualquier organización. Es
							por ello que ratificamos nuestro compromiso con el
							cumplimiento de la legislación vigente, y con el mandato de
							las reglas éticas y morales. Todo ello aplicando las
							mejores prácticas locales e internacionales.-
						</Card.Text>
					</Card.Body>
				</div>
			</div>

			<div className='team'>
				<h1 className='tituloaboutteam'>Nuestro Equipo</h1>

				<div className='col-md-4 col-sm-6 cardnosotros'>
					<div className='our-team'>
						<div className='team-image'>
							<img src='' />
							<p className='description'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Praesent urna diam, maximus ut ullamcorper quis
							</p>
						</div>
						<div className='team-info'>
							<h3 className='titlenosotros'>Oscar Frias Viñals</h3>
							<span className='post'>Abogado</span>
						</div>
					</div>
				</div>

				<div className='col-md-4 col-sm-6 cardnosotros'>
					<div className='our-team'>
						<div className='team-image'>
							<img src='' />
							<p className='description'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Praesent urna diam, maximus ut ullamcorper quis
							</p>
						</div>
						<div className='team-info'>
							<h3 className='titlenosotros'>Jorge Posse Ponessa (h)</h3>
							<span className='post'>Abogado</span>
						</div>
					</div>
				</div>

				<div className='col-md-4 col-sm-6 cardnosotros'>
					<div className='our-team'>
						<div className='team-image'>
							<img src='' />
							<p className='description'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Praesent urna diam, maximus ut ull
							</p>
						</div>

						<div className='team-info'>
							<h3 className='titlenosotros'>M. Soledad Lizarraga</h3>
							<span className='post'>Abogado Junior</span>
						</div>
					</div>
				</div>
				<div className='col-md-4 col-sm-6 cardnosotros'>
					<div className='our-team'>
						<div className='team-image'>
							<img src='' />
							<p className='description'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Praesent urna diam, maximus ut ull
							</p>
						</div>

						<div className='team-info'>
							<h3 className='titlenosotros'>Martin A. Soto </h3>
							<span className='post'>Abogado Junior</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
