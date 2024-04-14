const template = document.createElement('template');

template.innerHTML = `
<style>
form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.title {
    text-align: center;
    font-size: 24px;
    font-weight: 400;
    padding: 10px;
}

label {
    font-size: 14px;
    font-weight: 300;
}

button[type="submit"] {
    padding: 10px;
    border: none;
    border-radius: 10px;
    background-color: #4caf50;
    transition: background-color 0.3s;
    color: var(--white);
    font-weight: 400;
    font-size: 18px;

    &:hover {
        background-color: #45a049;
    }
}

input[type='text'],
input[type='number'] {
    display:block;
    outline: none;
    border: solid 2px var(--gray-light);
    background-color: transparent;
    color: var(--gray-light);
    padding: 4px;
    border-radius: 10px;
    font-size: 18px;

    &:focus {
        color: var(--white);
        border-color: var(--white);
    }
}

input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.js-image-preview {
    display: none;
    max-width: 100%;
    border-radius: 10px;
}
</style>

<h2 class="title">Create Product</h2>

<form method="post" id="create-product" autocomplete="off">
    <label for="image-url">Image Link</label>
    <input class="js-first-input" type="text" id="image-url" name="image-url" autofocus>
    
    <label for="name">Name</label>
    <input type="text" id="name" name="name">
    
    <label for="price">Price</label>
    <input type="number" id="price" name="price">
    
    <img class="js-image-preview" src="#" alt="Preview Image">
    <button type="submit">Submit</button>
</form>`;

export default class ProductCreateForm extends HTMLElement {
    static selector = 'app-product-create-form';

    onValidSubmit = () => {};
    elems = {};

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elems = {
            form: this.shadowRoot.querySelector('form'),
            firstInput: this.shadowRoot.querySelector('.js-first-input'),
            imagePreview: this.shadowRoot.querySelector('.js-image-preview')
        };

        this.shadowRoot
            .querySelector('#image-url')
            .addEventListener('change', (e) => this.updateImagePreview(e.target.value));

        this.elems.form
            .addEventListener('submit', (e) => this.handleSubmit(e));
    }

    connectedCallback() {
        document.activeElement.blur();
        this.elems.firstInput.focus();
    }

    async handleSubmit(event) {
        event.preventDefault();

        const name = this.elems.form.name.value;
        const price = parseInt(this.elems.form.price.value);
        const imageUrl = this.elems.form.elements['image-url'].value;

        if (!imageUrl) {
            alert('Please enter image link');
            return;
        }
        if (!name) {
            alert('Enter valid product name');
            return;
        }
        if (isNaN(price) || price < 1) {
            alert('Enter valid product price');
            return;
        }

        const dto = {
            name: name,
            price: price,
            imageUrl: imageUrl
        };

        try {
            await this.onValidSubmit(dto);
            this.elems.form.reset();
        } catch (err) {
            alert(err.message);
        }
    }

    updateImagePreview(imageSrc) {
        if (!imageSrc) {
            this.elems.imagePreview.style.display = 'none';
            return;
        }

        this.elems.imagePreview.style.display = 'block';
        this.elems.imagePreview.src = imageSrc;
    }
}