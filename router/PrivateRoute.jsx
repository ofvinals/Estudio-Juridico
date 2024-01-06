import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const PrivateRoute = () => {
	const {user, loading, isAuthenticated } = useAuth();

	if (loading) return
	<h1>Cargando...</h1>;
	if (!loading && !isAuthenticated) return <Navigate to='/login' replace />;

	return <Outlet />;
};

export default PrivateRoute;
