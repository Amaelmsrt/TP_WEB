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
           console.log('Error getting characters', err)
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
           console.log('Error getting character', err)
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
           console.log('Error getting skins', err)
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
           console.log('Error getting equipments', err)
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
               throw new Error(`HTTP error! status: ${response.status}`);
           }
           const json = await response.json();
           return json[0];
       } catch (err) {
           console.log('Error getting skin', err)
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allEquipments = await response.json();
            const equipments = allEquipments.filter(equipment => Number(equipment.id_personnage) === Number(id) && Number(equipment.niveau) <= Number(level));
            return equipments;
        } catch (err) {
            console.log('Error getting equipments', err)
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
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return character;
            } catch (err) {
                console.log('Error upgrading character', err)
                return null;
            }
        }
    }
}