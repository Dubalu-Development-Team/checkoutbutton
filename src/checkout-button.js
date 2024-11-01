export class ProductCheckoutButton {
  constructor({
    container,
    product,
    shopUrl,
    quantityControl,
    valuesVariants,
    subProducts,
  }) {
    this.container = container;
    this.product = product;
    this.shopUrl = shopUrl;
    this.quantityControl = quantityControl;
    this.valuesVariants = valuesVariants;
    this.subProducts = subProducts;
  }

  render() {
    const button = document.createElement('button');
    button.className = 'dub-item-button';
    button.textContent = 'COMPRAR AHORA';
    button.addEventListener('click', () => this.checkout());
    this.container.appendChild(button);
  }

  checkout() {
    const selectedProduct =
      getProductsFilteredbyValues(this.valuesVariants, this.subProducts)[0] ||
      this.product;
    const queryParams = new URLSearchParams(window.location.search);
    const params = {
      quantity: this.quantityControl.quantity,
      referral: queryParams.get('referral'),
      campaign: queryParams.get('campaign'),
      click_id: queryParams.get('click_id'),
    };
    window.location.href = `${this.shopUrl}${paramReplace(checkoutExpressPath, {
      businessID: this.product.owner,
      productID: selectedProduct.id,
    })}/?${qs.stringify(params)}`;
  }
}
