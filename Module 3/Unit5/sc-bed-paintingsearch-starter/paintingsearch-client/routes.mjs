import error from './src/handlers/error.mjs';
import main from './src/handlers/main.mjs';

export default (app) => {
    // Main Routes
    app.get('/', main.home);

    // Error handling
    app.use(error.notFound);
    app.use(error.serverError); 
};

