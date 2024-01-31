import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const PrivateRoute = () => {
	const {user, isLoading, isAuthenticated } = useAuth();

	
	if (!isLoading && !isAuthenticated) return <Navigate to='/login' />;

	return <Outlet />;
};

export default PrivateRoute;
