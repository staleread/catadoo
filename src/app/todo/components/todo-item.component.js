const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

.wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 10px 0;
    opacity: 0;
    transition: opacity .5s;
    
    &.visible {
        opacity: 1;
    }
}

.todo-toggle-btn {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid var(--gray-light);
    background-color: transparent;
    cursor: pointer;
    
    &.completed::after {
        content: "";
        position: absolute;
        left: 9px;
        top: 4px;
        width: 6px;
        height: 12px;
        border: solid var(--white);
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
    }
}

.todo-description__wrapper {
    display: block;
    position: relative;
    flex-grow: 1;
    
    &:focus-within:has(:not([readonly]))::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--white);
    }
}

.todo-description {
    display: block;
    outline: none;
    border: none;
    background-color: transparent;
    color: var(--gray-light);
    padding: 8px 0;
    font-size: 18px;
    width: 100%;

    &:focus {
        color: var(--white);
    }
}

.todo-delete-btn {
    width: 35px;
    height: 35px;
    background-color: var(--gray);
    border: none;
    color: white;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    
    background-position: center;
    background-size: auto 60%;
    background-repeat: no-repeat;
    background-image: url("/src/assets/trash-bin.png");
    transition: all 0.3s;
    
    &:hover {
        background-color: var(--danger);
        background-image: url("/src/assets/trash-bin-accent.png");
    }
}
</style>

<article class="wrapper">
    <button class="todo-toggle-btn"></button>
    <div class="todo-description__wrapper">
        <input class="todo-description" name="description" type="text" autocomplete="off" readonly>
    </div>
    <button class="todo-delete-btn"></button>
</article>`;

export default class TodoItemComponent extends HTMLElement {
    static selector = 'app-todo-item';

    todo;
    deleteCallback;
    editDescriptionCallback;
    editCompletedCallback;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            wrapper: this.shadowRoot.querySelector('.wrapper'),
            toggleCompletedBtn: this.shadowRoot.querySelector('.todo-toggle-btn'),
            deleteBtn: this.shadowRoot.querySelector('.todo-delete-btn'),
            editDescriptionInput: this.shadowRoot.querySelector('input[name="description"]')
        };

        this.elems.toggleCompletedBtn.addEventListener('click', e => this.#handleCompletedChanged(e));
        this.elems.deleteBtn.addEventListener('click', e => this.#handleDelete(e));

        this.elems.editDescriptionInput.addEventListener('keydown', async e => {
            if (e.keyCode === 13) {
                await this.#handleDescriptionChanged(e);
            }
        });

        this.elems.editDescriptionInput.addEventListener('dblclick', e => e.target.removeAttribute('readonly'));

        this.elems.editDescriptionInput.addEventListener('focusout', async e => {
            if (!e.target.hasAttribute('readonly') && confirm('Would you like to save the task?')) {
                await this.#handleDescriptionChanged(e);
            }
        });
    }

    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        this.render();
    }

    render() {
        if (!this.todo) {
            return;
        }

        if (this.todo.isCompleted) {
            this.elems.toggleCompletedBtn.classList.add('completed');
        }

        this.elems.editDescriptionInput.value = this.todo.description;
        setTimeout(() => this.elems.wrapper.classList.add('visible'));
    }

    fadeOut() {
        setTimeout(() => this.elems.wrapper.classList.remove('visible'));
    }

    async #handleCompletedChanged(event) {
        const target = event.target;

        target.classList.toggle('completed');
        this.todo.isCompleted = target.classList.contains('completed');

        try {
            await this.editCompletedCallback(this.todo.id, this.todo.isCompleted);
        } catch (err) {
            alert(err.message);
            target.classList.toggle('completed');
            this.todo.isCompleted = target.classList.contains('completed');
        }
    }

    async #handleDescriptionChanged(event) {
        event.preventDefault();

        const input = event.target;
        const oldValue = this.todo.description;
        const newValue = input.value;

        input.value = '';
        input.setAttribute('placeholder', 'Updating...');

        try {
            await this.editDescriptionCallback(this.todo.id, newValue);
            input.value = newValue;
        } catch (err) {
            alert(err.message);
            input.value = oldValue;
        }
        input.setAttribute('readonly', '');
        input.setAttribute('placeholder', '');
    }

    async #handleDelete(event) {
        event.preventDefault();

        this.elems.wrapper.style.opacity = '0';
        setTimeout(() => this.elems.wrapper.style.display = 'none', 700)

        try {
            await this.deleteCallback(this.todo.id);
            this.remove();
        } catch (err) {
            alert(err.message);
            this.elems.wrapper.style.opacity = '1';
            this.elems.wrapper.style.display = 'block';
        }
    }
}