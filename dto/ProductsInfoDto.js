export class ProductsInfoDto {
    #products = []
    totalPrice

    constructor(products, totalPrice) {
        this.#products = products
        this.totalPrice = totalPrice;
    }

    getProducts() {
        return this.#products;
    }
}