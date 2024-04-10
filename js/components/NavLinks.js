const template = document.createElement('template')

template.innerHTML = `
<style>
.links-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    list-style: none;
    padding-left: 20px;
}

::slotted([slot="nav-link"]) {
    font-size: 20px;
    border-radius: 10px;
    padding: 20px;
    font-weight: 300;
    border: none;
    opacity: 1;
    background-color: var(--gray-dark);
    color: var(--gray-light);
    cursor: pointer;
}

::slotted([slot="nav-link"]:hover) {
    background-color: var(--gray);
}

</style>
<nav>
    <ul class="links-container">
        <slot name="nav-link"><li></li></slot>
    </ul>
</nav>`

class NavLinks extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" })
        shadow.appendChild(template.content.cloneNode(true))
    }
}

customElements.define('nav-links', NavLinks)