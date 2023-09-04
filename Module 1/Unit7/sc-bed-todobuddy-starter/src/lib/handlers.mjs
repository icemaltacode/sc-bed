export function home(req, res) {
    res.render('home', { 
        currentPage: 'home', 
        colorMode: req.cookies.color_mode, 
        todos: req.session.TODO_LIST ?? []
    });
}

export function colorMode(req, res) {
    res.cookie('color_mode', req.params.mode, {maxAge: 30 * 24 * 60 * 60 * 1000});
    res.redirect(req.get('referer'));
}

export function notFound(req, res) {
    res.render('404');
}

export function serverError(err, req, res) {
    res.render('500');
}

export const todoApi = {
    add: (req, res) => {
        const TODO_LIST = req.session.TODO_LIST ?? [];
        const content = req.body.content;
        TODO_LIST.push({
            'content': content,
            'completed': false
        });
        req.session.TODO_LIST = TODO_LIST;
        res.sendStatus(201);
    },
    toggle: (req, res) => {
        const TODO_LIST = req.session.TODO_LIST ?? [];

        const id = req.params.id;
        if (isNaN(id) ) res.sendStatus(400);
        if (TODO_LIST.length === 0 || id > TODO_LIST.length - 1) res.sendStatus(404);
        
        const TODO_ITEM = TODO_LIST[id];
        TODO_ITEM.completed = !TODO_ITEM.completed;
        req.session.TODO_LIST = TODO_LIST;
        res.sendStatus(202);
    }
}

export default {
    home,
    colorMode,
    todoApi,
    notFound,
    serverError
}