import React, { useState, useHistory } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink } from 'react-router-dom';


import '../css/Header.css';

export const Header = () => {
	const [expanded, setExpanded] = useState(false);

	const handleNavCollapse = () => {
		setExpanded(false);
	};
	
	const handleNavLinkClick = () => {
		handleNavCollapse();

	}
	return (
		<div className='bg-dark'>
			<Navbar collapseOnSelect expand='xxl' className='bg-dark' expanded={expanded}
        onSelect={() => setExpanded(false)}>
				<Container className=''>
					<Navbar.Brand as={Link} to='/home'>
						<img
							src='/logo estudio.png'
							width="50px"
							alt='logoestudio'
						/>
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
						placement="end"
						onClick={handleNavLinkClick}
						>
						<Nav className='menu bg-dark'>
							<NavLink
								className='fw-bold linknav'
								to='/home'
								onClick={handleNavLinkClick}>Home
							</NavLink>
							<NavLink
								className='fw-bold linknav '
								to='/especialidad'
								onClick={handleNavLinkClick}>
								Areas de Actuacion
							</NavLink>
							<NavLink
								className='fw-bold linknav '
								to='/nosotros'
								onClick={handleNavLinkClick}>
								Quienes Somos
							</NavLink>
							<NavLink
								className='fw-bold linknav '
								to='/contact'
								onClick={handleNavLinkClick}>
								Contacto
							</NavLink>
							<NavLink
								className='fw-bold linknav '
								to='/interes'
								onClick={handleNavCollapse}>
								Sitios de interes
							</NavLink>

							<div className='botones'>
								<NavLink className='botonnav' to='/login'>
									Mi cuenta
								</NavLink>
								<NavLink className='botonnav' to='/registro'>
									Registrarme
								</NavLink>
							</div>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
};
