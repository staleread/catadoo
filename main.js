import {ProductService} from "./services/ProductService.js";

document.addEventListener('DOMContentLoaded', () => {
    const productService = new ProductService()

    const productList = document.getElementById('js-product-list')
    const productMenu = document.getElementById('js-product-menu')

    productMenu.addEventListener('filter-changed', (e) => {
        productList.renderProducts(productService.getProductsInfo(e.detail.filter))
    })

    productMenu.addEventListener('add-product', () => {
        alert('Adding a product')
    })

    productList.renderProducts(productService.getProductsInfo())
})