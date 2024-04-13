import {ProductService} from "./services/product.service.js";
import {ProductListComponent} from "./components/product-list.component.js";

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
    padding: 30px 0;
    gap: 20px;
    align-items: center;
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
</style>

<section class="product-page">
    <header>
        <h2 class="title">Products</h2>
        <section class="features">
            <input class="js-product-filter" type="text" name="product-filter" placeholder="Search">
            <button class="js-add-product-btn">Add product</button>
        </section>
    </header>
    
    <${ProductListComponent.selector}></${ProductListComponent.selector}>
</section>`;

export class ProductComponent extends HTMLElement {
    static selector = 'app-product-page';
    static productService = new ProductService()

    productsFilter = '';
    refreshTimeout;

    elems = {};

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems.productList = this.shadowRoot.querySelector(ProductListComponent.selector);

        this.elems.productList
            .addEventListener('product-action', (e) => this.handleProductAction(e.detail));

        this.shadowRoot
            .querySelector('.js-add-product-btn')
            .addEventListener('click', () => this.handleProductAction({action: 'create'}));

        this.shadowRoot
            .querySelector('.js-product-filter')
            .addEventListener('input', (e) => this.refreshProductList(e.target.value));
    }

    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        this.refreshProductList();
    }

    refreshProductList(filter = '') {
        let delay = 300;

        // refresh immediately on startup
        if (!this.refreshTimeout) {
            delay = 0;
        }

        this.productsFilter = filter;
        clearTimeout(this.refreshTimeout);

        this.refreshTimeout = setTimeout(async () => {
            const [products, totalPrice] = await this.fetchData();
            this.elems.productList.renderProductList(products, totalPrice);
        }, delay);
    }

    async fetchData() {
        this.elems.productList.setAttribute('is-loading', 'true');

        const productsInfo = await ProductComponent.productService.getProductsInfo(this.productsFilter);

        this.elems.productList.setAttribute('is-loading', 'false');
        return [productsInfo.products, productsInfo.totalPrice];
    }

    handleProductAction(actionInfo) {
        switch (actionInfo.action) {
            case 'create':
                console.log('Creating')
                break;
            case 'edit':
                console.log(`Editing ${actionInfo.productId}...`)
                break;
            case 'delete':
                console.log(`Deleting ${actionInfo.productId}...`)
                break;
        }
    }
}