const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}
</style>

`;

export class TodoSortSelectComponent extends HTMLElement {
    static selector = 'app-todo-sort-select';

    elems = {};

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {

        };
    }
}