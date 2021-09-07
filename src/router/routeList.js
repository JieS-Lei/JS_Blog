const routeList = [
    {
        path: '/',
        name: 'Home',
    },
    {
        path: '/blog/:id?',
        name: 'Blog',
    },
    {
        path: '/message',
        name: 'Message',
    },
    {
        path: '/diary',
        name: 'Diary',
    },
    {
        path: '/links',
        name: 'Links',
    },
    {
        path: '/about',
        name: 'About',
    },
    {
        path: '/article/:id',
        name: 'Article',
    },
    {
        path: '*',
        name: '404',
    },
]

export default routeList