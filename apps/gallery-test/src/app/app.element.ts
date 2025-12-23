import './app.element.scss';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    this.innerHTML = `
      <div>Hello!</div>
      `;
  }
}
customElements.define('light-matter-root', AppElement);
