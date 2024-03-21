import GameDataProvider from "../../services/GameDataProvider.js";

export default class AllCharacters {

    async render () {
        let characters = await GameDataProvider.fetchCharacters();
        let view =  /*html*/`
            <h2>Tous les personnages</h2>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                ${ characters.map(character => 
                    /*html*/`
                    <div class="col">
                    <div class="card shadow-sm">
                        <img class="bd-placeholder-img card-img-top" src="${character.image}" alt="${character.nom}" />
                        <div class="card-body">
                            <p class="card-text">${character.role}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                <a href="#/characters/${character.id}" class="btn btn-sm btn-outline-secondary">Voir ${character.nom}</a>
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