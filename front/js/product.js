async function main() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    console.log(id)
    const response = await fetch('http://localhost:3000/api/products/' + id)
    const items = await response.json()
    console.log(items)

    const image = document.querySelector('.item__img_logo')
    image.src = items.imageUrl
    image.setAttribute('alt', items.altTxt)

    document.title = items.name

    const canapeDescription = document.getElementById('description')
    canapeDescription.innerText = items.description

    const titre = document.getElementById('title')
    titre.innerText = items.name

    const prix = document.getElementById('price')
    prix.innerText = items.price

    const couleur = document.getElementById('colors')
    items.colors.forEach(color => {
        const option = document.createElement('option')
        option.innerText = color
        couleur.appendChild(option)
    });


    const bouton = document.querySelector('#addToCart')
    bouton.addEventListener('click', () => {
        const quantity = document.querySelector('#quantity')

        const cartItem = {
            item: id,
            couleur: couleur.value,
            quantity: parseInt(quantity.value),
        }
        console.log(cartItem)

        const panier = JSON.parse(localStorage.getItem('panier')) || []

        const ajouter = document.querySelector('.ajouter')
        const article = document.querySelector('.anim')

        if (cartItem.couleur && cartItem.quantity) {
            const found = panier.find(element => element.item === cartItem.item)
            if (found != undefined) {
                const product = panier.find(element => element.couleur === cartItem.couleur)
                if (product != undefined) {
                    const test = parseInt(cartItem.quantity)
                    product.quantity += test
                    localStorage.setItem('panier', JSON.stringify(panier))
                    console.log(product.quantity, test);
                    console.log('Ajout de la quantité');
                } else {
                    panier.push(cartItem)
                    localStorage.setItem('panier', JSON.stringify(panier))
                    article.classList.add('ajouter')
                    console.log('Ajout-2');
                }
            } else {
                panier.push(cartItem)
                localStorage.setItem('panier', JSON.stringify(panier))
                article.classList.add('ajouter')
                console.log("Ajout-1");
            }
        } else {
            throw 'Veuiller séléctionner une couleur et une quantité'
        }

    })

}
main()
