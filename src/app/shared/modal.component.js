const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

.modal-wrapper {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper .modal {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    
    background-color: var(--gray-dark);
    padding: 20px;
    width: 300px;
    border-radius: 10px;
    color: var(--white);
}
</style>

<div class="modal-wrapper">
    <div class="modal">
        <slot name="title"></slot>
        <slot></slot>
    </div>
</div>`;

export default class ModalComponent extends HTMLElement {
    static selector = 'app-modal';

    elems = {};

    static get observedAttributes() {
        return ['is-hidden']
    }

    get isOpen() {
        return this.getAttribute('is-hidden') === 'false';
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            wrapper: this.shadowRoot.querySelector('.modal-wrapper')
        };

        this.elems.wrapper.addEventListener('mousedown', e => {
            if (e.target.classList.contains('modal-wrapper')) {
                this.hide();
            }
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'is-hidden') {
            this.elems.wrapper.style.display = newValue === 'true' ? 'none' : 'block';
        }
    }

    hide() {
        this.elems.wrapper.style.display = 'none';
        this.setAttribute('is-hidden', 'true');
    }

    show() {
        this.elems.wrapper.style.display = 'block';
        this.setAttribute('is-hidden', 'false');
    }
}