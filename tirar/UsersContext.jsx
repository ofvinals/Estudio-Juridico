import { createContext, useContext, useState } from 'react';
import {
	createUserRequest,
	deleteUserRequest,
	getUsersRequest,
	getUserRequest,
	updateUserRequest,
} from '../src/api/users';

const UserContext = createContext();

export const useUsers = () => {
	const context = useContext(UserContext);
	if (!context) throw new Error('useUsers must be used within a UserProvider');
	return context;
};

export function UserProvider({ children }) {
	const [users, setUsers] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const getUsers = async () => {
		try {
			const res = await getUsersRequest();
			setUsers(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const deleteUser = async (id) => {
		try {
			const res = await deleteUserRequest(id);
			if (res.status === 204) console.log(res);
			setUsers((users) => users.filter((user) => user._id !== id));
			await getUsers();
		} catch (error) {
			console.log(error);
		} finally {
			// Llama a getUsers independientemente de si hubo éxito o error, con un retardo
			setTimeout(async () => {
				await getUsers();
			}, 100);
		}
	};

	const createUser = async (user) => {
		try {
			const res = await createUserRequest(user);
			console.log(res.data);
			setIsAuthenticated(true);
			setUsers(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const getUser = async (id) => {
		try {
			const res = await getUserRequest(id);
			setUsers(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const updateUser = async (id, user) => {
		try {
			await updateUserRequest(id, user);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<UserContext.Provider
			value={{
				users,
				getUsers,
				deleteUser,
				createUser,
				getUser,
				updateUser,
			}}>
			{children}
		</UserContext.Provider>
	);
}
