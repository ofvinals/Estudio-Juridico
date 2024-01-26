import { useState, useEffect, createContext, useContext } from 'react';
import {
	registerRequest,
	loginRequest,
	verifyTokenRequest,
} from '../src/api/auth.js';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const GoogleContext = createContext();

// funcion que retorna el contexto del objeto creado por useContext
export const useGoogle = () => {
	const context = useContext(GoogleContext);
	if (!context) {
		throw new Error('Error, no creaste el contexto!');
	}
	return context;
};

export const GoogleProvider = ({ children }) => {
	const loginWithGoogle = useGoogleLogin({
		flow: 'auth-code',
		onSuccess: async (codeResponse) => {
			console.log('codeResponse:', codeResponse);
			const tokens = await axios.post(
				'http://localhost:4000/api/create-tokens',
				{
					code: codeResponse.code,
				}
			);
			console.log(tokens);
			setIsAuthenticated(true);
			setUser(tokens.data);
			const accessToken = tokens.data.access_token;
			const userProfileResponse = await axios.get(
				'https://www.googleapis.com/oauth2/v2/userinfo',
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			const userEmail = userProfileResponse.data.email;
			console.log(userEmail);
		},
		onError: (errorResponse) => console.log(errorResponse),
	});

	return (
		<GoogleContext.Provider
			value={{
				loginWithGoogle,
			}}>
			{children}
		</GoogleContext.Provider>
	);
};
export default GoogleContext;
