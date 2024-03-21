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
                        <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">${character.nom}</text></svg>
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