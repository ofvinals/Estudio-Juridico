import { Router } from 'express';
import { google} from 'googleapis';
import { config } from 'dotenv';

config();
const router = Router();

const GOOGLE_CLIENT_ID =
	'1050424447842-ekhv37d2lp8shcg8imrsbik8rrrerqh7.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const REFRESH_TOKEN =
	'1//0hfmD-SYqC5jhCgYIARAAGBESNwF-L9Ir1QqcCTLO3xDrdqk2HbxyXDgvzkArFBxONTu5HNPfCbteRHjLgRSKvlxWOXOWm7EJIa8';

const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	'postmessage'
);

router.post('/create-tokens', async (req, res) => {
	try {
		const { code } = req.body;
		const { tokens } = await oauth2Client.getToken(code);
		res.send(tokens);
	} catch (error) {
		console.error('Error al obtener tokens:', error.message);
	}
});

router.post('/create-event', async (req, res, next) => {
	try {
		console.log('Received create-event request:', req.body);
		const { summary, description, startDateTime, endDateTime, location } =
			req.body;
		console.log('Solicitud recibida para create-event:', req.body);
		oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
		const calendar = google.calendar('V3');
		const response = await calendar.events.insert({
			auth: oauth2Client,
			calendarID:
				'365fa9c4ffc2a2c85cd2d4c3e28942427e52a6a2a6d92386566dbe9ada6d50fe@group.calendar.google.com',
			requestBody: {
				summary: summary,
				description: description,
				location: location,
				colorId: '6',
				start: {
					dateTime: new Date(startDateTime),
				},
				end: {
					dateTime: new Date(endDateTime),
				},
			},
		});
		res.send(response);
	} catch (error) {
		console.error('Error al manejar la solicitud de create-event:', error);
		res.status(500).json({
			success: false,
			message: 'Error interno del servidor',
		});
	}
});
export default router;
