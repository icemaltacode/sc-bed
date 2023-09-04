import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import esMain from 'es-main';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';

import handlers from './src/lib/handlers.mjs';
import credentials from './config.mjs';

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
        },
        ifeq: function(arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
}));

// Routes
app.get('/', handlers.home);
app.get('/colormode/:mode', handlers.colorMode);

app.post('/todos', handlers.todoApi.add);
app.put('/todos/:id', handlers.todoApi.toggle);

app.use(handlers.notFound);
app.use(handlers.serverError); 

if (esMain(import.meta)) {
    app.listen(port, () =>
        console.log(
            `Express started on http://localhost:${port}; ` +
        'press Ctrl-C to terminate.'
        )
    );
}

export default app;