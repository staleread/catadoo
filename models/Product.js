export class Product {
    id;
    name;
    price;
    imageUrl;

    static create(name, price, imageUrl) {
        const product = new Product()

        product.id = crypto.randomUUID()
        product.name = name
        product.price = price
        product.imageUrl = imageUrl

        return product
    }

    static fromObject(obj) {
        const product = new Product()

        product.id = obj.id
        product.name = obj.name
        product.price = obj.price
        product.imageUrl = obj.imageUrl

        return product
    }

    getId() {
        return this.id;
    }
}