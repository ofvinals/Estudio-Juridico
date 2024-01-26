import React, { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../src/context/AuthContext';




export const createEvents = async (e) => {
   e.preventDefault();
   try {
      const response = await axios.post(
         'http://localhost:4000/api/create-event',
         {
            summary,
            description,
            startDateTime,
            endDateTime,
            location,
         }
      );
      console.log(response.data);

   } catch (error) {
      console.error('Error handling create-event request:', error);

      };
   }