export class ProductCreateDto {
    name;
    price;
    imageUrl;

    constructor(name, price, imageUrl) {
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
    }
}