import { v2 as cloudinary } from 'cloudinary';
import {
	CLOUDINARY_NAME,
	CLOUDINARY_KEY,
	CLOUDINARY_SECRET,
} from '../src/config.js';

cloudinary.config({
	cloud_name: CLOUDINARY_NAME,
	api_key: CLOUDINARY_KEY,
	api_secret: CLOUDINARY_SECRET,
	secure: true,
});

export async function uploadFile(filePath) {
	console.log('File path:', filePath);
	return await cloudinary.uploader.upload(filePath, {
		folder: 'replit',
	});
}
