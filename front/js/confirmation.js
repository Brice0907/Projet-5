async function main() {
    const params = new URLSearchParams(document.location.search)
    const orderId = params.get('orderId')
    console.log(orderId);

    const validation = document.querySelector('#orderId').textContent = orderId
    console.log(validation);
    
}
main()