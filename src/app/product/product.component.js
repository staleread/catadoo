import ProductService from "./services/product.service.js";
import ProductListComponent from "./components/product-list.component.js";
import ModalComponent from "../shared/modal.component.js";
import ProductCreateForm from "./components/product-create-form.component.js";
import ProductEditForm from "./components/product-edit-form.component.js";

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
    
    <${ModalComponent.selector} is-hidden="true">
        <slot name="modal-content"></slot>
    </${ModalComponent.selector}>
</section>`;

export default class ProductComponent extends HTMLElement {
    static selector = 'app-product-page';
    static productService = new ProductService()

    refreshTimeout;

    elems = {};

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            productList: this.shadowRoot.querySelector(ProductListComponent.selector),
            modal: this.shadowRoot.querySelector(ModalComponent.selector)
        };

        this.elems.productList
            .addEventListener('product-action', e => this.#handleProductListAction(e.detail));

        this.shadowRoot
            .querySelector('.js-add-product-btn')
            .addEventListener('click', () => this.#handleProductCreate());

        this.shadowRoot
            .querySelector('.js-product-filter')
            .addEventListener('input', e => this.refreshProductList(e.target.value));
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
        clearTimeout(this.refreshTimeout);

        this.refreshTimeout = setTimeout(async () => {
            const fetchData =  async () => {
                const productsInfo = await ProductComponent.productService.getProductsInfo(filter);
                return [productsInfo.products, productsInfo.totalPrice];
            };
            await this.elems.productList.renderOnLoad(fetchData);
        }, delay);
    }

    async #handleProductListAction(actionDetails) {
        switch (actionDetails.action) {
            case 'edit':
                await this.#handleProductEdit(actionDetails.productId);
                break;
            case 'delete':
                await this.#handleProductDelete(actionDetails.productId);
                break;
        }
    }

    #handleProductCreate() {
        this.elems.modal.innerHTML = '';

        customElements.whenDefined(ProductCreateForm.selector).then(() => {
            const createForm = document.createElement(ProductCreateForm.selector);

            createForm.onValidSubmit = async (dto) => {
                await ProductComponent.productService.add(dto);

                this.elems.modal.hide();
                this.elems.modal.innerHTML = '';
                this.refreshProductList();
            };

            this.elems.modal.appendChild(createForm);
            this.elems.modal.show();
        });
    }

    async #handleProductEdit(id) {
        this.elems.modal.innerHTML = '';

        const product = await ProductComponent.productService.get(id);

        customElements.whenDefined(ProductEditForm.selector).then(() => {
            const editForm = document.createElement(ProductEditForm.selector);
            editForm.setProduct(product);

            editForm.onValidSubmit = async (dto) => {
                await ProductComponent.productService.update(dto);

                this.elems.modal.hide();
                this.elems.modal.innerHTML = '';
                this.refreshProductList();
            };

            this.elems.modal.appendChild(editForm);
            this.elems.modal.show();
        });
    }

    async #handleProductDelete(id) {
        await ProductComponent.productService.delete(id);
        this.refreshProductList();
        alert('Product was deleted successfully');
    }
}