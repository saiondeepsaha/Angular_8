import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { MockAltProducts, MockCustomers, MockProducts } from 'src/app/mocks/MockResponse';
import { MockComponent, MockRoutes } from 'src/app/mocks/MockRoutes';
import { MockFarmersService } from 'src/app/mocks/MockService';
import { FarmersApiService } from 'src/app/service/farmers-api.service';
import { UserViewProductsComponent } from './user-view-products.component';

describe('UserViewProductsComponent - Farmer', () => {
  let component: UserViewProductsComponent;
  let fixture: ComponentFixture<UserViewProductsComponent>;
  let router: Router;
  let service: FarmersApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(MockRoutes)],
      declarations: [UserViewProductsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewProductsComponent);
    component = fixture.componentInstance;
    service = TestBed.get(FarmersApiService);
    router = TestBed.get(Router);
    spyOn(service, "getLoggedInUser").and.callThrough();
    spyOn(service, "getProducts").and.callThrough();

    fixture.detectChanges();
  });

  it('#should call service ngOnInit and display product details', () => {
    component.ngOnInit();
    expect(service.getProducts).toHaveBeenCalled();

    let data: HTMLTableElement = fixture.nativeElement.querySelector("table");
    expect(data.rows[0].cells.length).toEqual(6);
    expect(data.rows[1].cells.length).toEqual(6);
    expect(data.rows[1].cells[0].innerText.trim()).toEqual(MockProducts[0].name);
    expect(data.rows[1].cells[1].innerText.trim()).toEqual(MockProducts[0].pricePerUnit + ' / ' + MockProducts[0].unit);
    expect(data.rows[1].cells[2].innerText.trim()).toEqual(MockProducts[0].stock.toString());
    expect(data.rows[1].cells[3].innerText.trim()).toEqual("In Stock");
  });

  it('#getUpdateForm should route to farmer-add-product', () => {
    spyOn(component, "getUpdateForm").and.callThrough();
    spyOn(router, "navigate").and.callThrough();
    let data: HTMLTableElement = fixture.nativeElement.querySelector("table");
    data.rows[1].cells[4].querySelector('button').click();
    fixture.detectChanges();
    expect(component.getUpdateForm).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['farmer-save-product', JSON.stringify(MockProducts[0])]);
  });

  it('#deleteProduct should call service', () => {
    spyOn(window, "alert").and.callThrough();
    spyOn(component, "deleteProduct").and.callThrough();
    spyOn(service, "deleteProductByFarmer").and.callThrough();
    let data: HTMLTableElement = fixture.nativeElement.querySelector("table");
    data.rows[1].cells[5].querySelector('button').click();
    fixture.detectChanges();
    expect(component.deleteProduct).toHaveBeenCalled();
    expect(service.deleteProductByFarmer).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith("Product removed");
    expect(service.getProducts).toHaveBeenCalled();
  });

});


describe('UserViewProductsComponent - Customers', () => {
  let component: UserViewProductsComponent;
  let fixture: ComponentFixture<UserViewProductsComponent>;
  let service: FarmersApiService;

  let products: NodeListOf<HTMLElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(MockRoutes), FormsModule],
      declarations: [UserViewProductsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewProductsComponent);
    component = fixture.componentInstance;
    service = TestBed.get(FarmersApiService);
    spyOn(service, "getLoggedInUser").and.returnValue(MockCustomers[0]);

    fixture.detectChanges();
  });

  let getElm = (i: any, e: string): HTMLElement | null => {
    return products[i].querySelector(e);
  }

  let getDetails = (n: any) => {
    let name = getElm(n, 'h2').innerText.trim();
    let pricePerUnit = getElm(n, 'p').innerText.trim();
    let stockStatus = getElm(n, 'tr').querySelector('td').innerText.trim();
    return [name, pricePerUnit, stockStatus];
  }

  it('#should call service ngOnInit and display product details', () => {
    spyOn(service, "getProducts").and.callThrough();
    component.ngOnInit();
    expect(service.getProducts).toHaveBeenCalled();

    products = fixture.nativeElement.querySelectorAll("#product-data");
    expect(products.length).toEqual(3);
    let details = getDetails(0);
    expect(details[0]).toEqual("Plantain Stem");
    expect(details[1]).toEqual("25 / count");
    expect(details[2]).toEqual("In Stock");
    details = getDetails(1);
    expect(details[0]).toEqual("Polished Rice");
    expect(details[1]).toEqual("120 / kg");
    expect(details[2]).toEqual("In Stock");
    details = getDetails(2);
    expect(details[0]).toEqual("Coconut");
    expect(details[1]).toEqual("15 / count");
    expect(details[2]).toEqual("Out of stock");

    let rows: NodeListOf<HTMLTableRowElement> = fixture.nativeElement.querySelectorAll("tr");
    expect(rows[0].cells[0].getAttribute('class')).toEqual("text-success");
    expect(rows[1].cells[0].getAttribute('class')).toEqual("text-success");
    expect(rows[2].cells[0].getAttribute('class')).toEqual("text-danger");
  });

  it('enter quantity and buy the product', () => {
    spyOn(window, "alert").and.callThrough();
    spyOn(component, "buyProduct").and.callThrough();
    spyOn(service, "getProducts").and.callThrough();
    spyOn(service, "updateProduct").and.callThrough();
    let quantityInputs: HTMLInputElement = fixture.nativeElement.querySelector("input");
    quantityInputs.valueAsNumber = 3; quantityInputs.dispatchEvent(new Event('change'));
    expect(quantityInputs.valueAsNumber).toEqual(3);
    let buyBtn: HTMLButtonElement = fixture.nativeElement.querySelector("button");
    buyBtn.click(); fixture.detectChanges();
    expect(component.buyProduct).toHaveBeenCalled();
    expect(service.updateProduct).toHaveBeenCalledWith(MockProducts[0]);
    expect(window.alert).toHaveBeenCalledWith("Product is shipped, it will reach you soon.");
    expect(service.getProducts).toHaveBeenCalled();
    expect(quantityInputs.valueAsNumber).toEqual(1);
  });

});

describe('UserViewProductsComponent - Testing with different values', () => {
  let component: UserViewProductsComponent;
  let fixture: ComponentFixture<UserViewProductsComponent>;
  let service: FarmersApiService;

  let products: NodeListOf<HTMLElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(MockRoutes), FormsModule],
      declarations: [UserViewProductsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewProductsComponent);
    component = fixture.componentInstance;
    service = TestBed.get(FarmersApiService);
    spyOn(service, "getLoggedInUser").and.returnValue(MockCustomers[0]);
    spyOn(service, "getProducts").and.returnValue(of(MockAltProducts));
    component.ngOnInit()
    fixture.detectChanges();
  });

  let getElm = (i: any, e: string): HTMLElement | null => {
    return products[i].querySelector(e);
  }

  let getDetails = (n: any) => {
    let name = getElm(n, 'h2').innerText.trim();
    let pricePerUnit = getElm(n, 'p').innerText.trim();
    let stockStatus = getElm(n, 'tr').querySelector('td').innerText.trim()
    return [name, pricePerUnit, stockStatus];
  }

  it('#should display product details', () => {
    products = fixture.nativeElement.querySelectorAll("#product-data");
    expect(products.length).toEqual(1);
    let details = getDetails(0);
    expect(details[0]).toEqual("Beans");
    expect(details[1]).toEqual("30 / kg");
    expect(details[2]).toEqual("In Stock");
  });

});
