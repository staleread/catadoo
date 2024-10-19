import Product from "../models/product.model.js";
import ProductsInfo from "../models/products-info.model.js";

export default class ProductService {
    #PRODUCT_LIST_ID = 'shop_products';
    #products = [];

    static getTotalPrice = (products) => products.map(p => p.price).reduce((a, b) => a + b, 0);

    async get(id) {
        await this.#fetchItems()

        const product = this.#products.find(p => p.id === id);

        if (!product) {
            throw new Error('Not found');
        }
        return product;
    }

    async getProductsInfo(productNameFilter) {
        await this.#fetchItems();

        let products = this.#products;

        if (productNameFilter) {
            products = products
                .filter(p => p.name.toLowerCase().includes(productNameFilter.toLowerCase()));
        }

        products.sort((a, b) => a.name.localeCompare(b.name));

        const totalPrice = ProductService.getTotalPrice(products);
        return new ProductsInfo(products, totalPrice);
    }

    async add(dto) {
        if (!dto.name || dto.name.match(/^ *$/)) {
            throw new Error('Please enter the name');
        }

        if (isNaN(dto.price) || dto.price < 0) {
            throw new Error('Please enter the valid price');
        }

        if (!dto.imageUrl) {
            throw new Error('Please add the image URL');
        }

        await this.#fetchItems();

        if (this.#products.find(p => p.name === dto.name)) {
            throw new Error('The name is already in use');
        }

        let product = new Product(crypto.randomUUID(), dto.name, dto.price, dto.imageUrl);
        this.#products.push(product);

        await this.#saveChanges();
    }

    async update(dto) {
        if (!dto.name || dto.name.match(/^ *$/)) {
            throw new Error('Invalid product name');
        }

        if (typeof dto.price !== 'number' || dto.price < 0) {
            throw new Error('Invalid product price');
        }

        if (!dto.imageUrl) {
            throw new Error('Please add the image URL');
        }

        let product = await this.get(dto.id);

        product.name = dto.name;
        product.price = dto.price;
        product.imageUrl = dto.imageUrl;

        await this.#saveChanges();
    }

    async delete(id) {
        await this.#fetchItems();

        const index = this.#products.findIndex(p => p.id === id);
        this.#products.splice(index, 1);

        await this.#saveChanges();
    }

    async #fetchItems() {
        await new Promise((resolve) => {
            setTimeout(() => {
                let productsStr = localStorage.getItem(this.#PRODUCT_LIST_ID);

                this.#products = productsStr
                    ? JSON.parse(productsStr)
                    : [];

                resolve();
            }, 1000);
        });
    }

    async #saveChanges() {
        await new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem(this.#PRODUCT_LIST_ID, JSON.stringify(this.#products))
                resolve();
            }, 1000);
        });
    }
}