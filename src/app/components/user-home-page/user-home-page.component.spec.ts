import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { farmersMenu, customersMenu } from 'src/app/menus/app-menus';
import { MockCustomers } from 'src/app/mocks/MockResponse';
import { MockComponent, MockRoutes } from 'src/app/mocks/MockRoutes';
import { MockFarmersService } from 'src/app/mocks/MockService';
import { FarmersApiService } from 'src/app/service/farmers-api.service';
import { UserMenuOptionsComponent } from '../user-menu-options/user-menu-options.component';
import { UserViewProductsComponent } from '../user-view-products/user-view-products.component';
import { UserHomePageComponent } from "./user-home-page.component";

describe('UserHomePageComponent - Farmer and Customer Home', () => {

  let component: UserHomePageComponent;
  let fixture: ComponentFixture<UserHomePageComponent>;
  let service: FarmersApiService;

  let menu: HTMLElement;
  let products: HTMLElement;
  let users: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(MockRoutes)],
      declarations: [UserHomePageComponent, UserMenuOptionsComponent, UserViewProductsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHomePageComponent);
    component = fixture.componentInstance;
    service = TestBed.get(FarmersApiService);
  });

  let getElm = (selector: any) => {
    let element: HTMLElement = fixture.nativeElement.querySelector(selector);
    return element;
  }

  it('#should menu and view products only exist for farmer home', () => {
    spyOn(service, "getLoggedInUser").and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    products = getElm("app-user-products");
    menu = getElm("app-user-menu");
    expect(component.menus).toEqual(farmersMenu);
    expect(users).toBeFalsy();
    expect(products).toBeTruthy();
    expect(menu).toBeTruthy();
  });

  it('#should menu and view products only exist for customer home', () => {
    spyOn(service, "getLoggedInUser").and.returnValue(MockCustomers[0]);
    component.ngOnInit();
    fixture.detectChanges();
    products = getElm("app-user-products");
    menu = getElm("app-user-menu");
    expect(component.menus).toEqual(customersMenu);
    expect(users).toBeFalsy();
    expect(products).toBeTruthy();
    expect(menu).toBeTruthy();
  });

});