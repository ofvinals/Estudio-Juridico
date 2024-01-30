import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

export const Footer = () => {
	return (
		<footer className=' container-lg bg-dark'>
			<hr className='linea mx-3' />
			<div className='container text-center'>
				<div className='row'>

					<ul className='col-6 col-md-4 nav justify-content-center align-items-center my-1'>
						<li className='text-deg nav-item'>
							<Link to='/home' className='nav-link text-deg'>
								Home
							</Link>
						</li>
						<li className='text-deg nav-item'>
							<Link to='/nosotros' className='nav-link text-deg'>
								Nosotros
							</Link>
						</li>
						<li className='text-deg nav-item'>
							<Link to='/contact' className='nav-link text-deg'>
								Contacto
							</Link>
						</li>
					</ul>

					<div className='social-item col-6 col-md-4 d-flex flex-wrap align-items-center justify-content-center my-1'>
						<Link
							className='social-icon'
							to='https://www.facebook.com/estudiopossetucuman?mibextid=ZbWKwL'
							target='_blank'>
							<i className='bi bi-facebook'></i>
						</Link>
						<Link
							className='social-icon'
							href='https://www.instagram.com/estudioposseasociados?igsh=bmYzN3VybGdlZGgw'
							target='_blank'>
							<i className='bi bi-instagram'></i>
						</Link>
						<Link
							className='social-icon'
							to='http://www.twitter.com'
							target='_blank'>
							<i className='bi bi-twitter-x'></i>
						</Link>
					</div>
					
					<div className='logofooter col-12 col-md-4 text-center align-items-center'>
						<Link className=' text-center' to='/home'>
							<img className='logofooter'
								src='/logo estudio.png'
								width={100}
								alt='logoestudio'
							/>
						</Link>
						<p className='text-center derechos'>
							© 2024 Todos los Derechos Reservados - Estudio Juridico Posse & Asoc.
						</p>
						<p className='text-center derechos'>Diseño y Desarrollo: Oscar Frias Viñals</p>`
					</div>
				</div>
			</div>
		</footer>
	);
};
