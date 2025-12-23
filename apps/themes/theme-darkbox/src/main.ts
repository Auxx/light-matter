import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { Darkbox } from './app/darkbox/darkbox';

createApplication()
  .then(app => {
    customElements.define('theme-darkbox', createCustomElement(Darkbox, { injector: app.injector }));
  })
  .catch(err => console.error(err));
