async function main(){
    const response = await fetch('http://localhost:3000/api/products')
    const items = await response.json()
    console.log(items)
    const template = document.getElementById('item')
    console.log(template)
    items.forEach(element => {
        const itemNode = template.content.cloneNode(true)
        itemNode.querySelector('.productName').innerText = element.name
        itemNode.querySelector('.productDescription').innerText = element.description
        itemNode.querySelector('.productImage').src = element.imageUrl
        itemNode.querySelector('.productImage').setAttribute("alt","Lorem ipsum dolor sit amet," + element.name)
        itemNode.querySelector('.productLink').setAttribute("href", "./product.html?id=" + element._id)
        document.getElementById('items').appendChild(itemNode)
        console.log(element)
    });
    
}
main()
