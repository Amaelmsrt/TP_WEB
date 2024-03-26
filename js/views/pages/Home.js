import AllCharacters from "./AllCharacters.js";

export default class Home {
    constructor() {
        this.allCharacters = new AllCharacters();
    }

    async render() {
        let html = await this.allCharacters.render();
        
        return /*html*/`
            <section class="py-5 text-center container">
                <div class="row py-lg-5">
                    <div class="col-lg-6 col-md-8 mx-auto">
                        <h1 class="fw-light">Personnages de jeu</h1>
                        <p class="lead text-body-secondary">Découvrez les personnages de votre jeu préféré.</p>

                    </div>
                </div>
            </section>
            ${html}
        `;
    }

    async afterRender() {
        await this.allCharacters.afterRender();
    }
}