import GameDataProvider from "../../services/GameDataProvider.js";

export default class CharacterShow {
    constructor(id) {
        this.id = id;
    }

    async render () {
        const character = await GameDataProvider.fetchCharacter(this.id);
        let view =  /*html*/`
        <button onClick="window.history.back()" class="btn btn-primary" style="position: absolute; top: 5rem; left: 2rem; position: fixed; background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border: none; border-radius: 12px; box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);">Retour</button>
            <h2>${character.nom}</h2>
        `;

        for (let niveau = 0; niveau <= 2; niveau++) {
            const skin = await GameDataProvider.findSkinByIdAndLevel(character.id, niveau);
            const equipments = await GameDataProvider.findEquipmentsByCharacterIdAndLevel(character.id, niveau);
            view += /*html*/`
                <div class="card shadow-sm">
                    <img style="width: 25vw; height: 25vh;" class="bd-placeholder-img card-img-top" src="${skin ? skin.image : character.image}" alt="${skin ? skin.nom : character.nom}" />
                    <div class="card-body">
                        <p class="card-text">${skin ? skin.nom : character.nom}</p>
                        <p class="card-text">${character.role}</p>
                        <p class="card-text">Niveau : ${niveau}</p>
                        <div class="equipments d-flex flex-wrap justify-content-around">
                            ${equipments.map(equipment => 
                                /*html*/`
                                <div class="equipment">
                                    <img style="width: 10vw; height: 15vh;" src="${equipment.image}" alt="${equipment.nom}" />
                                    <p>${equipment.nom}</p>
                                </div>
                                `
                            ).join('\n ')}
                        </div>
                    </div>
                </div>
            `;
        }

        return view;
    }
}