import { Navigate, useNavigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
	let isLogged = localStorage.getItem(true);

	if (!isLogged) {
		return <Navigate to='/' />;
	}

	return <Outlet />;
};
export default PrivateRoute;
