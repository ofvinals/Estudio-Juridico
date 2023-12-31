import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Header.css';

export const Header = () => {
	const [estadoLogin, setEstadoLogin] = useState('');
	const [expanded, setExpanded] = useState(false);
	const { user } = useAuth();

	useEffect(() => {
		if (!user) {
			setEstadoLogin('No hay usuario logueado');
		} else {
			setEstadoLogin(user.email);
		}
	}, [user]);

	const navigate = useNavigate();

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
				<Container className='allnav'>
					<Navbar.Brand as={Link} to='/home'>
						<img src='/logo estudio.png' width='50px' alt='logoestudio' />
					</Navbar.Brand>
					<p className='fw-bold navtitle mx-2 mt-2 text-center'>
						Estudio Juridico Online
					</p>
					<Navbar.Toggle
						className='mb-3 menu'
						aria-controls='responsive-navbar-nav'
						onClick={() => setExpanded(!expanded)}
					/>
					<Navbar.Collapse
						className='colapse'
						id='responsive-navbar-nav'
						placement='left'
						onClick={handleNavLinkClick}>
						<Nav className='menu bg-dark allnav'>
							<NavLink
								className='btnnav'
								to='/home'
								onClick={handleNavLinkClick}>
								<i className='iconavbar bi bi-house-fill'></i>
								Home
							</NavLink>
							<NavLink
								className='btnnav'
								to='/especialidad'
								onClick={handleNavLinkClick}>
								<i className='iconavbar bi bi-server'></i>
								Areas de Actuacion
							</NavLink>
							<NavLink
								className='btnnav'
								to='/nosotros'
								onClick={handleNavLinkClick}>
								<i className='iconavbar bi bi-file-person-fill'></i>
								Quienes Somos
							</NavLink>
							<NavLink
								className='btnnav'
								to='/contact'
								onClick={handleNavLinkClick}>
								<i className='iconavbar bi bi-chat-square-text-fill'></i>
								Contacto
							</NavLink>
							<NavLink
								className='btnnav'
								to='/interes'
								onClick={handleNavCollapse}>
								<i className='iconavbar bi bi-browser-safari'></i>
								Sitios de interes
							</NavLink>
							<NavLink
								className='btnnav'
								to='/adminusu'
								onClick={handleNavCollapse}>
								<i className='iconavbar bi bi-person-fill-check'></i>
								Panel de Usuarios
							</NavLink>
							<div className='botones'>
								<p className='estadolog'>
									Estas logueado como: {estadoLogin}
								</p>
									<Link to='/login' disabled={!!user} className='botonnavlog'>
										<i className='iconavbar bi bi-box-arrow-in-right'></i>
										Inicia sesion
									</Link>
								<Link to='/registro' disabled={!!user} className='botonnavreg'>
										<i className='iconavbar bi bi-r-circle-fill'></i>
										Registrarme
									</Link>
							</div>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
};
