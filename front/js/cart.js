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
        document.querySelector('#totalPrice').innerText = panier.reduce((totalPrice, element) => {
            const item = items[element.item]
            return totalPrice + item.price * element.quantity
        }, 0)
        document.querySelector('#totalQuantity').innerText = panier.reduce((totalQuantity, element) => {
            return totalQuantity + element.quantity
        }, 0)
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

    // ----- PASSER COMMANDE ----- \\

    const form = document.querySelector('.cart__order__form')

    form.addEventListener('submit', async (e) => {

        e.preventDefault()
        const firstName = form.querySelector('#firstName')
        const lastName = form.querySelector('#lastName')
        const address = form.querySelector('#address')
        const ville = form.querySelector('#city')
        const email = form.querySelector('#email')

        let contact = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: ville.value,
            email: email.value,
        }

        const products = panier.reduce((products, cartItem) => {
            for (let i = 0; i < cartItem.quantity; i++) {
                products.push(cartItem.item)
            }
            return products
        }, [])


        if (verifForm(contact)) {
            form.querySelector('#firstNameErrorMsg').textContent = ''
            const response = await fetch('http://localhost:3000/api/products/order', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({ contact, products })
            })
            const result = await response.json()
            console.log(result);

            const orderId = result.orderId
            location.href = ("href", "./confirmation.html?orderId=" + orderId)
            localStorage.removeItem('panier')
        }
    })

}
main()

function verifForm(contact) {
    const form = document.querySelector('.cart__order__form')
    let error = false
    form.querySelector('#firstNameErrorMsg').textContent = ''
    form.querySelector('#lastNameErrorMsg').textContent = ''
    form.querySelector('#cityErrorMsg').textContent = ''
    form.querySelector('#emailErrorMsg').textContent = ''
    if (!/^[A-Za-z]+[ \-']?[[A-Za-z]+[ \-']?]*[a-z]+$/.test(contact.firstName)) {
        form.querySelector('#firstNameErrorMsg').textContent = "Veuillez renseigner correctement votre Prénom"
        error = true
    }
    if (!/^[A-Za-z]+[ \-']?[[A-Za-z]+[ \-']?]*[a-z]+$/.test(contact.lastName)) {
        form.querySelector('#lastNameErrorMsg').textContent = "Veuillez renseigner correctement votre Nom"
        error = true
    }
    if (!/^[A-Za-z]+[ \-']?[[A-Za-z]+[ \-']?]*[a-z]+$/.test(contact.city)) {
        form.querySelector('#cityErrorMsg').textContent = "Veuillez renseigner correctement votre Ville"
        error = true
    }
    if (!/^[a-zA-Z0-9.-_+]+@[a-zA-Z0-9.-_]+\.[a-z]{2,10}$/.test(contact.email)) {
        form.querySelector('#emailErrorMsg').textContent = "Veuillez renseigner correctement votre Email"
        error = true
    }
    return !error
}