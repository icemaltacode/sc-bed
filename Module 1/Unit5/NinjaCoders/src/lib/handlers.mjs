import { getTagline } from './tagline.mjs';

export function home(req, res) {
    res.render('home');
}

export function about(req, res) {
    res.render('about', { tagline: getTagline() });
}

export function notFound(req, res) {
    res.render('404');
}

export function serverError(err, req, res) {
    res.render('500');
}
