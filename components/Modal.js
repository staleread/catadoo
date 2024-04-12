class Modal extends HTMLElement {
    template = () => `
    <style>
    * {
        box-sizing: border-box;
        margin: 0;
    }
    
    .modal {
        display: block;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
    
    .modal .modal__inner {
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
    
    ::slotted([slot="title"]) {
        text-align: center;
        font-size: 24px;
        font-weight: 400;
        padding: 10px;
    }
    </style>
    
    <div class="modal">
        <div class="modal__inner">
            <slot name="title"></slot>
            <slot></slot>
        </div>
    </div>`

    render = () => this.shadowRoot.innerHTML = this.template().trim()

    updateVisibility(event) {
        const target = event.target

        if (!target.classList.contains('modal')) {
            return
        }

        target.style.display = 'none';
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        if (this.rendered) {
            return
        }

        this.render()
        this.rendered = true

        this.shadowRoot
            .querySelector('.modal')
            .addEventListener('click', this.updateVisibility)
    }

    static get observedAttributes() {
        return ['hidden']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'hidden') {
            return
        }

        console.log(oldValue)
        console.log(newValue)
    }
}

customElements.define('custom-modal', Modal)