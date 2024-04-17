import HeaderComponent from "./layout/header.component.js";
import ProductComponent from "./product/product.component.js";
import TodoComponent from "./todo/todo.component.js";

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
    <${HeaderComponent.selector}></${HeaderComponent.selector}>
    
    <slot name="content"></slot>
    
    <footer>
        <p class="copyright">&copy; Mykola Ratushniak</p>
    </footer>
</main>`;

export default class AppComponent extends HTMLElement {
    static selector = 'app-root';

    route = '/products'
    elems = {}

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            headerNav: this.shadowRoot.querySelector(HeaderComponent.selector)
        };

        this.elems.headerNav
            .addEventListener('route-changed', e => this.updatePageContent(e.detail.route));
    }

    connectedCallback() {
        customElements.whenDefined(HeaderComponent.selector).then(() => {
            this.elems.headerNav.setActiveNavOption(this.route);
            this.updatePageContent(this.route)
        });
    }

    updatePageContent(route) {
        let contentComponentSelector;

        switch (route) {
            case '/':
            case '/products':
                contentComponentSelector = ProductComponent.selector;
                break;
            case '/todos':
                contentComponentSelector = TodoComponent.selector;
                break;
        }

        this.shadowRoot.host.innerHTML = ''

        const contentElem = document.createElement(contentComponentSelector);
        contentElem.setAttribute('slot', 'content')

        this.shadowRoot.host.appendChild(contentElem)
    }
}