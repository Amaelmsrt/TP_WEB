import GameDataProvider from "../../services/GameDataProvider.js";
import CharacterShow from "./CharacterShow.js";

export default class AllCharacters {
    charactersPerPage = 3;
    currentPage = 1;
    async render (characters = null, search = false) {
        if (!characters) {
            characters = await GameDataProvider.fetchCharacters();
        }
        const charactersForPage = characters.slice((this.currentPage - 1) * this.charactersPerPage, this.currentPage * this.charactersPerPage);
        GameDataProvider.favoritesCharacters = JSON.parse(localStorage.getItem('favoritesCharacters')) || [];
        let skins = await Promise.all(charactersForPage.map(character => character.niveau > 0 ? GameDataProvider.findSkinByIdAndLevel(character.id, character.niveau) : null));
        let equipments = await Promise.all(charactersForPage.map(character => character.niveau > 0 ? GameDataProvider.findEquipmentsByCharacterIdAndLevel(character.id, character.niveau) : []));
        let view =  /*html*/`
        <h2>Tous les personnages</h2>
        <div class="d-flex justify-content-between align-items-center mb-3">
        ${search > 0 ? '<button class="btn btn-primary" id="reset-button" type="button">Retour</button>' : ''}
        <div class="input-group">
            <input type="text" class="form-control" id="search" placeholder="Rechercher un personnage">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" id="search-button" type="button">Rechercher</button>
            </div>
        </div>
        </div>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            ${ charactersForPage.map((character, index) => 
                /*html*/`
                <div class="col">
                    <div class="card shadow-sm">
                        <img class="bd-placeholder-img loading="lazy" card-img-top" src="${character.niveau > 0 && skins[index] ? skins[index].image : character.image}" alt="${character.nom}" />
                        <div class="card-body">
                            <p class="card-text">${character.niveau > 0 && skins[index] ? skins[index].nom : character.nom}</p>
                            <p class="card-text">${character.role}</p>
                            <p class="card-text">
                                <div style="display: flex; justify-content: space-between;">
                                    Niveau : ${character.niveau}
                                    <div class="heart-icon" data-id="${character.id}" style="cursor: pointer; user-select: none;">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="${GameDataProvider.isFavorite(character.id) ? 'red' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px;">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </p>
                            <div class="rating d-flex justify-content-center">
                                ${[1, 2, 3, 4, 5].map(i => 
                                    /*html*/`
                                    <svg data-id="${character.id}" data-rating="${i}" class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${GameDataProvider.getRatingFromLocalStorage(character.id) >= i ? 'yellow' : 'white'}" stroke="black" stroke-width="1" style="width: 35px; height: 35px;">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    `
                                ).join('\n')}
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <div class="btn-group">
                                <button class="btn btn-sm btn-outline-secondary view-button" data-id="${character.id}">Voir ${character.nom}</button>
                                <button class="btn btn-sm btn-outline-secondary upgrade-button" data-id="${character.id}">Améliorer</button>
                                <button class="btn btn-sm btn-outline-secondary reset-button" data-id="${character.id}">Réinitialiser</button>
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
            <span>Page ${this.currentPage} / ${Math.ceil(characters.length / this.charactersPerPage)}</span>
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

        const upgradeButtons = document.querySelectorAll('.upgrade-button');
        upgradeButtons.forEach(button => button.addEventListener('click', this.upgradeCharacter));

        const resetButtons = document.querySelectorAll('.reset-button');
        resetButtons.forEach(button => button.addEventListener('click', this.resetCharacter));

        const searchButton = document.querySelector('#search-button');
        searchButton.addEventListener('click', this.searchCharacters);

        const resetButton = document.querySelector('#reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', async () => {
                const content = document.querySelector('#content');
                content.innerHTML = await this.render();
                await this.afterRender();
            });
        }

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

        const starIcons = document.querySelectorAll('.star-icon');
        starIcons.forEach(icon => icon.addEventListener('click', this.rateCharacter));

    }
    
    viewCharacter = async (event) => {
        event.preventDefault();
        const id = event.target.dataset.id;
        const characterShow = new CharacterShow(id);
        window.location.hash = `/characters/${id}`;
        const content = document.querySelector('#content');
        content.innerHTML = await characterShow.render();
    }

    toggleFavorite = async (event) => {
        event.preventDefault();
        const id = event.target.closest('.heart-icon').dataset.id;
        const heartIcon = event.target.closest('.heart-icon').querySelector('svg');
        if (GameDataProvider.isFavorite(id)) {
            await GameDataProvider.removeFavorite(id);
        } else {
            await GameDataProvider.addFavorite(id);
        }
        heartIcon.style.fill = GameDataProvider.isFavorite(id) ? 'red' : 'none';
    }

    upgradeCharacter = async (event) => {
        event.preventDefault();
        const id = event.target.dataset.id;
        await GameDataProvider.upgradeCharacter(id);
        const content = document.querySelector('#content');
        content.innerHTML = await this.render();
        await this.afterRender();
    }

    resetCharacter = async (event) => {
        event.preventDefault();
        const id = event.target.dataset.id;
        await GameDataProvider.resetCharacter(id);
        const content = document.querySelector('#content');
        content.innerHTML = await this.render();
        await this.afterRender();
    }

    searchCharacters = async () => {
        const searchValue = document.querySelector('#search').value;
        const filteredCharacters = await GameDataProvider.searchCharacters(searchValue);
        const content = document.querySelector('#content');
        content.innerHTML = await this.render(filteredCharacters, true);
        await this.afterRender();
    }

    rateCharacter = async (event) => {
        event.preventDefault();
        const svgElement = event.target.closest('svg.star-icon');
        const id = svgElement.dataset.id;
        const rating = svgElement.dataset.rating;
        await GameDataProvider.setRating(id, rating);
        const content = document.querySelector('#content');
        content.innerHTML = await this.render();
        await this.afterRender();
    }
}