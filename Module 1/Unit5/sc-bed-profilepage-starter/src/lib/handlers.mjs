import { bio } from './bio.mjs';

export function home(req, res) {
    res.render('home', { bio: bio });
}

export function notFound(req, res) {
    res.render('404');
}

export function serverError(err, req, res) {
    res.render('500');
}
