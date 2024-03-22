import GameDataProvider from "../../services/GameDataProvider.js";

export default class AllCharacters {
    constructor() {
        this.upgradeCounter = 0;
    }

    async render () {
        let characters = await GameDataProvider.fetchCharacters();
        let skins = await Promise.all(characters.map(character => character.niveau > 0 ? GameDataProvider.findSkinByIdAndLevel(character.id, character.niveau) : null));
        let view =  /*html*/`
            <h2>Tous les personnages</h2>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                ${ characters.map((character, index) => 
                    /*html*/`
                    <div class="col">
                    <div class="card shadow-sm">
                    <img class="bd-placeholder-img card-img-top" src="${character.niveau > 0 && skins[index] ? skins[index].image : character.image}" alt="${character.nom}" />
                        <div class="card-body">
                            <p class="card-text">${character.niveau > 0 && skins[index] ? skins[index].nom : character.nom}</p>
                            <p class="card-text">${character.role}</p>
                            <p class="card-text">Niveau : ${character.niveau}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                <a href="#/characters/${character.id}" class="btn btn-sm btn-outline-secondary">Voir ${character.nom}</a>
                                <button class="btn btn-sm btn-outline-secondary upgrade-button" data-id="${character.id}">Améliorer</button>
                                </div>
                                <small class="text-body-secondary">${character.id}</small>
                            </div>
                        </div>
                    </div>
                    </div>
                    `
                    ).join('\n ')
                }
            </div>
        `
        return view
    }
}