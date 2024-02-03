import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const PrivateRoute = () => {
	const { isLoading, isAuthenticated } = useAuth();

	if (isLoading) {
		return <div>Cargando...</div>;
	}

	if (!isAuthenticated) return <Navigate to='/login' />;

	return <Outlet />;
};

export default PrivateRoute;
