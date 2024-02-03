import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Header.css';
import Swal from 'sweetalert2';

export const Header = () => {
	const [estadoLogin, setEstadoLogin] = useState('');
	const [expand, setExpand] = useState(false);
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();
	const user = currentUser ? currentUser.email : null;

	useEffect(() => {
		if (!user) {
			setEstadoLogin('No hay usuario logueado');
		} else {
			setEstadoLogin(user);
		}
	}, [user]);

	const handleNavCollapseToggle = () => {
		setExpand(true);
	};

	const handleNavCollapse = () => {
		setExpand(false);
	};

	const handleLogOut = async () => {
		await logout();
		Swal.fire({
			icon: 'success',
			title: 'Su sesion fue cerrada!',
			showConfirmButton: false,
			timer: 1500,
		});
		navigate('/home');
	};

	return (
		<>
			<Navbar bg='dark' data-bs-theme='dark' expand='xxl' className='mb-3'>
				<Container className='-d-flex flex-column justify-content-center'>
					<Navbar.Brand href='/home'><img className='ms-3'
								src='/logo estudio.png'
								width={40}
								alt='logoestudio'
							/></Navbar.Brand>
					<h1 className='offcanvas-title align-content-center'>
						Estudio Juridico Posse & Asociados
					</h1>

					<Navbar.Toggle
						aria-controls={`offcanvasNavbar-expand-xxl`}
						onClick={handleNavCollapseToggle}
					/>
					<Navbar.Offcanvas
						id={`offcanvasNavbar-expand-xxl`}
						bg='dark'
						data-bs-theme='dark'
						show={expand}
						onHide={() => setExpand(false)}
						aria-labelledby={`offcanvasNavbarLabel-expand-xxl`}
						placement='end'>
						<Offcanvas.Header closeButton>
							<Offcanvas.Title id={`offcanvasNavbarLabel-expand-xxl`}>
								Menu
							</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body>
							<Nav className='barranav'>
								<Link
									className='btnnav'
									to='/home'
									onClick={handleNavCollapse}>
									<i className='iconavbar bi bi-house-fill'></i>
									Home
								</Link>
								<Link
									className='btnnav'
									to='/especialidad'
									onClick={handleNavCollapse}>
									<i className='iconavbar bi bi-server'></i>
									Areas de Actuacion
								</Link>
								<Link
									className='btnnav'
									to='/nosotros'
									onClick={handleNavCollapse}>
									<i className='iconavbar bi bi-file-person-fill'></i>
									Quienes Somos
								</Link>
								<Link
									className='btnnav'
									to='/contact'
									onClick={handleNavCollapse}>
									<i className='iconavbar bi bi-chat-square-text-fill'></i>
									Contacto
								</Link>
								<Link
									className='btnnav'
									to='/interes'
									onClick={handleNavCollapse}>
									<i className='iconavbar bi bi-browser-safari'></i>
									Sitios de interes
								</Link>
								<Link
									className='btnnav'
									to='/adminusu'
									onClick={handleNavCollapse}>
									<i className='iconavbar bi bi-person-fill-check'></i>
									Panel de Usuarios
								</Link>
								{user === 'ofvinals@gmail.com' || user === 'estudioposseyasociados@gmail.com' ? (
									<Link
										className='btnnav'
										to='/admin'
										onClick={handleNavCollapse}>
										<i className='iconavbar bi bi-person-fill-gear'></i>
										Panel de Administracion
									</Link>
								):null}
								<div className='botones'>
									<p className='estadolog'>
										Estas logueado como: {estadoLogin}
									</p>
									{user ? (
										<button
											onClick={(e) => {handleNavCollapse(); handleLogOut()}}
											className='botonlogout'>
											<i className='iconavbar bi bi-box-arrow-left'></i>
											Cerrar Sesión
										</button>
									) : (
										<Link
											to='/login'
											onClick={handleNavCollapse}
											className='botonnavlog'>
											<i className='iconavbar bi bi-box-arrow-in-right'></i>
											Iniciar Sesión
										</Link>
									)}
									<Link
										to='/registro'
										className={`botonnavreg ${
											user ? 'regdisable' : ''
										}`}
										onClick={(e) => {
											handleNavCollapse();
										}}>
										<i className='iconavbar bi bi-r-circle-fill'></i>
										Registrarme
									</Link>
								</div>
							</Nav>
						</Offcanvas.Body>
					</Navbar.Offcanvas>
				</Container>
			</Navbar>
		</>
	);
};
