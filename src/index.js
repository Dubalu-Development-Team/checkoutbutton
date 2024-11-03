import { getProduct, getProducts } from './request/orders';
import { getVariantsFilteredbyValues } from './utils';
// stiles
import styles from './styles.css';

// components
import { ProductCheckoutButton } from './checkout-button';
import { QuantityControl } from './quantity-control';
import { VariantSelector } from './variants-selector';
import { ProductImage } from './product-image';

async function checkoutButton({
  mashupID,
  productID,
  shopUrl,
  containerID,
  showImage,
}) {
  const MXPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  // global variables
  let product = {};
  let subProducts = [];
  let productBusinessID = null;

  // let quantityShoppingCart = 1;
  let valuesVariants = {};

  const root = document.getElementById(containerID);
  if (!root) {
    throw new Error(`Element with ID ${containerID} not found`);
  }
  root.innerHTML = '';
  await Promise.all([
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
  let productListPrice = product.list_price || 0;
  let productDescription = product.plain_description;
  let productPhotos = product.photos;
  const initialDisableStatus = subProducts.length > 0;

  const allVariants = getVariantsFilteredbyValues({}, subProducts);
  const availableVariants = getVariantsFilteredbyValues(
    valuesVariants,
    subProducts,
  );

  const mainContainer = document.createElement('div');
  mainContainer.className = `dub-item ${
    showImage ? 'grid grid-2 gap-2' : null
  }`;

  const container = document.createElement('div');
  container.className = 'dub-item-content';

  const imgContainer = document.createElement('div');
  imgContainer.className = 'dub-item-img';

  // Product name
  const productNameElem = document.createElement('p');
  productNameElem.className = 'dub-item-name';
  productNameElem.textContent = product.name;

  // Product description
  const productDescriptionElem = document.createElement('p');
  productDescriptionElem.className = 'dub-item-description';
  productDescriptionElem.textContent = productDescription.substring(0, 260);

  // Product price
  const productPriceElem = document.createElement('p');
  const productListPriceWithFormat = MXPrice.format(productListPrice);
  productPriceElem.className = 'dub-item-price';
  productPriceElem.textContent = `${productListPriceWithFormat} MXN`;

  // laber for
  const shippingInfoElem = document.createElement('p');
  shippingInfoElem.className = 'dub-item-legend';
  shippingInfoElem.textContent =
    'Los gastos de envío se calculan en la pantalla de pago.';

  const quantityControl = new QuantityControl({ container: container });
  const variantSelector = new VariantSelector({
    container: container,
    // allVariants: getVariantsFilteredbyValues({}, subProducts),
    subProducts,
    onChange: (valuesVariants, filteredSubProducts) => {
      if (
        Object.keys(valuesVariants).length ===
        Object.keys(getVariantsFilteredbyValues({}, subProducts)).length
      ) {
        quantityControl.enable();
      }
    },
  });

  const checkoutButton = new ProductCheckoutButton({
    container: container,
    product,
    shopUrl,
    quantityControl,
    valuesVariants: variantSelector.valuesVariants,
    subProducts,
  });

  const productImage = new ProductImage({
    container: imgContainer,
    src: productPhotos?.[0],
  });
  container.appendChild(productNameElem);
  container.appendChild(productDescriptionElem);
  container.appendChild(productPriceElem);
  container.appendChild(shippingInfoElem);
  variantSelector.render();
  // container.appendChild(containerVariants);
  quantityControl.render();
  // container.appendChild(quantityContainer);
  checkoutButton.render();
  productImage.render();
  // container.appendChild(purchaseButton);
  // if (imageContainer) {
  //   imgContainer.appendChild(imageContainer);
  // }
  mainContainer.appendChild(imgContainer);
  mainContainer.appendChild(container);
  root.appendChild(mainContainer);
}

window.checkoutButton = checkoutButton;
