class ProductMenu extends HTMLElement {
    template = () => `
    <style>
    * {
        box-sizing: border-box;
        margin: 0;
    }
    
    :host {
        display: block;
        padding: 20px 0;
    }
    
    .menu {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 20px;
        align-items: center;
    }
    
    .actions {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 14px;
    }
    
    ::slotted([slot="title"]) {
        font-size: 26px;
        font-weight: 400;
    }
    
    input[type="text"] {
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
    
    .add-product-btn {
        display: block;
        border: none;
        border-radius: 10px;
        padding: 10px 30px;
        font-size: 17px;
        background-color: var(--gray-light);
        color: var(--white);
        cursor: pointer;
        transition: all .3s;
    }
    
    .add-product-btn:hover {
        background-color: var(--white);
        color: var(--gray);
    }
    
    @media screen and (width < 700px) {
        .menu {
            flex-direction: column;
        }
    }
    
    @media screen and (width < 450px) {
        .actions {
            flex-direction: column-reverse;
            justify-content: start;
            gap: 14px;
            width: 90%;
        }
    }
    </style>
    
    <section class="menu">
        <slot name="title"></slot>
        <div class="actions">
            <input type="text" name="product-search" placeholder="Search">
            <button class="add-product-btn">Add product</button>
        </div>
    </section>`

    render = () => this.shadowRoot.innerHTML = this.template().trim()

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        if (this.rendered) {
            return
        }

        this.render()
        this.rendered = true

        const input = this.shadowRoot.querySelector('input[type="text"]')

        input.addEventListener('input', () => {
            this.dispatchEvent(new CustomEvent('filter-changed', {
                bubbles: false,
                cancelable: true,
                detail: {filter: input.value}
            }))
        })

        this.shadowRoot
            .querySelector('.add-product-btn')
            .addEventListener('click', () => this.dispatchEvent(new CustomEvent('add-product')))
    }
}

customElements.define('product-menu', ProductMenu)