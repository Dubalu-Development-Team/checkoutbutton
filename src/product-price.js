export class ProductPrice {
  constructor({ container, productPrice, currency }) {
    this.container = container;
    this.currency = currency;
    this.productPrice = productPrice;
  }

  render() {
    this.productPriceElem = document.createElement('p');
    this.productPriceElem.className = 'dub-item-price';
    this.productPriceElem.textContent = `${this.productPrice} ${this.currency}`;
    this.container.appendChild(this.productPriceElem);
  }

  setPrice(price) {
    this.productPrice = price;
    this.productPriceElem.textContent = `${this.productPrice} ${this.currency}`;
  }
}
