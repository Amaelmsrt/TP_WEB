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
}