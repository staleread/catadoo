import {ProductCardComponent} from "./components/product-card.component.js";
import {ProductService} from "./services/product.service.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    padding: 20px 0;
}

@media screen and (width < 700px) {
    header {
        flex-direction: column;
    }
}

.features {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 14px;
}

@media screen and (width < 450px) {
    .features {
        flex-direction: column-reverse;
        justify-content: start;
        width: 90%;
    }
}

.title {
    font-size: 26px;
    font-weight: 400;
}

.js-product-filter {
    display:block;
    outline: none;
    border: solid 2px var(--gray-light);
    background-color: transparent;
    color: var(--gray-light);
    padding: 10px;
    border-radius: 10px;
    font-size: 18px;

    &:focus {
        color: var(--white);
        border-color: var(--white);
    }
}

.js-add-product-btn {
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

.js-total-price-wrapper {
    border: solid var(--gray-light);
    border-width: 1px 0 0;
}

.js-total-price {
    display: block;
    text-align: right;
    color: var(--gray-light);
    padding: 20px;
    font-size: 18px;
}

@media screen and (width < 700px) {
    .js-total-price {
        text-align: center;
    }
}
</style>

<section class="product-page">
    <header>
        <h2 class="title">Products</h2>
        <section class="features">
            <input class="js-product-filter" type="text" name="product-filter" placeholder="Search">
            <button class="js-add-product-btn">Add product</button>
        </section>
    </header>
    
    <section class="js-result-products">
    </section>
    
    <footer class="js-total-price-wrapper">
        <p class="js-total-price">Total: $342</p>
    </footer>
</section>`;

export class ProductComponent extends HTMLElement {
    static selector = 'app-product-page';
    static productService = new ProductService()

    products = []
    filteredProducts = []
    loadingStatus

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        customElements.whenDefined(ProductCardComponent.selector).then(() => {
            const productsInfo = ProductComponent.productService.getProductsInfo();
            const fragment = new DocumentFragment();

            for (const product of productsInfo.products) {
                const card = document.createElement(ProductCardComponent.selector);

                card.product = product;
                fragment.appendChild(card);
            }

            const productList = this.shadowRoot.querySelector('.js-result-products')
            productList.innerHTML = '';
            productList.appendChild(fragment);
        })
    }
}