import { ENDPOINT } from '../config.js'

export default class GameDataProvider {

    static favoritesCharacters = JSON.parse(localStorage.getItem('favoritesCharacters')) || [];

    static fetchCharacters = async () => {
        const options = {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       };
       try {
           const response = await fetch(`${ENDPOINT}/personnages`, options)
           const json = await response.json();
           return json
       } catch (err) {
           console.log('Erreur pour trouver le personnage', err)
       }
    }

    static fetchCharacter = async (id) => {
        const options = {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       };
       try {
           const response = await fetch(`${ENDPOINT}/personnages/${id}`, options)
           const json = await response.json();
           return json
       } catch (err) {
           console.log('Erreur pour trouver le personnage', err)
       }
    }

    static fetchSkins = async () => {
        const options = {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       };
       try {
           const response = await fetch(`${ENDPOINT}/skins`, options)
           const json = await response.json();
           return json
       } catch (err) {
           console.log('Erreur pour trouver le skin', err)
       }
    }

    static fetchEquipments = async () => {
        const options = {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       };
       try {
           const response = await fetch(`${ENDPOINT}/equipements`, options)
           const json = await response.json();
           return json
       } catch (err) {
           console.log('Erreur pour trouver l\'équipement', err)
       }
    }

    static findSkinByIdAndLevel = async (id, level) => {
        const options = {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       };
       try {
            const response = await fetch(`${ENDPOINT}/skins?id_personnage=${id}&niveau=${level}`, options)
           if (!response.ok) {
               throw new Error(`Erreur dans le lien : ${response.status}`);
           }
           const json = await response.json();
           return json[0];
       } catch (err) {
           console.log('Erreur pour trouver le skin', err)
           return null;
       }
    }

    static findEquipmentsByCharacterIdAndLevel = async (id, level) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`${ENDPOINT}/equipements`, options)
            if (!response.ok) {
                throw new Error(`Erreur dans le lien : ${response.status}`);
            }
            const allEquipments = await response.json();
            const equipments = allEquipments.filter(equipment => Number(equipment.id_personnage) === Number(id) && Number(equipment.niveau) <= Number(level));
            return equipments;
        } catch (err) {
            console.log('Erreur pour trouver l\'équipement', err)
            return null;
        }
    }

    static addFavorite = async (id) => {
        const character = await this.fetchCharacter(id);
        this.favoritesCharacters.push(character);
        localStorage.setItem('favoritesCharacters', JSON.stringify(this.favoritesCharacters));
    }

    static removeFavorite = (id) => {
        this.favoritesCharacters = this.favoritesCharacters.filter(character => character.id !== id);
        localStorage.setItem('favoritesCharacters', JSON.stringify(this.favoritesCharacters));
    }

    static isFavorite = (id) => {
        return this.favoritesCharacters.some(character => character.id === id);
    }

    static fetchFavorites = () => {
        return this.favoritesCharacters;
    }

    static upgradeCharacter = async (id) => {
        const character = await this.fetchCharacter(id);
        if (character.niveau < 2) {
            character.niveau++;
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(character)
            };
            try {
                const response = await fetch(`${ENDPOINT}/personnages/${id}`, options)
                if (!response.ok) {
                    throw new Error(`Erreur dans le lien : ${response.status}`);
                }
                return character;
            } catch (err) {
                console.log('Erreur de modification du personnage', err)
                return null;
            }
        }
    }

    static resetCharacter = async (id) => {
        const character = await this.fetchCharacter(id);
        character.niveau = 0;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(character)
        };
        try {
            const response = await fetch(`${ENDPOINT}/personnages/${id}`, options)
            if (!response.ok) {
                throw new Error(`Erreur dans le lien : ${response.status}`);
            }
            return character;
        } catch (err) {
            console.log('Erreur de réinitialisation du personnage', err)
            return null;
        }
    }

    static searchCharacters = async (searchValue) => {
        const characters = await this.fetchCharacters();
        const skins = await Promise.all(characters.map(character => character.niveau > 0 ? this.findSkinByIdAndLevel(character.id, character.niveau) : null));
        const normalizedSearchValue = searchValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const filteredCharacters = characters.filter((character, index) => 
            character.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalizedSearchValue) ||
            (skins[index] && skins[index].nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalizedSearchValue))
        );
        return filteredCharacters;
    }

    static saveRatingToLocalStorage = (id, rating) => {
        let ratings = JSON.parse(localStorage.getItem('ratings')) || {};
        ratings[id] = rating;
        localStorage.setItem('ratings', JSON.stringify(ratings));
    }

    static getRatingFromLocalStorage = (id) => {
        let ratings = JSON.parse(localStorage.getItem('ratings')) || {};
        return ratings[id] || 0;
    }

    static setRating = async (id, rating) => {
        const character = await this.fetchCharacter(id);
        const ratings = character.ratings || [];
        ratings.push(rating);
        character.ratings = ratings;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(character)
        };
        try {
            const response = await fetch(`${ENDPOINT}/personnages/${id}`, options)
            if (!response.ok) {
                throw new Error(`Erreur dans le lien : ${response.status}`);
            }
            this.saveRatingToLocalStorage(id, rating);
            return character;
        } catch (err) {
            console.log('Erreur pour changer la notation', err)
            return null;
        }
    }

    static getRating = async (id) => {
        const character = await this.fetchCharacter(id);
        const ratings = character.ratings || [];
        if (ratings.length === 0) {
            return this.getRatingFromLocalStorage(id);
        }
        const rating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
        return rating;
    }
}