import { ENDPOINT } from '../config.js'

export default class GameDataProvider {

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
}