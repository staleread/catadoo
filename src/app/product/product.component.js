const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}
</style>

<section class="product-page">
    <header>Product Page is working!</header>
    <section class="products">
        <app-product-list></app-product-list>
    </section>
    <footer class="total-price"></footer>
</section>`;

export class ProductComponent extends HTMLElement {
    static selector = 'app-product-page'

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}