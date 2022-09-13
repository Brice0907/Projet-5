async function main() {
    let panier = JSON.parse(localStorage.getItem('panier'))
    console.log(panier)

    const ids = panier.reduce((ids, cartItem) => ids.add(cartItem.item), new Set())
    console.log(ids)
    const requests = Array.from(ids).map(async id => {
        const response = await fetch('http://localhost:3000/api/products/' + id)
        return response.json()
    })
    const items = (await Promise.all(requests)).reduce((items, item) => ({ ...items, [item._id]: item }), {})
    console.log(items)

    const template = document.querySelector('#cartItem')
    console.log(template)

    // ----- FUNCTION TOTAL ----- \\

    const computeTotal = () => {
        const total = panier.reduce((total, element) => {
            const item = items[element.item]
            total.price += item.price * element.quantity
            total.quantity += element.quantity
            return total
        }, {
            price: 0,
            quantity: 0,
        })
        document.querySelector('#totalPrice').innerText = total.price
        document.querySelector('#totalQuantity').innerText = total.quantity
        // document.querySelector('#totalPrice').innerText = panier.reduce((totalPrice, element) => {
        //     const item = items[element.item]
        //     return totalPrice + item.price * element.quantity
        // }, 0)
        // document.querySelector('#totalQuantity').innerText = panier.reduce((totalQuantity, element) => {
        //     return totalQuantity + element.quantity
        // }, 0)
    }
    computeTotal()

    const savePanier = () => {
        localStorage.setItem('panier', JSON.stringify(panier))
    }

    panier.forEach(element => {
        const item = items[element.item]
        const templateElementNode = template.content.cloneNode(true)
        templateElementNode.querySelector('.cart__item__content__description_name').innerText = item.name
        templateElementNode.querySelector('.cart__item__content__description_couleur').innerText = element.couleur
        templateElementNode.querySelector('.cart__item__content__description_price').innerText = item.price
        templateElementNode.querySelector('.cart__item__img_logo').src = item.imageUrl
        templateElementNode.querySelector('.cart__item__img_logo').setAttribute('alt', item.altTxt)
        templateElementNode.querySelector('.itemQuantity').setAttribute('value', element.quantity)

        // ----- MODIFIER LA QUANTITÉ ----- \\

        templateElementNode.querySelector('.itemQuantity').addEventListener('change', (event) => {
            newQuantity = parseInt(event.target.value)
            console.log(newQuantity);
            element.quantity = newQuantity
            computeTotal()
            savePanier()
        })

        // ----- REMOVE UN ITEM ----- \\

        templateElementNode.querySelector('.deleteItem').addEventListener('click', (event) => {
            const el = event.target.closest('.cart__item')
            el.remove()
            if (item._id == element.item) {
                panier = panier.filter(el => el.item !== element.item)
                console.log(panier)
                computeTotal()
                savePanier()
            }
        })
        document.querySelector('#cart__items').appendChild(templateElementNode)
        console.log(item)
    })
    // preventDefault 

    // ----- PASSER COMMANDE ----- \\

    const form = document.querySelector('.cart__order__form')
    
    form.addEventListener('submit', (e) => {    
        
        e.preventDefault()
        let erreur;
        const firstName = form.querySelector('#firstName')
        const lastName = form.querySelector('#lastName')
        const address = form.querySelector('#address')
        const ville = form.querySelector('#city')
        const email = form.querySelector('#email')

        let contact = {
            firstName : firstName.value,
            lastName : lastName.value,
            address : address.value,
            city : ville.value,
            email: email.value,
        }
        console.log(contact);

        let products = {
            id : ids,
        }
        console.log(products);

        
        if(!firstName.value) {
            erreur = "Veuillez renseigner votre Prénom"
        }
        
        if(erreur) {
            e.querySelector('#firstNameErrorMsg').innerText = erreur
            return false
        }
        // alert('Commande passé') 
        
    })
    
    
        
}
main()