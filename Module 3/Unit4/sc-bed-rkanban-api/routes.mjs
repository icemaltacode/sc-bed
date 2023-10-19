import cors from 'cors';
import item from './handlers/item.mjs';

const corsOptions = {
    'origin': 'http://localhost:3000',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204
};

export default (app) => {
    app.options('*', cors(corsOptions));
    app.get('/api/items', cors(corsOptions), item.getItems);
    app.put('/api/item', cors(corsOptions), item.upsertItem);
};

