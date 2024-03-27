import GameDataProvider from "../../services/GameDataProvider.js";
import CharacterShow from "./CharacterShow.js";

export default class Favorites {
    charactersPerPage = 3;
    currentPage = 1;
    async render () {
        let characters = await GameDataProvider.fetchFavorites();
        const charactersForPage = characters.slice((this.currentPage - 1) * this.charactersPerPage, this.currentPage * this.charactersPerPage);
        let skins = await Promise.all(charactersForPage.map(character => character.niveau > 0 ? GameDataProvider.findSkinByIdAndLevel(character.id, character.niveau) : null));
        let equipments = await Promise.all(charactersForPage.map(character => character.niveau > 0 ? GameDataProvider.findEquipmentsByCharacterIdAndLevel(character.id, character.niveau) : []));
        let view =  /*html*/`
            <h2>Personnages favoris</h2>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                ${ charactersForPage.map((character, index) => 
                    /*html*/`
                    <div class="col">
                        <div class="card shadow-sm">
                            <img loading="lazy" class="bd-placeholder-img card-img-top" src="${character.niveau > 0 && skins[index] ? skins[index].image : character.image}" alt="${character.nom}" />
                            <div class="card-body">
                                <p class="card-text">${character.niveau > 0 && skins[index] ? skins[index].nom : character.nom}</p>
                                <p class="card-text">${character.role}</p>
                                <p class="card-text">
                                    <div style="display: flex; justify-content: space-between;">
                                        Niveau : ${character.niveau}
                                        <div class="heart-icon" data-id="${character.id}" style="cursor: pointer; user-select: none; fill: red;">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px;">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-secondary view-button" data-id="${character.id}">Voir ${character.nom}</button>
                                    </div>
                                </div>
                            </div>
                            <div class="equipments d-flex flex-wrap justify-content-around">
                                ${equipments[index].map(equipment => 
                                    /*html*/`
                                    <div class="equipment">
                                        <img loading="lazy" style="width: 5vw; height: 10vh;" src="${equipment.image}" alt="${equipment.nom}" />
                                        <p>${equipment.nom}</p>
                                    </div>
                                    `
                                ).join('\n ')}
                            </div>
                        </div>
                    </div>
                    `
                    ).join('\n ')
                }
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
                <button class="btn btn-outline-secondary" id="previous-button" ${this.currentPage === 1 ? 'disabled' : ''}>Précédent</button>
                <span>Page ${this.currentPage}</span>
                <button class="btn btn-outline-secondary" id="next-button" ${this.currentPage === Math.ceil(characters.length / this.charactersPerPage) ? 'disabled' : ''}>Suivant</button>
            </div>
        `
        return view
    }

    async afterRender() {
        const viewButtons = document.querySelectorAll('.view-button');
        viewButtons.forEach(button => button.addEventListener('click', this.viewCharacter));
    
        const heartIcons = document.querySelectorAll('.heart-icon');
        heartIcons.forEach(icon => icon.addEventListener('click', this.toggleFavorite));

        const previousButton = document.querySelector('#previous-button');
        previousButton.addEventListener('click', async () => {
            --this.currentPage;
            const content = document.querySelector('#content');
            content.innerHTML = await this.render();
            await this.afterRender();
        });

        const nextButton = document.querySelector('#next-button');
        nextButton.addEventListener('click', async () => {
            ++this.currentPage;
            const content = document.querySelector('#content');
            content.innerHTML = await this.render();
            await this.afterRender();
        });
    }
    
    viewCharacter = async (event) => {
        event.preventDefault();
        const id = event.target.dataset.id;
        const characterShow = new CharacterShow(id);
        window.location.hash = `/${id}`;
        const content = document.querySelector('#content');
        content.innerHTML = await characterShow.render();
    }

    toggleFavorite = async (event) => {
        event.preventDefault();
        const id = event.target.closest('.heart-icon').dataset.id;
        const heartIcon = event.target.closest('.heart-icon').querySelector('svg');
        if (GameDataProvider.isFavorite(id)) {
            heartIcon.style.fill = 'none';
            await GameDataProvider.removeFavorite(id);
        } else {
            heartIcon.style.fill = 'red';
            await GameDataProvider.addFavorite(id);
        }
    }
}