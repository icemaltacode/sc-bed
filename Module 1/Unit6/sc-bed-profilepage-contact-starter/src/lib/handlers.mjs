import { bio } from './bio.mjs';

export function home(req, res) {
    res.render('home', { bio: bio });
}

export const api = {
    contactFormSend: (req, res) => {
        console.log('Name:', req.body.name);
        console.log('Email:', req.body.email);
        console.log('Message:', req.body.content);
        res.send({ result: 'success' });
    }
}

export function notFound(req, res) {
    res.render('404');
}

export function serverError(err, req, res) {
    res.render('500');
}
