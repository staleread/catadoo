import {HeaderComponent} from "./layout/header.component.js";
import {ProductComponent} from "./product/product.component.js";
import {TodoComponent} from "./todo/todo.component.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    color: var(--white);
}
</style>

<main>
    <${HeaderComponent.selector}></${HeaderComponent.selector}>
    <slot name="content"></slot>
    <footer>&copy; Mykola Ratushniak | Footer works</footer>
</main>`;

export class AppComponent extends HTMLElement {
    static selector = 'app-root';

    defaults = {
        route: '/products'
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.updatePageContent(this.defaults.route)

        this.shadowRoot
            .querySelector(HeaderComponent.selector)
            .addEventListener('route-changed', (e) => this.updatePageContent(e.detail.route))
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