export class QuantityControl {
  constructor({ container, initialQuantity = 1, disabled = true }) {
    this.quantity = initialQuantity;
    this.container = container;
    this.disabled = disabled;
  }

  render() {
    const quantityContainer = document.createElement('div');
    quantityContainer.className = 'dub-item-quantity';
    const quantityLabel = document.createElement('div');
    quantityLabel.className = 'dub-item-quantity-name';
    quantityLabel.textContent = 'Cantidad:';

    const restButton = document.createElement('button');
    restButton.className = 'dub-item-quantity-remove';
    restButton.innerHTML = '<span>-</span>';
    restButton.title = 'Quitar';
    restButton.disabled = this.disabled;
    restButton.addEventListener('click', () => this.updateQuantity(-1));

    const addButton = document.createElement('button');
    addButton.className = 'dub-item-quantity-add';
    addButton.title = 'Agregar';
    addButton.innerHTML = '<span>+</span>';
    addButton.disabled = this.disabled;
    addButton.addEventListener('click', () => this.updateQuantity(1));

    this.quantityInput = document.createElement('input');
    this.quantityInput.value = this.quantity;
    this.quantityInput.disabled = this.disabled;
    this.quantityInput.addEventListener('change', e =>
      this.setQuantity(e.target.value),
    );

    // quantityContainer.appendChild(quantityLabel);
    quantityContainer.appendChild(restButton);
    quantityContainer.appendChild(this.quantityInput);
    quantityContainer.appendChild(addButton);

    this.container.appendChild(quantityContainer);
  }

  updateQuantity(delta) {
    this.quantity = Math.max(1, this.quantity + delta);
    this.quantityInput.value = this.quantity;
  }

  setQuantity(value) {
    this.quantity = Math.max(1, parseInt(value, 10) || 1);
    this.quantityInput.value = this.quantity;
  }

  enable() {
    this.disabled = false;
    [this.quantityInput, ...this.container.querySelectorAll('button')].forEach(
      elem => (elem.disabled = false),
    );
  }
}
