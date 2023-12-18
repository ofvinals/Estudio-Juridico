import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const PrivateRoute = () => {
	const auth = useAuth();

	const isAuth = !!auth.user;
console.log (isAuth)
	return isAuth ? <Outlet /> : <Navigate to='/login' />;
};
export default PrivateRoute;
