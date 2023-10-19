// Dependencies
import express from 'express';
import bodyParser from 'body-parser';
import esMain from 'es-main';
import routes from './routes.mjs';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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