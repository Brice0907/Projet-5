async function main(){
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
    bouton.addEventListener('click', () =>{
        const quantity = document.querySelector('#quantity')

        const cartItem = {
            item : id,
            couleur : couleur.value,
            quantity : parseInt(quantity.value),
        }
        console.log(cartItem)
        
        const panier = JSON.parse(localStorage.getItem('panier')) || []
        
        const ajouter = document.querySelector('.ajouter')
        const article = document.querySelector('.anim')

        const found = panier.find(element => element.item === cartItem.item)
        if (found != undefined){
            throw 'Produit déjà ajouté'
        }

        if (cartItem.couleur && cartItem.quantity){
            panier.push(cartItem)
            localStorage.setItem('panier', JSON.stringify(panier))
            article.classList.add('ajouter')
        } else {
            throw 'Veuiller séléctionner une couleur et une quantité'
        } 
    })
    
}
main()
