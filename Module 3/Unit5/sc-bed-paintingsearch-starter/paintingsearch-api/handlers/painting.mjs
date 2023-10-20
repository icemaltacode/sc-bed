import credentials from '../config.mjs';
import db from '../db.mjs';

const BASE_URI = "https://6a2an144m5.execute-api.eu-south-1.amazonaws.com/dev/painting";

export const api = {
    async getPaintings(req, res) {
        const searchTerm = req.query.searchTerm;
        
        // Attempt fetch from Redis
        const handledFromCache = await db.getPaintings(searchTerm)
            .then(result => {
                if (!result) return false;
                const response = {
                    paintings: JSON.parse(result),
                    resultSource: 'cache'
                };
                res.json(response);
                return result;
            });

        if (!handledFromCache) {
            // Fetch from API
            fetch(`${BASE_URI}?searchTerm=${searchTerm}`, {
                headers: {
                    'x-api-key': credentials.apiKey,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(result => result.json())
            .then(result => {
                const response = {
                    paintings: result.result,
                    resultSource: 'api'
                };
                db.saveResult(searchTerm, JSON.stringify(response.paintings));
                res.json(response);
            });
        }
    }
};

export default api;