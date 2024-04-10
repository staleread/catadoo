const template = document.createElement('template')

template.innerHTML = `
<style>
:host {
    display: block;
    padding: 20px 0;
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

ul {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
}

::slotted([slot="tab-option"]) {
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

::slotted([slot="tab-option"]:hover){
    background-color: var(--gray);
}

::slotted([slot="tab-option"][data-active]){
    background-color: var(--gray-light);
}

@media (width <= 700px) {
    :host {
        padding: 30px 0;
    }
    
    header {
        flex-direction: column;
    }
}
</style>

<header>
    <slot name="title"></slot>
    
    <nav>
        <ul>
            <slot name="tab-option"></slot>
        </ul>
    </nav>
</header>`

class PageHeader extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.appendChild(template.content.cloneNode(true))

        shadow.querySelector('ul').addEventListener('click',
            (event) => this.updateActiveNavOption(event))
    }

    updateActiveNavOption(event) {
        const target = event.target

        if (target.getAttribute('slot') !== 'tab-option' ||
            target.hasAttribute('data-active')) {
            return
        }

        this.shadowRoot.host.querySelectorAll('[slot="tab-option"]')
            .forEach(el => delete el.dataset.active)

        target.setAttribute('data-active', '')

        this.dispatchEvent(new CustomEvent('active-tab-changed', {
            bubbles: false,
            cancelable: true,
            detail: {tabName: target.innerText}
        }))
    }
}

customElements.define('page-header', PageHeader)