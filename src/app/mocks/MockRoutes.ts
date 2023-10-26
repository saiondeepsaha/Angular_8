// mocking the routes for testing


import { Component } from '@angular/core';

@Component({
  template: ''
})
export class MockComponent {

}

export const MockRoutes = [
  {
    path: "login/:userType",
    component: MockComponent
  },
  {
    path: "register/:userType",
    component: MockComponent
  },
  {
    path: "home/:userType",
    component: MockComponent
  },
  {
    path: "profile/:userType",
    component: MockComponent
  },
  {
    path: "farmer-save-product",
    component: MockComponent
  },
  {
    path: "farmer-save-product/:product",
    component: MockComponent
  }
]

