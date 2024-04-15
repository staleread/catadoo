import ProductCardComponent from "./product-card.component.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

.product-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.js-empty-message,
.js-loading-message {
    padding: 15px 0;
}

.js-result-products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 30%));
    gap: 14px;
}

@media screen and (width < 500px) {
    .js-result-products {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
}

@media screen and (width < 600px) {
    .js-result-products {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

<div class="product-list-wrapper">
    <section class="js-result-products"></section>
        
    <footer class="js-total-price-wrapper" hidden>
        <p class="js-total-price"></p>
    </footer>
</div>`;

export default class ProductListComponent extends HTMLElement {
    static selector = 'app-product-list';

    elems = {}

    static get observedAttributes() {
        return ['is-loading'];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            productList: this.shadowRoot.querySelector('.js-result-products'),
            totalPriceWrapper: this.shadowRoot.querySelector('.js-total-price-wrapper'),
            totalPrice: this.shadowRoot.querySelector('.js-total-price'),
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'is-loading') {
            return;
        }

        switch (newValue) {
            case 'true':
                this.elems.productList.innerHTML = '<div class="js-loading-message">Loading...</div>';
                this.elems.totalPriceWrapper.setAttribute('hidden', '');
                break;
            case 'false':
                this.elems.productList.innerHTML = '';
                break;
        }
    }

    renderProductList(products, totalPrice) {
        if (products.length === 0) {
            this.elems.productList.innerHTML = `<div class="js-empty-message">Nothing found</div>`;
            this.elems.totalPriceWrapper.setAttribute('hidden', '');
        } else {
            this.elems.productList.innerHTML = '';
            this.elems.totalPriceWrapper.removeAttribute('hidden');
            this.elems.totalPrice.innerText = `Total: $${totalPrice}`;

            customElements.whenDefined(ProductCardComponent.selector).then(() => {
                const fragment = new DocumentFragment();

                for (const product of products) {
                    const card = document.createElement(ProductCardComponent.selector);

                    card.product = product;
                    fragment.appendChild(card);
                }
                this.elems.productList.appendChild(fragment);
            });
        }
    }
}