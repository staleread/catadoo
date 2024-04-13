import {Product} from "../models/product.model.js";
import {ProductsInfo} from "../models/products-info.model.js";

export class ProductService {
    #productListId = 'shop_products';
    #products = [];
    #isUpToDate = false;

    static getTotalPrice = (products) => products.map(p => p.price).reduce((a, b) => a + b, 0)

    get(id) {
        this.#fetchProducts()

        const product = this.#products.find(p => p.getId() === id)
        if (!product) {
            throw new Error('Not found')
        }

        return product
    }

    getProductsInfo(productNameFilter) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.#fetchProducts();

                let products = this.#products;

                if (productNameFilter) {
                    products = products
                        .filter(p => p.name.toLowerCase().includes(productNameFilter.toLowerCase()));
                }

                const totalPrice = ProductService.getTotalPrice(products);
                resolve(new ProductsInfo(products, totalPrice));
            }, 1000);
        });
    }

    add(dto) {
        if (!dto.name || dto.name.match(/^ *$/)) {
            throw new Error('Please enter the name')
        }

        if (isNaN(dto.price) || dto.price < 0) {
            throw new Error('Please enter the valid price')
        }

        if (!dto.imageUrl) {
            throw new Error('Please add the image URL')
        }

        this.#fetchProducts()

        if (this.#products.find(p => p.name === dto.name)) {
            throw new Error('The name is already in use')
        }

        let product = Product.create(dto.name, dto.price, dto.imageUrl)
        this.#products.push(product)

        this.#saveChanges();
    }

    update(dto) {
        if (!dto.name || dto.name.match(/^ *$/)) {
            throw new Error('Invalid product name')
        }

        if (typeof dto.price !== 'number' || dto.price < 0) {
            throw new Error('Invalid product price')
        }

        if (!dto.imageUrl) {
            throw new Error('Please add the image URL')
        }

        let product = this.get(dto.id)

        product.name = dto.name
        product.price = dto.price
        product.imageUrl = dto.imageUrl

        this.#saveChanges()
    }

    delete(id) {
        const index = this.#products.findIndex(p => p.getId() === id);
        this.#products.splice(index, 1)

        this.#saveChanges()
    }

    #fetchProducts() {
        if (this.#isUpToDate) {
            return
        }

        let productsStr = localStorage.getItem(this.#productListId)
        this.#products = productsStr
            ? JSON.parse(productsStr)
                .map(p => new Product(p.id, p.name, p.price, p.imageUrl))
            : []

        this.#isUpToDate = true
    }

    #saveChanges() {
        localStorage.setItem(this.#productListId, JSON.stringify(this.#products))
    }
}