import AllCharacters from "./views/pages/AllCharacters.js";
import Error404 from './views/pages/Error404.js';
import Home from './views/pages/Home.js';
import CharacterShow from './views/pages/CharacterShow.js';
import Favorites from './views/pages/Favorites.js';

import Utils from './services/Utils.js';

const routes = {
    '/': Home,
    '/characters': AllCharacters,
    '/characters/:id': CharacterShow,
    '/favorites': Favorites
};

const router = async () => {
    const content = null || document.querySelector('#content');

    let request = Utils.parseRequestURL()

    // Ignore les paramètres de requête pour déterminer la page à charger
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '');

    // Supprime les paramètres de requête de parsedURL
    parsedURL = parsedURL.split('?')[0];

    let Page = routes[parsedURL] ? routes[parsedURL] : Error404;
    let page = request.id ? new Page(request.id) : new Page;
    
    content.innerHTML = await page.render();
    if (page.afterRender) await page.afterRender();
}

window.addEventListener('hashchange', router);

window.addEventListener('load', router);