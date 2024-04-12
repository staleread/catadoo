const productCardTemplate = document.createElement('template')

productCardTemplate.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

:host {
    display: block;
}

.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    gap: 10px;
    background-color: var(--gray);
    border-radius: 10px;
    opacity: .7;
    
    &:hover {
        opacity: 1;;
    }
}

.details {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 10px;
    padding: 10px;
}

img {
    display: block;
    max-width: 100%;
    max-height: 200px;
    border-radius: 10px 10px 0 0;
    height: auto;
    object-fit: cover;
}

.price {
    font-size: 20px;
    font-weight: 600;
    color: var(--white);
}

.name {
    font-size: 16px;
    font-weight: 300;
    color: var(--white);
}

.delete-btn {
    display: block;
    border: none;
    border-radius: 10px;
    padding: 10px 30px;
    font-size: 17px;
    background-color: var(--gray-light);
    color: var(--white);
    cursor: pointer;
    transition: all .3s;
    
    &:hover {
        background-color: var(--white);
        color: var(--gray);
    }
}

[data-product-action] {
    cursor: pointer;
}

[data-product-action="edit"]:hover {
    text-decoration: underline;
}

</style>
<article class="wrapper">
    <img class="image" src="" alt="">
    <div class="details">
        <p class="price" data-product-action="edit"></p>
        <h3 class="name" data-product-action="edit"></h3>
        <button class="delete-btn" data-product-action="delete">Delete</button>
    </div>
</article>
`

class ProductCard extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }

    render() {
        this.shadowRoot.innerHTML = ''

        const clone = productCardTemplate.content.cloneNode(true)

        clone.querySelector('.image').setAttribute('src', this.productImageSrc)
        clone.querySelector('.price').innerText = '$' + this.productPrice
        clone.querySelector('.name').innerText = this.productName

        this.shadowRoot.appendChild(clone)
    }

    static get observedAttributes() {
        return ['id', 'name', 'price', 'image-src'];
    }

    connectedCallback() {
        if (this.rendered) {
            return
        }

        this.render()
        this.rendered = true
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'id':
                this.productId = newValue
                break
            case 'name':
                this.productName = newValue
                break
            case 'price':
                this.productPrice = newValue
                break
            case 'image-src':
                this.productImageSrc = newValue
                break
        }

        this.render()
    }
}

customElements.define('product-card', ProductCard)