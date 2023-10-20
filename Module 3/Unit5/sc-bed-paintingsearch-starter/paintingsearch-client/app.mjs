// Core imports
import path from 'path';
import { fileURLToPath } from 'url';

// Dependencies
import express from 'express';
import { engine } from 'express-handlebars';
import esMain from 'es-main';

// App Local
import routes from './routes.mjs';

// Setup path handlers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configure Handlebars view engine
app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

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