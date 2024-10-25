import qs from 'qs';
import { getProduct, getProducts } from './request/orders';
import {
  getProductsFilteredbyValues,
  getVariantsFilteredbyValues,
  paramReplace,
} from './utils';

import styles from './styles.css';
// constants
const checkoutExpressPath = 'comprar-articulo/:businessID/:productID';

async function checkoutButton({ mashupID, productID, shopUrl, containerID }) {
  // global variables
  let product = {};
  let subProducts = [];
  let productBusinessID = null;

  let quantityShoppingCart = 1;
  let valuesVariants = {};

  const root = document.getElementById(containerID);
  if (!root) {
    throw new Error('element whit id checkout-button-container not found');
  }

  root.innerHTML = '';

  async function fetchProduct() {
    return Promise.all([
      getProduct(mashupID, productID).then(r => {
        product = r;
        productBusinessID = r.owner;
      }),
      getProducts(mashupID, {
        parent: productID,
        state: 'child',
        limit: 100,
      }).then(r => {
        subProducts = r.results;
      }),
    ]).catch(e => {
      console.error('failed to fetch product');
      throw e;
    });
  }

  function render() {
    let productListPrice = product.list_price || 0;

    const allVariants = getVariantsFilteredbyValues({}, subProducts);
    const availableVariants = getVariantsFilteredbyValues(
      valuesVariants,
      subProducts,
    );

    const container = document.createElement('div');
    container.className = 'dub-item';
    // Product name
    const productNameElem = document.createElement('p');
    productNameElem.className = 'dub-item-name';
    productNameElem.textContent = product.name;

    // Product description
    const productDescriptionElem = document.createElement('p');
    productDescriptionElem.className = 'dub-item-description';
    productDescriptionElem.textContent = product.plain_description;

    // Product price
    const productPriceElem = document.createElement('p');
    productPriceElem.className = 'dub-item-price';
    productPriceElem.textContent = `$${productListPrice} MXM`;

    // laber for
    const shippingInfoElem = document.createElement('p');
    shippingInfoElem.className = 'dub-item-legend';
    shippingInfoElem.textContent =
      'Los gastos de envío se calculan en la pantalla de pago.';

    // purchase button
    const purchaseButton = document.createElement('button');
    purchaseButton.className = 'dub-item-button';
    purchaseButton.textContent = 'COMPRAR AHORA';
    purchaseButton.addEventListener('click', () => {
      let productId = product.id;
      const queryParams = new URLSearchParams(window.location.search);
      const paramsObj = { quantity: quantityShoppingCart };
      if (queryParams.has('referral')) {
        paramsObj.referral = queryParams.get('referral');
      }
      if (queryParams.has('campaign')) {
        paramsObj.campaign = queryParams.get('campaign');
      }
      if (queryParams.has('click_id')) {
        paramsObj.click_id = queryParams.get('click_id');
      }
      if (subProducts && subProducts.length) {
        const filteredSubProduts = getProductsFilteredbyValues(
          valuesVariants,
          subProducts,
        );

        productId = filteredSubProduts[0].id;
      }

      window.location.href = `${shopUrl}${paramReplace(checkoutExpressPath, {
        businessID: productBusinessID,
        productID: productId,
      })}/?${qs.stringify(paramsObj)}`;
    });

    // const outOfStockElem = document.createElement('p');
    // outOfStockElem.className =
    //   'mt-4 bg-red-500 py-3 text-center text-sm font-bold text-white';
    // outOfStockElem.textContent = '¡Producto agotado!';

    //  ----------  Selector for amount ----------
    const quantityLabel = document.createElement('div');
    quantityLabel.className = 'dub-item-quantity-name';
    quantityLabel.textContent = 'Cantidad:';

    // Container
    const quantityContainer = document.createElement('div');
    quantityContainer.className = 'dub-item-quantity';

    // Button rest
    const restButton = document.createElement('button');
    restButton.className = 'dub-item-quantity-remove';
    restButton.title = 'Quitar';
    // restButton.disabled = !enambleEdit;
    restButton.innerHTML = '<span>-</span>';
    restButton.addEventListener('click', e => {
      quantityShoppingCart -= 1;
      quantityInput.value = quantityShoppingCart;
    });

    // Input
    const quantityInput = document.createElement('input');
    quantityInput.value = quantityShoppingCart;
    quantityInput.className = 'dub-item-quantity-input';
    quantityInput.placeholder = 'cantidad';
    quantityInput.type = 'number';
    quantityInput.min = 1;
    // quantityInput.disabled = !enambleEdit;

    quantityInput.addEventListener('change', e => {
      quantityShoppingCart = e.target.value;
    });
    quantityInput.addEventListener('wheel', e => {
      e.target.blur();
    });
    quantityInput.addEventListener('keydown', e => {
      const key = e.key;
      if (['e', '-', '.'].includes(key)) {
        e.preventDefault();
      }
    });

    // Botton add
    const addButton = document.createElement('button');
    addButton.className = 'dub-item-quantity-add';
    addButton.title = 'Agregar';
    // addButton.disabled = !enambleEdit;
    addButton.innerHTML = '<span>+</span>';
    addButton.addEventListener('click', e => {
      quantityShoppingCart += 1;
      quantityInput.value = quantityShoppingCart;
    });

    // Agregar elementos al contenedor flex
    quantityContainer.appendChild(restButton);
    quantityContainer.appendChild(quantityInput);
    quantityContainer.appendChild(addButton);

    // ----------- Product variants -----------------------

    // container
    const containerVariants = document.createElement('div');
    containerVariants.className = `dub-item-variant-container`;

    // render variants
    Object.keys(allVariants).forEach((variantKey, i, arr) => {
      const currentAllVariants = allVariants[variantKey];
      const currentAvailableVariant = availableVariants[variantKey];

      // Crear grupo de formulario
      const formGroup = document.createElement('div');
      formGroup.id = `FormGroup-${variantKey}`;

      // Crear etiqueta
      const label = document.createElement('label');
      label.htmlFor = `select_${variantKey}`;
      // label.className =
      //   addToCartError && !valuesVariants[variantKey]
      //     ? 'text-capitalize text-danger'
      //     : '';

      // if (showLabelSelect) {
      label.textContent = variantKey;
      // }

      // Crear select
      const select = document.createElement('select');
      select.className = `dub-item-variant-select ${
        // addToCartError
        false && !valuesVariants[variantKey] ? 'text-error' : ''
      }`;
      select.name = `select_${variantKey}`;
      select.id = `select_${variantKey}`;
      select.value = valuesVariants[variantKey] || '';

      // Opción deshabilitada
      const defaultOption = document.createElement('option');
      defaultOption.disabled = true;
      defaultOption.value = '';
      defaultOption.textContent = variantKey;
      select.appendChild(defaultOption);

      // Crear opciones
      currentAllVariants.forEach(variantValue => {
        const option = document.createElement('option');
        option.value = variantValue;
        option.textContent = variantValue;
        option.disabled =
          !currentAvailableVariant.includes(variantValue) &&
          !valuesVariants[variantKey];
        select.appendChild(option);
      });

      // Manejar el cambio en el select
      select.addEventListener('change', e => {
        valuesVariants[variantKey] = e.target.value;
        const filteredSubProduts = getProductsFilteredbyValues(
          valuesVariants,
          subProducts,
        );

        if (
          filteredSubProduts.length === 1 &&
          Object.values(valuesVariants).length === arr.length
        ) {
          const subProductPrice = filteredSubProduts[0].list_price;
          productPriceElem.textContent = subProductPrice;
          productListPrice = subProductPrice;
        }
      });

      // Agregar etiqueta y select al grupo de formulario
      formGroup.appendChild(label);
      formGroup.appendChild(select);

      // Agregar grupo de formulario al contenedor
      containerVariants.appendChild(formGroup);
    });

    // Add elements to main container
    container.appendChild(productNameElem);
    container.appendChild(productDescriptionElem);
    container.appendChild(productPriceElem);
    container.appendChild(shippingInfoElem);
    container.appendChild(containerVariants);
    container.appendChild(quantityContainer);
    container.appendChild(purchaseButton);

    root.appendChild(container);
  }
  // execution
  await fetchProduct();
  render();
}

window.checkoutButton = checkoutButton;
