import {
  getProductsFilteredbyValues,
  getVariantsFilteredbyValues,
} from './utils';
export class VariantSelector {
  constructor({ container, subProducts, onChange }) {
    this.container = container;
    this.allVariants = getVariantsFilteredbyValues({}, subProducts);
    this.subProducts = subProducts;
    this.valuesVariants = {};
    this.onChange = onChange;
  }

  render() {
    const containerVariants = document.createElement('div');
    containerVariants.className = `dub-item-variant-container`;
    Object.keys(this.allVariants).forEach(variantKey => {
      const formGroup = document.createElement('div');
      formGroup.id = `FormGroup-${variantKey}`;

      const label = document.createElement('label');
      label.htmlFor = `select_${variantKey}`;
      label.textContent = variantKey;

      const options = this.allVariants[variantKey];
      const select = document.createElement('select');
      select.className = `dub-item-variant-select ${
        // addToCartError
        false && !this.valuesVariants[variantKey] ? 'text-error' : ''
      }`;
      select.value = this.valuesVariants[variantKey] || '';
      select.id = `select_${variantKey}`;
      select.name = `select_${variantKey}`;
      select.addEventListener('change', e =>
        this.handleSelectChange(e, variantKey),
      );

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = `${variantKey}`;
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
