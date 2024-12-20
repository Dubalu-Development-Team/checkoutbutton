export class ProductImage {
  constructor({ container, src }) {
    this.container = container;
    this.src = src;
    this.image = null;
  }

  render() {
    const imageContainer = document.createElement('div');
    this.image = document.createElement('img');
    this.image.src = this.src;
    this.image.width = '500';
    imageContainer.appendChild(this.image);
    this.container.appendChild(imageContainer);
  }

  setSrc(src) {
    this.src = src;
    this.image.src = this.src;
  }
  setWidth(width) {
    this.width = width;
    this.image.width = this.width;
  }
}
