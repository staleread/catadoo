import TodoSelectSortComponent from "./components/todo-select-sort.component.js";
import TodoService from "./services/todo.service.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px 0;
    gap: 20px;
}

.title {
    font-size: 26px;
    font-weight: 400;
    text-align: left;
}

@media screen and (width < 700px) {
    .title {
        text-align: center;
    }
}

.actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: end;
    gap: 20px;
}

@media screen and (width < 600px) {
    .actions {
        flex-direction: column-reverse;
        align-items: center;
    }
}

.todo-create__wrapper {
    display: block;
    position: relative;
    width: 100%;
    
    &::after {
         content: "";
         position: absolute;
         bottom: -2px;
         left: 0;
         width: 100%;
         height: 2px;
         background-color: var(--gray-light);
    }
    
    &:focus-within::after {
        background-color: var(--white);
    }
}

@media screen and (width < 600px) {
    .todo-create-input {
        width: 100%;
    }
}

.todo-create-input {
    display: block;
    outline: none;
    border: none;
    background-color: transparent;
    color: var(--gray-light);
    padding: 8px;
    font-size: 18px;
    width: 100%;

    &:focus {
        color: var(--white);
    }
}
</style>

<section class="todo-page">
    <header>
        <h2 class="title">Todo list</h2>
        <div class="actions">
            <form class="todo-create__wrapper" name="todo-create" autocomplete="off">
                <input id="description" class="todo-create-input" type="text" placeholder="Enter your todo" autofocus/>
            </form>
            <${TodoSelectSortComponent.selector} diresction="asc" sort-by="timespan"></${TodoSelectSortComponent.selector}>
        </div>
    </header>
    
    <section class="todos-list"></section>
</section>`;

export default class TodoComponent extends HTMLElement {
    static selector = 'app-todo-page';
    static todoService = new TodoService();

    elems = {};

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            createForm: this.shadowRoot.querySelector('form[name="todo-create"]'),
        };

        this.elems.createForm.addEventListener('submit', e => this.#handleProductCreate(e));
    }

    connectedCallback() {
        document.activeElement.blur();
        this.elems.createForm.description.focus();
    }

    async #handleProductCreate(event) {
        event.preventDefault();

        const description = this.elems.createForm.description.value;

        if (!description) {
            alert('Please enter a real todo');
            return;
        }

        try {
            this.elems.createForm.reset();
            this.elems.createForm.description.setAttribute('placeholder', 'Processing...');

            await TodoComponent.todoService.add({description: description});
        } catch (err) {
            alert(err.message);
            this.elems.createForm.description.setAttribute('value', description);
        }
        this.elems.createForm.description.setAttribute('placeholder', 'Enter your todo');
    }
}