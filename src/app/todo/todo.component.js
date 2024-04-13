const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}
</style>

<section class="todo-page">
    <header>Todo Page is working!</header>
    <section class="todos">
        <app-todo-list></app-todo-list>
    </section>
</section>`;

export class TodoComponent extends HTMLElement {
    static selector = 'app-todo-page';

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;
    }
}