const pageHeaderTemplate = document.createElement('template')

pageHeaderTemplate.innerHTML = `
<style>
* {
    box-sizing: border-box;
    margin: 0;
}

:host {
    display: block;
    padding: 30px 0;
}

header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: space-between;
    align-items: center;
}

::slotted([slot="title"]) {
    display: block;
    font-weight: 400;
    font-size: 40px;
    text-align: left;
}

nav {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 10px;
}

::slotted([slot="nav-link"]) {
    width: 150px;
    text-align: center; 
    font-size: 20px;
    border-radius: 7px;
    padding: 10px 30px;
    font-weight: 300;
    border: none;
    opacity: 1;
    background-color: var(--gray-dark);
    color: var(--gray-light);
    cursor: pointer;
}

::slotted([slot="nav-link"]:hover){
    background-color: var(--gray);
}

::slotted([slot="nav-link"][data-active]){
    background-color: var(--gray-light);
}

@media (width <= 700px) {
    header {
        flex-direction: column;
    }
}
</style>

<header>
    <slot name="title"></slot>
    <nav>
        <slot name="nav-link"></slot>
    </nav>
</header>`

class PageHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'})
    }

    render = () => this.shadowRoot.appendChild(pageHeaderTemplate.content.cloneNode(true))

    updateActiveNavOption = (event) => {
        const target = event.target

        if (target.getAttribute('slot') !== 'nav-link') {
            return
        } else if (target.hasAttribute('data-active')) {
            event.preventDefault()
            return;
        }

        event.preventDefault()

        this.shadowRoot.host
            .querySelectorAll('[slot="nav-link"]')
            .forEach(el => delete el.dataset.active)

        target.setAttribute('data-active', '')

        this.dispatchEvent(new CustomEvent('route-changed', {
            bubbles: false,
            cancelable: true,
            detail: {route: target.href}
        }))
    }

    connectedCallback() {
        if (this.rendered) {
            return
        }

        this.render()
        this.rendered = true

        this.shadowRoot
            .querySelector('nav')
            .addEventListener('click', this.updateActiveNavOption)
    }
}

customElements.define('page-header', PageHeader, {extends: null})