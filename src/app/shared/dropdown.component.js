const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

input[type="radio"] {
    display: none;
}

.wrapper {
    display: block;
    width: 100%;
    height: 40px;
    position: relative;
}

.current {
    display: block;
    position: relative;
    width: inherit;
    height: inherit;
    font-size: 18px;
    padding-left: 35px;
    text-align: left;
    background-color: transparent;
    border: solid 2px var(--gray-light);
    color: var(--gray-light);
    cursor: pointer;
    border-radius: 10px;
    
    &:hover {
        background-color: var(--gray-light);
        color: var(--gray-super-dark);
    }
    
    &::after {
        content: "";
        position: absolute;
        left: 15px;
        top: 50%;
        width: 6px;
        height: 6px;
        border: solid var(--gray-light);
        border-width: 0 2px 2px 0;
        transform: translateY(-70%) rotate(45deg);
    }
    
    &:hover::after {
        border-color: var(--gray-super-dark);
    }
    
    .options:not(.is-hidden) + &::after {
        transform: translateY(-50%) rotate(225deg);
    }
}

.options {
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

    &.is-hidden {
        display: none;
    }
}

.option {
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
    
    .option-wrapper:first-child & {
        border-radius: 5px 5px 0 0;
    }
    
    .option-wrapper:last-child & {
        border-radius: 0 0 5px 5px;
    }
}
</style>

<div class="wrapper">
    <section class="options is-hidden"></section>
    <button class="current"></button>
</div>`;

export default class DropdownComponent extends HTMLElement {
    static selector = 'app-dropdown';

    current;
    optionsMap = new Map();

    elems = {};

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'closed'});
        shadow.appendChild(template.content.cloneNode(true));

        this.elems = {
            current: shadow.querySelector('.current'),
            options: shadow.querySelector('.options'),
        };

        this.elems.current
            .addEventListener('click', () => this.elems.options.classList.toggle('is-hidden'));

        this.elems.options
            .addEventListener('click', e => this.#handleSelectionChanged(e));
    }

    connectedCallback() {
        // close dropdown when clicking outside
        document.addEventListener('click', e => {
            const composedTarget = e.composedPath()[0];

            if (composedTarget.localName !== this.localName) {
                this.elems.options.classList.add('is-hidden');
            }
        })

        this.render(this.optionsMap, this.current);
    }

    render(optionsMap, selectedOption) {
        this.optionsMap = optionsMap;
        this.current = selectedOption;

        this.elems.current.innerText = optionsMap.get(selectedOption);

        let id = 1;
        for (let [value, displayName] of optionsMap) {
            this.elems.options.innerHTML += `
            <div class="option-wrapper">
                <label class="option" for="${"option" + id}">${displayName}</label>
                <input type="radio" id="${"option" + id}" value="${value}"/>
            </div>`;

            id++;
        }
    }

    #handleSelectionChanged(event) {
        if (!event.target.classList.contains('option')) {
            return;
        }

        const selectedOption = event.target.nextElementSibling.value;
        this.elems.options.classList.toggle('is-hidden');

        if (selectedOption === this.current) {
            return;
        }

        this.elems.current.innerText = this.optionsMap.get(selectedOption);

        this.dispatchEvent(new CustomEvent('selection-changed', {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {oldValue: this.current, newValue: selectedOption}
        }));

        this.current = selectedOption;
    }
}