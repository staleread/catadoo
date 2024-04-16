const template = document.createElement('template');

template.innerHTML = `
<style>
* {
    box-sizing: border-box;
    color: var(--white)
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

a {
    text-decoration: none;
}

@media (width <= 700px) {
    header {
        flex-direction: column;
    }
}

nav {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 10px;
}

.title {
    display: block;
    font-weight: 400;
    font-size: 40px;
    text-align: left;
}

.nav-link {
    width: 150px;
    text-align: center; 
    font-size: 20px;
    border-radius: 7px;
    padding: 10px 30px;
    font-weight: 300;
    border: none;
    opacity: 1;
    background-color: var(--gray-dark);
    cursor: pointer;
    
    &:hover {
        background-color: var(--gray);
    }
    
    &[data-active] {
        background-color: var(--gray-light);
    }
}
</style>

<header>
    <h1 class="title">Chapter 6</h1>
    <nav>
        <a class="nav-link" href="/products" data-route="/products" data-active>Shop</a>
        <a class="nav-link" href="/todos" data-route="/todos">Todo List</a>
    </nav>
</header>`;

export default class HeaderComponent extends HTMLElement {
    static selector = 'app-layout-header';

    currentRoute;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot
            .querySelector('nav')
            .addEventListener('click', e => this.#handleActiveNavOptionChanged(e));
    }

    setActiveNavOption(route) {
        this.currentRoute = route;

        this.shadowRoot
            .querySelectorAll('[data-route]')
            .forEach(link => {
                if (link.dataset.route === route) {
                    link.setAttribute('data-active', '');
                } else {
                    link.removeAttribute('data-active');
                }
            });
    }

    #handleActiveNavOptionChanged(event) {
        const target = event.target;

        if (!target.classList.contains('nav-link')) {
            return;
        }

        event.preventDefault();

        if (target.hasAttribute('data-active')) {
            return;
        }

        this.shadowRoot
            .querySelectorAll('.nav-link')
            .forEach(el => delete el.dataset.active);

        target.setAttribute('data-active', '');
        this.currentRoute = target.dataset.route;

        this.dispatchEvent(new CustomEvent('route-changed', {
            bubbles: false,
            cancelable: true,
            detail: {route: this.currentRoute}
        }));
    }
}