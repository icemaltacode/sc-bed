const getSocialLinks = () => [
    {
        url: 'https://www.facebook.com/keithv',
        imagePath: 'assets/fb_icon.png',
        altText: 'Facebook Profile',
        title: 'Facebook',
    },
    {
        url: 'https://www.instagram.com/vassallo.keith/',
        imagePath: 'assets/insta_icon.png',
        altText: 'Instagram Profile',
        title: 'Instagram',
    },
    {
        url: 'https://mt.linkedin.com/in/keithvassallo',
        imagePath: 'assets/linkedin_icon.png',
        altText: 'LinkedIn Profile',
        title: 'LinkedIn',
    },
];

export const socialMiddleware = (req, res, next) => {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.socialContext = getSocialLinks();
    next();
};
