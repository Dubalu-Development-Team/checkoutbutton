import qs from 'qs';
import { getProduct, getProducts } from './request/orders';
import {
  getProductsFilteredbyValues,
  getVariantsFilteredbyValues,
  paramReplace,
} from './utils';

// constants
const checkoutExpressPath = 'comprar-articulo/:businessID/:productID';

async function initProduct({ mashupID, productID, shopUrl }) {
  // global variables
  let product = {};
  let subProducts = [];
  let productBusinessID = null;

  let quantityShoppingCart = 1;
  let valuesVariants = {};

  // const mashupID = '~2RtpU94f9CnoO5a';
  // const productID = '~2m7JYMEyHDgtn';
  // const shopUrl = 'https://rocioshop.com/';

  const root = document.getElementById('checkout-button-container');
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
    ])
      .catch(
        () => {},
        // setProducError(true)
      )
      .finally(() => {
        // setProducLoading(false);
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
    // Limpiar el contenedor antes de volver a renderizar

    // Crear y agregar elementos
    const productNameElem = document.createElement('p');
    productNameElem.className = 'text-2xl font-bold';
    productNameElem.textContent = product.name;

    const productDescriptionElem = document.createElement('p');
    productDescriptionElem.className = 'pt-2 text-xs leading-5';
    productDescriptionElem.textContent = 'productDescriptionPlainTruncate';

    const productPriceElem = document.createElement('p');
    productPriceElem.className = 'pt-2 text-3xl font-light';
    productPriceElem.textContent = `$${productListPrice} MXM`;

    const shippingInfoElem = document.createElement('p');
    shippingInfoElem.className = 'pb-5 text-xs';
    shippingInfoElem.textContent =
      'Los gastos de envío se calculan en la pantalla de pago.';

    const purchaseButton = document.createElement('button');
    purchaseButton.className = `${'bg-[#f6c251]'} ${'hover:bg-yellow-600'} rounded-full h-[42px]`;
    purchaseButton.textContent = 'COMPRAR AHORA';
    // purchaseButton.disabled = loadingBtn || productAvailable === 0;
    purchaseButton.addEventListener('click', () => {
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
      window.location.href = `${shopUrl}${paramReplace(checkoutExpressPath, {
        businessID: productBusinessID,
        productID,
      })}/?${qs.stringify(paramsObj)}`;
    });

    // const outOfStockElem = document.createElement('p');
    // outOfStockElem.className =
    //   'mt-4 bg-red-500 py-3 text-center text-sm font-bold text-white';
    // outOfStockElem.textContent = '¡Producto agotado!';

    //  ----------  Selector de cantidad de articulos ----------
    // Crear texto de cantidad
    const quantityLabel = document.createElement('div');
    quantityLabel.className = 'text-md';
    quantityLabel.textContent = 'Cantidad:';

    // Crear contenedor para los botones y el input
    const quantityContainer = document.createElement('div');
    quantityContainer.className = 'flex pt-2';

    // Botón de restar
    const restButton = document.createElement('button');
    restButton.className =
      'block max-w-[50px] text-center transform transition duration-500 hover:scale-110 bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:stroke-slate-400 disabled:text-slate-400 disabled:hover:bg-slate-100';
    restButton.title = 'Quitar';
    // restButton.disabled = !enambleEdit;
    restButton.innerHTML = '<span class="text-dark text-lg">-</span>';
    restButton.addEventListener('click', e => {
      quantityShoppingCart -= 1;
      quantityInput.value = quantityShoppingCart;
    });

    // Input de cantidad
    const quantityInput = document.createElement('input');
    quantityInput.value = quantityShoppingCart;
    quantityInput.className =
      'bg-gray-50 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-[50px] text-center p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
    quantityInput.placeholder = 'cantidad';
    quantityInput.type = 'number';
    quantityInput.min = 1;
    // quantityInput.disabled = !enambleEdit;

    // quantityInput.addEventListener('change', e => {
    //   addValueShoppingCart(e);
    // });

    quantityInput.addEventListener('wheel', e => {
      e.target.blur();
    });

    // quantityInput.addEventListener('keydown', e => {
    //   const key = e.key;
    //   if (['e', '-', '.'].includes(key)) {
    //     e.preventDefault();
    //   }
    // });

    // Botón de agregar
    const addButton = document.createElement('button');
    addButton.className =
      'block max-w-[50px] text-center transform transition duration-500 hover:scale-110 bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:stroke-slate-400 disabled:text-slate-400 disabled:hover:bg-slate-100';
    addButton.title = 'Agregar';
    // addButton.disabled = !enambleEdit;
    addButton.innerHTML = '<span class="text-dark text-lg">+</span>';
    addButton.addEventListener('click', e => {
      quantityShoppingCart += 1;
      quantityInput.value = quantityShoppingCart;
    });

    // Agregar elementos al contenedor flex
    quantityContainer.appendChild(restButton);
    quantityContainer.appendChild(quantityInput);
    quantityContainer.appendChild(addButton);

    //  ----------  Selector de cantidad de articulos ----------

    // ----------- Selector de variantes -----------------------

    // Crear contenedor principal
    const containerVariants = document.createElement('div');
    containerVariants.className = `flex items-center gap-x-6`;

    // Renderizar las variantes
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
      select.className = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
        // addToCartError
        false && !valuesVariants[variantKey] ? 'text-red-500' : ''
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
        // onSelectVariant(
        //   {
        //     [variantKey]: e.target.value,
        //   },
        //   currentAvailableVariant.includes(e.target.value),
        // );
      });

      // Agregar etiqueta y select al grupo de formulario
      formGroup.appendChild(label);
      formGroup.appendChild(select);

      // Agregar grupo de formulario al contenedor
      containerVariants.appendChild(formGroup);
    });

    // Agregar elementos al contenedor
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

window.initProduct = initProduct;
