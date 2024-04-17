import TodoService from "./services/todo.service.js";
import {TodoSortOptions} from "./models/todo-sort-options.model.js";
import TodoItemComponent from "./components/todo-item.component.js";
import DropdownComponent from "../shared/dropdown.component.js";

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
    display: block;
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
    flex-grow: 1;
    
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

.todo-create-input {
    display: block;
    outline: none;
    border: none;
    background-color: transparent;
    color: var(--gray-light);
    padding: 8px;
    font-size: 18px;

    &:focus {
        color: var(--white);
    }
}

.sort-actions {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 10px;
}

.toggle-direction-btn {
    display: inline-block;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border-radius: 10px;
    background-position: center;
    background-size: auto 60%;
    background-repeat: no-repeat;
    background-image: url("/src/assets/arrow-up.png");
    border: solid 2px var(--gray-light);
    color: var(--gray-light);
    cursor: pointer;
    
    &:hover {
        background-color: var(--gray-light);
        background-image: url("/src/assets/arrow-up-accent.png");
    }
    
    &.desc {
        background-image: url("/src/assets/arrow-down.png");
    }
    
    &.desc:hover {
        background-color: var(--gray-light);
        background-image: url("/src/assets/arrow-down-accent.png");
    }
}

@media screen and (width < 600px) {
    .todo-create-input {
        width: 100%;
    }
}

.js-todo-list {
    display: flex;
    position: relative;
    flex-direction: column;
}

.sort-options-dropdown {
    width: 200px;
}

</style>

<section class="todo-page">
    <header>
        <h2 class="title">Todo list</h2>
        <div class="actions">
            <form class="todo-create__wrapper" name="todo-create" autocomplete="off">
                <input id="description" class="todo-create-input" type="text" placeholder="Enter your todo" autofocus/>
            </form>
            <section class="sort-actions">
                <button class="toggle-direction-btn"></button>
                <${DropdownComponent.selector} class="sort-options-dropdown"></${DropdownComponent.selector}>
            </section>
        </div>
    </header>
    
    <section class="js-todo-list"></section>
</section>`;

export default class TodoComponent extends HTMLElement {
    static selector = 'app-todo-page';
    static todoService = new TodoService();
    static sortOptions = new Map ([
        ['DESCRIPTION', 'Description'],
        ['TIMESPAN', 'Time Created'],
        ['IS_COMPLETED', 'Completion'],
    ]);

    FADE_DURATION = 500;
    elems = {};
    #isAsc = true;
    #sortBy = 'IS_COMPLETED';

    #isCompletedChangedHandler = async (id, isCompleted) => {
        await TodoComponent.todoService.updateCompleted(id, isCompleted);

        if (this.#sortBy === 'IS_COMPLETED') {
            this.refreshTodoList();
        }
    }

    #descriptionChangedHandler = async (id, description) => {
        await TodoComponent.todoService.updateDescription(id, description);

        if (this.#sortBy === 'DESCRIPTION') {
            this.refreshTodoList();
        }
    }

    #todoDeleteHandler = async(id) => await TodoComponent.todoService.delete(id);

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            createForm: this.shadowRoot.querySelector('form[name="todo-create"]'),
            todoList: this.shadowRoot.querySelector('.js-todo-list'),
            toggleSortDirectionBtn: this.shadowRoot.querySelector('.toggle-direction-btn'),
            sortOptionsDropdown: this.shadowRoot.querySelector('.sort-options-dropdown')
        };

        this.elems.createForm.addEventListener('submit', e => this.#handleTodoCreate(e));

        this.elems.toggleSortDirectionBtn
            .addEventListener('click', e => {
                e.target.classList.toggle('desc')
                this.#isAsc = !e.target.classList.contains('desc');
                this.refreshTodoList();
            });

        this.elems.sortOptionsDropdown
            .addEventListener('selection-changed', e => {
                this.#sortBy = e.detail.newValue;
                this.refreshTodoList();
            });
    }

    connectedCallback() {
        document.activeElement.blur();
        this.elems.createForm.description.focus();

        this.#isAsc
            ? this.elems.toggleSortDirectionBtn.classList.remove('desc')
            : this.elems.toggleSortDirectionBtn.classList.add('desc');

        customElements.whenDefined(DropdownComponent.selector).then(() => {
            this.elems.sortOptionsDropdown.render(TodoComponent.sortOptions, this.#sortBy);
        });

        this.refreshTodoList();
    }

    refreshTodoList() {
        let delay = 300;

        // refresh immediately on startup
        if (!this.refreshTimeout) {
            delay = 0;
        }
        clearTimeout(this.refreshTimeout);

        this.refreshTimeout = setTimeout(async () => {
            const fetchData = () => TodoComponent.todoService.getAll({
                isAsc: this.#isAsc,
                sortBy: TodoSortOptions[this.#sortBy]
            });
            await this.#renderTodoListOnLoad(fetchData);
        }, delay);
    }

    async #handleTodoCreate(event) {
        event.preventDefault();

        const description = this.elems.createForm.description.value;

        if (!description) {
            alert('Please enter a real todo');
            return;
        }

        try {
            this.elems.createForm.reset();
            this.elems.createForm.description.setAttribute('placeholder', 'Processing...');

            await TodoComponent.todoService.add(description);
            this.refreshTodoList();
        } catch (err) {
            alert(err.message);
            this.elems.createForm.description.setAttribute('value', description);
        }
        this.elems.createForm.description.setAttribute('placeholder', 'Enter your todo');
    }

    async #renderTodoListOnLoad(getTodosCallback) {
        await this.#fadeOutTodos();

        this.elems.todoList.innerHTML = '<div class="js-loading-message">Loading...</div>';

        const todos = await getTodosCallback();

        if (todos.length === 0) {
            this.elems.todoList.innerHTML = `<div class="js-empty-message">Nothing found</div>`;
        } else {
            this.elems.todoList.innerHTML = '';

            customElements.whenDefined(TodoItemComponent.selector).then(async () => {
                for (const todo of todos) {
                    const elem = document.createElement(TodoItemComponent.selector);

                    elem.todo = todo;
                    elem.deleteCallback = this.#todoDeleteHandler;
                    elem.editCompletedCallback = this.#isCompletedChangedHandler;
                    elem.editDescriptionCallback = this.#descriptionChangedHandler;

                    this.elems.todoList.appendChild(elem);
                }
            });
        }
    }

    async #fadeOutTodos() {
        const children = [...this.elems.todoList.children]
            .filter(e => e.localName === TodoItemComponent.selector);

        if (children.length === 0) {
            return;
        }

        const interval = 100;
        let delay = 0;

        for (const child of children.reverse()) {
            setTimeout(() => child.fadeOut(), delay)
            delay += interval;
        }
        await new Promise(resolve =>
            setTimeout(resolve, interval * children.length + this.FADE_DURATION));
    }
}