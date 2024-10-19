import HeaderComponent from "./layout/header.component.js";
import ProductPageComponent from "./product/product-page.component.js";
import TodoPageComponent from "./todo/todo-page.component.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    color: var(--white);
}

footer {
    height: 200px;
    padding: 30px 0;
}

.copyright {
    display: block;
    letter-spacing: 1px;
    color: var(--gray-light);
    text-align: left;
}

@media screen and (width < 550px) {
    .copyright {
        text-align: center;
    }
}
</style>

<main>
    <app-header></app-header>
    
    <slot name="content"></slot>
    
    <footer>
        <p class="copyright">&copy; Mykola Ratushniak</p>
    </footer>
</main>`;

export default class AppComponent extends HTMLElement {
    route = '/products'
    elems = {}

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            headerNav: this.shadowRoot.querySelector('app-header')
        };

        this.elems.headerNav
            .addEventListener('route-changed', e => this.updatePageContent(e.detail.route));
    }

    connectedCallback() {
        customElements.whenDefined('app-header').then(() => {
            this.elems.headerNav.setActiveNavOption(this.route);
            this.updatePageContent(this.route)
        });
    }

    updatePageContent(route) {
        let contentComponentSelector;

        switch (route) {
            case '/':
            case '/products':
                contentComponentSelector = 'app-product-page';
                break;
            case '/todos':
                contentComponentSelector = 'app-todo-page';
                break;
        }

        this.shadowRoot.host.innerHTML = ''

        const contentElem = document.createElement(contentComponentSelector);
        contentElem.setAttribute('slot', 'content')

        this.shadowRoot.host.appendChild(contentElem)
    }
}

customElements.define('app-root', AppComponent);
