import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

export const authContext = createContext();

export function AuthContextProvider({ children }) {
	// almacena si esta iniciada sesion con login
	const [isAutheticated, setIsAuthenticated] = useState(
		window.localStorage.getItem('usuarios') ?? false
	);
	// actualiza localstorage y provocar render con valor del login
	const login = useCallback(function () {
		window.localStorage.setItem('usuarios', true);
		setIsAuthenticated(true);
	}, []);
	// elimnia item localstorage y false en autenticated
	const logout = useCallback(function () {
		window.localStorage.setItem('usuarios');
		setIsAuthenticated(false);
	}, []);
	// valor de la funcion de login, logout y autenticated para que objetos accedan
	const value = useMemo(
		() => ({
			login,
			logout,
			isAutheticated,
		}),
		[login, logout, isAutheticated]
	);
	return <AuthContextProvider value={value}>{children}</AuthContextProvider>;
}

AuthContextProvider.propTypes = {
	children: PropTypes.objetct,
};

export function useAuthContext() {
	return useContext(authContext);
}
