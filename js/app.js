import AllCharacters from "./views/pages/AllCharacters.js";
import Error404 from './views/pages/Error404.js';
import Home from './views/pages/Home.js';

import Utils from './services/Utils.js';

const routes = {
    '/': Home,
    '/characters': AllCharacters
};

const router = async () => {
    const content = null ||document.querySelector('#content');

    let request = Utils.parseRequestURL()

    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '');

    let page = routes[parsedURL] ? new routes[parsedURL] : Error404
    
    content.innerHTML = await page.render();
}


window.addEventListener('hashchange', router);

window.addEventListener('load', router);
