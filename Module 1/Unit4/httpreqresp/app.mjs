import express from 'express';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import catNames from 'cat-names';
import bodyParser from 'body-parser';
const app = express()

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// the following is needed for cookie support
app.use(cookieParser());
// the following is needed for session support
app.use(session({ resave: false, saveUninitialized: false, secret: 'keyboard cat' }));

// see the views/greeting.hbs file for the contents of this view
app.get('/greeting', (req, res) => {
  res.render('greeting', {
    message: 'Hello esteemed programmer!',
    style: req.query.style,
    userid: req.cookies.userid,
    username: req.session.username
  })
});

app.get('/set-random-userid', (req, res) => {
  res.cookie('userid', (Math.random()*10000).toFixed(0))
  res.redirect('/greeting')
})

app.get('/set-random-username', (req, res) => {
  req.session.username = catNames.random()
  res.redirect('/greeting')
})

// see the views/about.hbs file for the contents of this view
app.get('/about', (req, res) => {
  res.render('about')
});

app.get('/error', (req, res) => res.status(500).render('error'));

app.get('/no-layout', (req, res) =>
  res.render('no-layout', { layout: null })
);

app.get('/custom-layout', (req, res) =>
  res.render('custom-layout', { layout: 'custom' })
);

app.get('/text', (req, res) => {
  res.type('text/plain')
  res.send('this is a test')
});

app.get('/reallybad', (req, res) => {
  // we're going to simulate something bad happening in our code....
  throw new Error("that didn't go well!")
});

// BASIC FORM PROCESSING

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/basicform', (req, res) => res.render('basicform'));

app.post('/process-form', (req, res) => {
  console.log(`received contact from ${req.body.name} <${req.body.email}>`)
  res.redirect(303, '/thanks')
});

app.get('/thanks', (req, res) => res.render('thanks'));

// END BASIC FORM PROCESSING


// ROBUST FORM PROCESSING

// this is necessary to parse form responses
app.use(bodyParser.json());

app.get('/contact-error', (req, res) => res.render('contact-error'));
app.get('/robustform', (req, res) => res.render('robustform'));

app.post('/process-robustform', (req, res) => {
  try {
    // here's where we would try to save contact to database or other
    // persistence mechanism...for now, we'll just simulate an error
    if(req.body.simulateError) throw new Error("error saving contact!")
    console.log(`contact from ${req.body.name} <${req.body.email}>`)
    res.format({
      'text/html': () => res.redirect(303, '/thanks'),
      'application/json': () => res.json({ success: true }),
    })
  } catch(err) {
    // here's where we would handle any persistence failures
    console.error(`error processing contact from ${req.body.name} ` +
      `<${req.body.email}>`)
    res.format({
      'text/html': () =>  res.redirect(303, '/contact-error'),
      'application/json': () => res.status(500).json({
        error: 'error saving contact information' }),
    })
  }
})

// END ROBUST FORM PROCESSING

// API HANDLING

const projects = [
  { id: 0, name: 'Super Mario iOS Clone', author: 'Horace Grech' },
  { id: 1, name: 'Screen Reader for Gnome', author: 'Alice Silverman' },
]

app.get('/api/projects', (req, res) => {
  const projectXml = '<?xml version="1.0"?><projects>' +
    projects.map(p =>
      `<project author="${p.author}" id="${p.id}">${p.name}</project>`
    ).join('') + '</projects>'
  const projectText = projects.map(p =>
      `${p.id}: ${p.name} (${p.author})`
    ).join('\n')
  res.format({
    'application/json': () => res.json(projects),
    'application/xml': () => res.type('application/xml').send(projectXml),
    'text/xml': () => res.type('text/xml').send(projectXml),
    'text/plain': () => res.type('text/plain').send(projectText),
  })
})

app.put('/api/projects/:id', (req, res) => {
  const p = projects.find(p => p.id === parseInt(req.params.id))
  if(!p) return res.status(410).json({ error: 'No such project exists' })
  if(req.body.name) p.name = req.body.name
  if(req.body.author) p.author = req.body.author
  res.json({ success: true })
});

app.delete('/api/projects/:id', (req, res) => {
  const idx = projects.findIndex(project => project.id === parseInt(req.params.id))
  if(idx < 0) return res.json({ error: 'No such project exists.' })
  projects.splice(idx, 1)
  res.json({ success: true })
});

// END API HANDLING


app.get('/', (req, res) => res.send(`
  Check out our "<a href="/about">About</a>" page!<br>
  Check out our "<a href="/error">Error</a>" page.<br>
  Check out our "<a href="/greeting">Greeting</a>" page.<br>
  Check out our "<a href="/no-layout">No Layout</a>" page.<br>
  Check out our "<a href="/custom-layout">Custom Layout</a>" page.<br>
  Check out our "<a href="/text">Plan Text</a>" page.<br>
  Click <a href="/doesnotexist">here</a> to generate a 404 error.<br>
  Click <a href="/reallybad">here</a> to generate a 500 error.<br>
  Check out our "<a href="/basicform">Basic Form</a>" page.<br>
  Check out our "<a href="/robustform">Robust Form</a>" page.<br>
  Check out our "<a href="/api/projects">Projects API</a>" page.<br>
`));

app.use((req, res) =>
  res.status(404).render('404')
);

app.use((err, req, res, next) => {
  console.error('** SERVER ERROR: ' + err.message)
  res.status(500).render('500', { message: "you shouldn't have clicked that!" })
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/\n`))