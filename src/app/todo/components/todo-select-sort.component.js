const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

:host {
    --size: 40px;
}

input[type="radio"] {
    display: none;
}

.wrapper {
    display: flex;
    flex-direction: row;
    gap: 3px;
}

.toggle-dir-btn,
.sort-options__button {
    background-color: transparent;
    border: solid 2px var(--gray-light);
    color: var(--gray-light);
    cursor: pointer;
    border-radius: 10px;
}

.toggle-dir-btn {
    width: var(--size);
    height: var(--size);
    background-position: center;
    background-size: auto 70%;
    background-repeat: no-repeat;
    
    background-image: url("/src/assets/arrow-up.png");
    
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

.sort-options {
    display: block;
    width: 200px;
    position: relative;
}

.sort-options__button {
    display: block;
    width: 100%;
    height: var(--size);
    font-size: 18px;
    padding: 0 10px;
    text-align: left;
    
    &:hover {
        background-color: var(--gray-light);
        color: var(--gray-super-dark);
    }
}

.sort-options__dropdown {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: calc(100% + 3px);
    left: 0;
    width: 100%;
    background-color: var(--gray-super-dark);
    border: solid 2px var(--gray-light);
    border-radius: 8px;
    z-index: 1000;
    
    &.hidden {
        display: none;
    }
}

.sort-option__label {
    display: block;
    padding: 7px 15px;
    border: none;
    opacity: 1;
    color: var(--gray-light);
    font-size: 18px;
    cursor: pointer;
    
    &:hover {
        background-color: var(--gray-light);
        color: var(--gray-super-dark);
    }
    
    .sort-option_wrapper:first-child & {
        border-radius: 5px 5px 0 0;
    }
    
    .sort-option_wrapper:last-child & {
        border-radius: 0 0 5px 5px;
    }
}
</style>

<div class="wrapper">
    <button class="toggle-dir-btn desc"></button>
    
    <section class="sort-options">
        <button class="sort-options__button">Description</button>
        
        <div class="sort-options__dropdown hidden">
            <div class="sort-option_wrapper">
                <label class="sort-option__label" for="timestamp">Time Created</label>
                <input id="timestamp" type="radio" name="sort-option" value="TIMESTAMP"/>
            </div>
            
            <div class="sort-option_wrapper">
                <label class="sort-option__label" for="description">Description</label>
                <input id="description" type="radio" name="sort-option" value="DESCRIPTION"/>
            </div>
            
            <div class="sort-option_wrapper">
                <label class="sort-option__label" for="is-completed">Task Completion</label>
                <input id="is-completed" type="radio" name="sort-option" value="IS_COMPLETED"/>
            </div>
        </div>
    </section>
</div>`;

export default class TodoSelectSortComponent extends HTMLElement {
    static selector = 'app-todo-select-sort';

    elems = {};
    #isAsc;
    #sortBy;

    static get observedAttributes() {
        return ['direction', 'selected-option']
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            dropdown: this.shadowRoot.querySelector('.sort-options__dropdown'),
            toggleSortDirectionBtn: this.shadowRoot.querySelector('.toggle-dir-btn'),
            sortOptionsBtn: this.shadowRoot.querySelector('.sort-options__button')
        };

        this.elems.sortOptionsBtn
            .addEventListener('click', () => this.elems.dropdown.classList.toggle('hidden'));

        this.elems.toggleSortDirectionBtn
            .addEventListener('click', e => this.#handleSortDirectionToggle(e));

        this.elems.dropdown
            .addEventListener('click', e => this.#handleDropdownSelectionChanged(e));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'direction') {
            const isAsc = newValue === 'asc';

            isAsc
                ? this.elems.toggleSortDirectionBtn.classList.remove('desc')
                : this.elems.toggleSortDirectionBtn.classList.add('desc');

            this.#emitSortOptionsChanged(isAsc, this.#sortBy);
        } else if (name === 'selected-option') {
            const inputId = newValue;

            const label = this.shadowRoot.querySelector(`[for="${inputId}"]`);
            this.elems.sortOptionsBtn.innerText = label.innerText;

            const input = this.shadowRoot.getElementById(inputId);
            this.#emitSortOptionsChanged(this.#isAsc, input.value);
        }
    }

    #handleSortDirectionToggle(event) {
        event.target.classList.toggle('desc');
        const isAsc = !event.target.classList.contains('desc')

        this.setAttribute('direction', isAsc ? 'asc' : 'desc');
        this.#emitSortOptionsChanged(isAsc, this.#sortBy);
    }

    #handleDropdownSelectionChanged(event) {
        const label = event.target;

        if (!label.classList.contains('sort-option__label')) {
            return;
        }

        this.elems.sortOptionsBtn.innerText = label.innerText;
        this.elems.dropdown.classList.add('hidden');

        const inputId = label.getAttribute('for');
        const input = this.shadowRoot.getElementById(inputId);

        this.setAttribute('sort-by', inputId);
        this.#emitSortOptionsChanged(this.#isAsc, input.value);
    }

    #emitSortOptionsChanged(isAsc, sortBy) {
        if (isAsc === this.#isAsc && sortBy === this.#sortBy) {
            return;
        }

        this.#isAsc = isAsc;
        this.#sortBy = sortBy;

        this.dispatchEvent(new CustomEvent('sort-changed', {
            detail: {
                isAsc: this.#isAsc,
                sortBy: this.#sortBy
            }
        }));
    }
}