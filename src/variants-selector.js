export class VariantSelector {
  constructor({ container, allVariants, subProducts, onChange }) {
    this.container = container;
    this.allVariants = allVariants;
    this.subProducts = subProducts;
    this.valuesVariants = {};
    this.onChange = onChange;
  }

  //  // container
  //  const containerVariants = document.createElement('div');
  //  containerVariants.className = `dub-item-variant-container`;

  //  // render variants
  //  Object.keys(allVariants).forEach((variantKey, i, arr) => {
  //    const currentAllVariants = allVariants[variantKey];
  //    const currentAvailableVariant = availableVariants[variantKey];

  //    // Crear grupo de formulario
  //    const formGroup = document.createElement('div');
  //    formGroup.id = `FormGroup-${variantKey}`;

  //    // Crear etiqueta
  //    const label = document.createElement('label');
  //    label.htmlFor = `select_${variantKey}`;
  //    // label.className =
  //    //   addToCartError && !valuesVariants[variantKey]
  //    //     ? 'text-capitalize text-danger'
  //    //     : '';

  //    // if (showLabelSelect) {
  //    label.textContent = variantKey;
  //    // }

  //    // Crear select
  //    const select = document.createElement('select');
  //    select.className = `dub-item-variant-select ${
  //      // addToCartError
  //      false && !valuesVariants[variantKey] ? 'text-error' : ''
  //    }`;
  //    select.name = `select_${variantKey}`;
  //    select.id = `select_${variantKey}`;
  //    select.value = valuesVariants[variantKey] || '';

  //    // Opción deshabilitada
  //    const defaultOption = document.createElement('option');
  //    defaultOption.disabled = true;
  //    defaultOption.value = '';
  //    defaultOption.textContent = variantKey;
  //    select.appendChild(defaultOption);

  //    // Crear opciones
  //    currentAllVariants.forEach(variantValue => {
  //      const option = document.createElement('option');
  //      option.value = variantValue;
  //      option.textContent = variantValue;
  //      option.disabled =
  //        !currentAvailableVariant.includes(variantValue) &&
  //        !valuesVariants[variantKey];
  //      select.appendChild(option);
  //    });

  //    // Manejar el cambio en el select
  //    select.addEventListener('change', e => {
  //      valuesVariants[variantKey] = e.target.value;
  //      const filteredSubProduts = getProductsFilteredbyValues(
  //        valuesVariants,
  //        subProducts,
  //      );

  //      if (image) {
  //        const subProductPhotos = filteredSubProduts[0].photos;
  //        image.src = subProductPhotos[0];
  //        productPhotos = subProductPhotos;
  //      }

  //      if (
  //        filteredSubProduts.length === 1 &&
  //        Object.values(valuesVariants).length === arr.length
  //      ) {
  //        const subProductPrice = filteredSubProduts[0].list_price;
  //        productPriceElem.textContent = `${MXPrice.format(productListPrice)} MXN`;
  //        productListPrice = subProductPrice;
  //      }

  //      // Verificar si se han seleccionado todas las variantes necesarias
  //      const allSelected = Object.keys(allVariants).every(
  //        key => valuesVariants[key],
  //      );

  //      // Habilitar controles de cantidad si todas las variantes están seleccionadas
  //      if (allSelected) {
  //        restButton.disabled = false;
  //        quantityInput.disabled = false;
  //        addButton.disabled = false;
  //      }
  //    });

  //    // Agregar etiqueta y select al grupo de formulario
  //    formGroup.appendChild(label);
  //    formGroup.appendChild(select);

  //    // Agregar grupo de formulario al contenedor
  //    containerVariants.appendChild(formGroup);
  //  });

  render() {
    const containerVariants = document.createElement('div');
    containerVariants.className = `dub-item-variant-container`;
    Object.keys(this.allVariants).forEach(variantKey => {
      const formGroup = document.createElement('div');

      const label = document.createElement('label');
      label.textContent = variantKey;

      const options = this.allVariants[variantKey];
      const select = document.createElement('select');
      select.id = `select_${variantKey}`;
      select.name = `select_${variantKey}`;
      select.addEventListener('change', e =>
        this.handleSelectChange(e, variantKey),
      );

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = `Seleccionar ${variantKey}`;
      defaultOption.disabled = true;
      select.appendChild(defaultOption);

      options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        select.appendChild(option);
      });

      formGroup.appendChild(label);
      formGroup.appendChild(select);
      containerVariants.appendChild(formGroup);
    });
    this.container.appendChild(containerVariants);
  }

  handleSelectChange(event, variantKey) {
    this.valuesVariants[variantKey] = event.target.value;
    const filteredSubProducts = getProductsFilteredbyValues(
      this.valuesVariants,
      this.subProducts,
    );
    this.updateSelectors(variantKey, filteredSubProducts);
    this.onChange(this.valuesVariants, filteredSubProducts);
  }

  updateSelectors(currentKey, filteredSubProducts) {
    const availableVariants = getVariantsFilteredbyValues(
      this.valuesVariants,
      filteredSubProducts,
    );
    Object.keys(this.allVariants).forEach(key => {
      if (key === currentKey) return;
      const select = document.getElementById(`select_${key}`);
      Array.from(select.options).forEach(option => {
        if (option.value) {
          option.disabled = !availableVariants[key].includes(option.value);
        }
      });
      if (
        this.valuesVariants[key] &&
        !availableVariants[key].includes(this.valuesVariants[key])
      ) {
        select.value = '';
        delete this.valuesVariants[key];
      }
    });
  }
}
