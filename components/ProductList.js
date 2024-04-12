const productListTemplate = document.createElement('template')

productListTemplate.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

.product-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 30%));
    gap: 14px;
    padding: 0;
    list-style-type: none;
}

@media screen and (width < 500px) {
    .product-list {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
}

@media screen and (width < 600px) {
    .product-list {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
}

.total-price-wrapper {
    border: solid var(--gray-light) 1px 1px 1px 0;
}

::slotted([slot="total-price"]) {
    display: block;
    text-align: right;
    color: var(--gray-light);
    padding: 20px;
    font-size: 18px;
}
</style>

<ul class="product-list">
    <slot name="item"></slot>
</ul>

<footer class="total-price-wrapper">
    <slot name="total-price"></slot>
</footer>`

class ProductList extends HTMLElement {
    totalPrice = 0

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }

    render() {
        this.shadowRoot.innerHTML = ''
        this.shadowRoot.appendChild(productListTemplate.content.cloneNode(true))
    }

    connectedCallback() {
        if (this.rendered) {
            return
        }

        this.render()
        this.rendered = true
    }

    renderProducts(productsInfo) {
        this.shadowRoot.host.innerHTML = ''
        const fragment = new DocumentFragment()

        for (const product of productsInfo.getProducts()) {
            const card = document.createElement('product-card')
            card.setAttribute('slot', 'item')

            card.setAttribute('id', product.id)
            card.setAttribute('name', product.name)
            card.setAttribute('price', product.price)
            card.setAttribute('image-src', product.imageUrl)

            fragment.appendChild(card)
        }

        const totalPrice = document.createElement('p')

        totalPrice.setAttribute('slot', 'total-price')
        totalPrice.innerText = 'Total: $' + productsInfo.totalPrice

        fragment.appendChild(totalPrice)
        this.shadowRoot.host.appendChild(fragment)

        this.render()
    }
}

customElements.define('product-list', ProductList)