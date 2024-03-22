import Utils        from '../../services/Utils.js';
import GameDataProvider from '../../services/GameDataProvider.js';

export default class postShow {
    async render() {
        let request = Utils.parseRequestURL();
        let post = await GameDataProvider.fetchpost(request.id);

        return /*html*/`
        <div class="card shadow-sm">
        <img class="bd-placeholder-img card-img-top" src="${post.image}" alt="${post.nom}" />
        <div class="card-body">
            <p class="card-text">${post.nom}</p>
            <p class="card-text">${post.role}</p>
            <p class="card-text">Niveau : ${post.niveau}</p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                <button class="btn btn-sm btn-outline-secondary upgrade-button" data-id="${post.id}">Améliorer</button>
                </div>
                <small class="text-body-secondary">${post.id}</small>
            </div>
        </div>
    </div>
        `;
    }
}