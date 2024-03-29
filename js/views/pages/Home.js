export default class Home {

    async render() {
        return /*html*/`
            <section class="py-5 text-center container">
                <div class="row py-lg-5">
                    <div class="col-lg-6 col-md-8 mx-auto">
                        <h1 class="fw-light">Les personnages du jeu League of Legends</h1>
                        <p class="lead text-body-secondary">Découvrez les différentes pages : </p>
                        <ul>
                            <li class="list-inline-item"><p>Personnages -> La liste des personnages</p></li>
                            <li class="list-inline-item"><p>Favoris -> La liste des personnages favoris</p></li>
                            <li class="list-inline-item"><p>Skins -> La liste des skins</p></li>
                            <li class="list-inline-item"><p>Equipements -> La liste des personnages équipements</p></li>
                        </ul>
                    </div>
                </div>
            </section>
        `;
    }
}