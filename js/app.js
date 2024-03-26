import AllCharacters from "./views/pages/AllCharacters.js";
import Error404 from './views/pages/Error404.js';
import Home from './views/pages/Home.js';
import CharacterShow from './views/pages/CharacterShow.js';

import Utils from './services/Utils.js';

const routes = {
    '/': Home,
    '/characters': AllCharacters,
    '/characters/:id': CharacterShow
};

const router = async () => {
    const content = null || document.querySelector('#content');

    let request = Utils.parseRequestURL()

    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '');

    let Page = routes[parsedURL] ? routes[parsedURL] : Error404;
    let page = request.id ? new Page(request.id) : new Page;
    
    content.innerHTML = await page.render();
    if (page.afterRender) await page.afterRender();
}

window.addEventListener('hashchange', router);

window.addEventListener('load', router);
