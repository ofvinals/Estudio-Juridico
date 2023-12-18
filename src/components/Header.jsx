import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Header.css';
import { Button } from 'react-bootstrap';

export const Header = () => {
	const [estadoLogin, setEstadoLogin] = useState('');

	const auth = useAuth();
	const { email } = auth.user;

	useEffect(() => {
		if (!email) {
			setEstadoLogin('"No hay usuario logueado"');
		} else {
			setEstadoLogin((prevEstado) => {
				return email;
			});
		}
	}, [email]);

	const navigate = useNavigate();

	const [expanded, setExpanded] = useState(false);

	const handleNavCollapse = () => {
		setExpanded(false);
	};

	const handleNavLinkClick = () => {
		handleNavCollapse();
	};
	return (
		<div className='bg-dark'>
			<Navbar
				collapseOnSelect
				expand='xxl'
				className='bg-dark'
				expanded={expanded}
				onSelect={() => setExpanded(false)}>
				<Container className=''>
					<Navbar.Brand as={Link} to='/home'>
						<img src='/logo estudio.png' width='50px' alt='logoestudio' />
					</Navbar.Brand>
					<p className='fw-bold navtitle mx-2 mt-2 text-center'>
						Estudio Juridico Integral
					</p>
					<Navbar.Toggle
						className='mb-3 menu'
						aria-controls='responsive-navbar-nav'
						onClick={() => setExpanded(!expanded)}
					/>
					<Navbar.Collapse
						className='colapse'
						id='responsive-navbar-nav'
						placement='end'
						onClick={handleNavLinkClick}>
						<Nav className='menu bg-dark'>
							<NavLink
								className='btnnav'
								to='/home'
								onClick={handleNavLinkClick}>
								Home
							</NavLink>
							<NavLink
								className='btnnav'
								to='/especialidad'
								onClick={handleNavLinkClick}>
								Areas de Actuacion
							</NavLink>
							<NavLink
								className='btnnav'
								to='/nosotros'
								onClick={handleNavLinkClick}>
								Quienes Somos
							</NavLink>
							<NavLink
								className='btnnav'
								to='/contact'
								onClick={handleNavLinkClick}>
								Contacto
							</NavLink>
							<NavLink
								className='btnnav'
								to='/interes'
								onClick={handleNavCollapse}>
								Sitios de interes
							</NavLink>
							<NavLink
								className='btnnav'
								to='/adminusu'
								onClick={handleNavCollapse}>
								Panel de Usuarios
							</NavLink>
							<div className='botones'>
								<p className='estadolog'>
									Estas logueado como: {estadoLogin}
								</p>
								<a className='botona' type='button' href='/login'>
									<button
										disabled={!!auth.user}
										className='botonnavlog'>
										Inicia sesion
									</button>

								</a>
								<a type='button' href='/registro'>
									<button
										disabled={!!auth.user}
										className='botonnavreg'>
										Registrarme
									</button>
								</a>
							</div>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
};
