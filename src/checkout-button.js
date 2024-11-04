import qs from 'qs';
import { getProductsFilteredbyValues, paramReplace } from './utils';
// Constants
const checkoutExpressPath = 'comprar-articulo/:businessID/:productID';
export class ProductCheckoutButton {
  constructor({
    container,
    product,
    shopUrl,
    quantityControl,
    valuesVariants,
    subProducts,
    productBusinessID,
  }) {
    this.container = container;
    this.product = product;
    this.shopUrl = shopUrl;
    this.quantityControl = quantityControl;
    this.valuesVariants = valuesVariants;
    this.subProducts = subProducts;
    this.productBusinessID = productBusinessID;
  }

  render() {
    const button = document.createElement('button');
    button.className = 'dub-item-button';
    button.textContent = 'COMPRAR AHORA';
    button.addEventListener('click', () => this.checkout());
    this.container.appendChild(button);
  }

  checkout() {
    let productId = this.product.id;
    const queryParams = new URLSearchParams(window.location.search);
    const paramsObj = { quantity: this.quantityControl.getQuantity() };
    if (queryParams.has('referral')) {
      paramsObj.referral = queryParams.get('referral');
    }
    if (queryParams.has('campaign')) {
      paramsObj.campaign = queryParams.get('campaign');
    }
    if (queryParams.has('click_id')) {
      paramsObj.click_id = queryParams.get('click_id');
    }
    if (this.subProducts && this.subProducts.length) {
      const filteredSubProduts = getProductsFilteredbyValues(
        this.valuesVariants,
        this.subProducts,
      );

      productId = filteredSubProduts[0].id;
    }

    window.location.href = `${this.shopUrl}${paramReplace(checkoutExpressPath, {
      businessID: this.productBusinessID,
      productID: productId,
    })}/?${qs.stringify(paramsObj)}`;
  }
}
