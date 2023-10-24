import api from './src/handlers/api.mjs';
import cors from 'cors';

const corsOptions = {
    'origin': 'http://admin.ninjacoders.local:3000',
    'credentials': true,
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204
};

export default (apiRoute) => {
    // CORS
    apiRoute.options('*', cors(corsOptions));

    // JWT
    apiRoute.get('/token', cors(corsOptions), api.getToken);
    apiRoute.patch('/token/refresh', cors(corsOptions), api.refreshToken);

    // Showcase API
    apiRoute.get('/showcase', cors(corsOptions), api.getShowcases);
    apiRoute.get('/showcase/:id', cors(corsOptions), api.getShowcase);
    apiRoute.put('/showcase', cors(corsOptions), api.upsertShowcase);
    apiRoute.delete('/showcase/:id', cors(corsOptions), api.deleteShowcase);  
};