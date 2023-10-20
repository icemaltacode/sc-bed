// Dependencies
import express from 'express';
import esMain from 'es-main';
import routes from './routes.mjs';

const app = express();
const port = process.env.PORT || 3001;

// Routes
routes(app);

process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION\n', err.stack);
    process.exit(1);
});

if (esMain(import.meta)) {
    app.listen(port, () =>
        console.log(
            `Express started in ${app.get('env')} mode on http://localhost:${port}; ` +
        'press Ctrl-C to terminate.'
        )
    );
}

export default app;