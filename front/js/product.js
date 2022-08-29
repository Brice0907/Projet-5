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
}
main()
