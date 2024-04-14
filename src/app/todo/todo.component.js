import TodoSelectSortComponent from "./components/todo-select-sort.component.js";

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
    align-items: center;
    gap: 20px;
}

@media screen and (width < 400px) {
    header {
        flex-direction: column;
    }
}

.title {
    font-size: 26px;
    font-weight: 400;
}
</style>

<section class="todo-page">
    <header>
        <h2 class="title">Todo list</h2>
        <${TodoSelectSortComponent.selector} diresction="asc" sort-by="timespan"></${TodoSelectSortComponent.selector}>
    </header>
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
}