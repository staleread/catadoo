import {HeaderComponent} from "./layout/header.component.js";
import {ProductComponent} from "./product/product.component.js";

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

    contentComponentSelector;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.updateRoute()
    }

    updateRoute() {
        this.contentComponentSelector = ProductComponent.selector;

        const contentElem = document.createElement(this.contentComponentSelector);
        contentElem.setAttribute('slot', 'content')

        this.shadowRoot.host.appendChild(contentElem)
    }
}