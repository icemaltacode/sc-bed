import painting from './handlers/painting.mjs';
import cors from 'cors';

export default (app) => {
    app.get('/api/paintings', cors(), painting.getPaintings);
};