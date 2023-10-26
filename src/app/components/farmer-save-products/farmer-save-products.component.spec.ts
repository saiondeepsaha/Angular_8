import { Location } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { MockAltProducts, MockProducts } from 'src/app/mocks/MockResponse';
import { MockComponent, MockRoutes } from 'src/app/mocks/MockRoutes';
import { MockFarmersService } from 'src/app/mocks/MockService';
import { FarmersApiService } from 'src/app/service/farmers-api.service';

import { FarmerSaveProductsComponent } from './farmer-save-products.component';

describe('FarmerSaveProductsComponent - Testing Add Functionality - URL without product details', () => {
  let component: FarmerSaveProductsComponent;
  let fixture: ComponentFixture<FarmerSaveProductsComponent>;
  let locateURL: Location;
  let service: FarmersApiService;

  // input elements
  let nameInput: HTMLInputElement;
  let unitKGInput: HTMLInputElement;
  let unitCountInput: HTMLInputElement;
  let unitTonInput: HTMLInputElement;
  let stockInput: HTMLInputElement;
  let priceInput: HTMLInputElement;

  // error elements
  let nameError: HTMLElement;
  let stockError: HTMLElement;
  let priceError: HTMLElement;

  // submit buttons
  let saveBtn: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes(MockRoutes)],
      declarations: [FarmerSaveProductsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerSaveProductsComponent);
    component = fixture.componentInstance;
    locateURL = TestBed.get(Location);
    service = TestBed.get(FarmersApiService);

    nameInput = getElm("#input-name");
    unitKGInput = getElm("#input-kg");
    unitCountInput = getElm("#input-count");
    unitTonInput = getElm("#input-ton");
    stockInput = getElm("#input-stock");
    priceInput = getElm("#input-price");
    fixture.detectChanges();
  });

  let getElm = (e: any) => {
    let elm: HTMLInputElement = fixture.nativeElement.querySelector(e);
    return elm;
  }

  let fetchValidations = () => {
    nameError = getElm("#invalid-name");
    stockError = getElm("#invalid-stock");
    priceError = getElm("#invalid-price");
    return [nameError, stockError, priceError];
  }

  let dispatchInput = (inputElm: HTMLInputElement, val: any) => {
    if (typeof (val) == 'number')
      inputElm.valueAsNumber = val;
    else
      inputElm.value = val;
    inputElm.dispatchEvent(new Event('input'));
  }

  it('#Back To Home -  router', fakeAsync(() => {
    let backLink: HTMLElement = fixture.nativeElement.querySelector("#back-link");
    backLink.click();
    tick();
    fixture.detectChanges();
    expect(locateURL.path()).toEqual("/home/farmer");
  }));

  it('#validation messages for form input', () => {
    let errors = fetchValidations();
    for (let i = 0; i < 4; i++)
      expect(errors[i]).toBeFalsy();

    dispatchInput(nameInput, '');
    fixture.detectChanges();
    errors = fetchValidations();
    expect(errors[0].innerText.trim()).toEqual("Name is required");

    dispatchInput(nameInput, 'a');
    fixture.detectChanges();
    errors = fetchValidations();
    expect(errors[0].innerText.trim()).toEqual("Invalid name");

    dispatchInput(nameInput, 'abcdefghijklmnopwrst');
    fixture.detectChanges();
    errors = fetchValidations();
    expect(errors[0].innerText.trim()).toEqual("Invalid name");

    dispatchInput(stockInput, '');
    fixture.detectChanges();
    errors = fetchValidations();
    expect(errors[1].innerText.trim()).toEqual("Stock is required");

    dispatchInput(stockInput, 0);
    fixture.detectChanges();
    errors = fetchValidations();
    expect(errors[1].innerText.trim()).toEqual("Invalid stock");

    dispatchInput(priceInput, '');
    fixture.detectChanges();
    errors = fetchValidations();
    expect(errors[2].innerText.trim()).toEqual("Price is required");

    dispatchInput(priceInput, 0);
    fixture.detectChanges();
    errors = fetchValidations();
    expect(errors[2].innerText.trim()).toEqual("Invalid price");

    saveBtn = fixture.nativeElement.querySelector("#save-btn");
    expect(saveBtn.disabled).toBeTruthy();
  });

  it('#save button click to call service', fakeAsync(() => {
    spyOn(window, "alert").and.callThrough();
    spyOn(component, "saveProduct").and.callThrough();
    spyOn(service, "addProductByFarmer").and.callThrough();
    dispatchInput(nameInput, MockAltProducts[0].name);
    dispatchInput(stockInput, MockAltProducts[0].stock);
    unitCountInput.click();
    dispatchInput(priceInput, MockAltProducts[0].pricePerUnit);
    fixture.detectChanges();
    saveBtn = fixture.nativeElement.querySelector("#save-btn");
    expect(saveBtn.disabled).toBeFalsy();
    saveBtn.click();
    tick();
    expect(component.saveProduct).toHaveBeenCalled();
    expect(service.addProductByFarmer).toHaveBeenCalledWith({ name: MockAltProducts[0].name, unit: 'count', stock: MockAltProducts[0].stock, pricePerUnit: MockAltProducts[0].pricePerUnit, belongsTo: 1 });
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith("Product added");
    expect(locateURL.path()).toEqual("/home/farmers");
  }));

});

describe('FarmerSaveProductsComponent - Testing Update Functionality - URL with product details', () => {
  let component: FarmerSaveProductsComponent;
  let fixture: ComponentFixture<FarmerSaveProductsComponent>;
  let locateURL: Location;
  let service: FarmersApiService;

  // input elements
  let nameInput: HTMLInputElement;
  let unitTonInput: HTMLInputElement;
  let stockInput: HTMLInputElement;
  let priceInput: HTMLInputElement;

  // submit btn
  let saveBtn: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes(MockRoutes)],
      declarations: [FarmerSaveProductsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService },
        {
          provide: ActivatedRoute, useValue: {
            paramMap: of({
              get: () => {
                return JSON.stringify(MockProducts[1])
              }
            })
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerSaveProductsComponent);
    component = fixture.componentInstance;
    locateURL = TestBed.get(Location);
    service = TestBed.get(FarmersApiService);

    nameInput = getElm("#input-name");
    unitTonInput = getElm("#input-ton");
    stockInput = getElm("#input-stock");
    priceInput = getElm("#input-price");
    fixture.detectChanges();
  });

  let getElm = (e: any) => {
    let elm: HTMLInputElement = fixture.nativeElement.querySelector(e);
    return elm;
  }

  it('#checking the parsed value of product in form inputs', () => {
    expect(nameInput.value).toEqual("Polished Rice");
    expect(component.saveProductForm.value.unit).toEqual("kg");
    expect(stockInput.value).toEqual("50");
    expect(priceInput.value).toEqual("120");
  });

  it('#save button click to call service', fakeAsync(() => {
    spyOn(window, "alert").and.callThrough();
    spyOn(component, "saveProduct").and.callThrough();
    spyOn(service, "updateProduct").and.callThrough();
    stockInput.valueAsNumber = 60; stockInput.dispatchEvent(new Event('input'));
    unitTonInput.click();
    fixture.detectChanges();
    saveBtn = fixture.nativeElement.querySelector("#save-btn");
    saveBtn.click();
    tick();
    fixture.detectChanges();
    expect(component.saveProduct).toHaveBeenCalled();
    expect(service.updateProduct).toHaveBeenCalledWith({ id: 2, name: 'Polished Rice', unit: 'ton', stock: 60, pricePerUnit: 120, belongsTo: 1 });
    expect(window.alert).toHaveBeenCalledWith("Product updated");
    expect(locateURL.path()).toEqual("/home/farmers");
  }));

});

describe('FarmerSaveProductsComponent - Testing Update Functionality - URL with product details 2', () => {
  let component: FarmerSaveProductsComponent;
  let fixture: ComponentFixture<FarmerSaveProductsComponent>;
  let locateURL: Location;
  let service: FarmersApiService;

  // input elements
  let nameInput: HTMLInputElement;
  let unitKGInput: HTMLInputElement;
  let stockInput: HTMLInputElement;
  let priceInput: HTMLInputElement;

  // submit button
  let saveBtn: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes(MockRoutes)],
      declarations: [FarmerSaveProductsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService },
        {
          provide: ActivatedRoute, useValue: {
            paramMap: of({
              get: () => {
                return JSON.stringify(MockProducts[2])
              }
            })
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerSaveProductsComponent);
    component = fixture.componentInstance;
    locateURL = TestBed.get(Location);
    service = TestBed.get(FarmersApiService);

    nameInput = getElm("#input-name");
    unitKGInput = getElm("#input-kg");
    stockInput = getElm("#input-stock");
    priceInput = getElm("#input-price");
    fixture.detectChanges();
  });

  let getElm = (e: any) => {
    let elm: HTMLInputElement = fixture.nativeElement.querySelector(e);
    return elm;
  }

  it('#checking the parsed value of product in form inputs', () => {
    expect(nameInput.value).toEqual(MockProducts[2].name);
    expect(component.saveProductForm.value.unit).toEqual(MockProducts[2].unit);
    expect(stockInput.value).toEqual(MockProducts[2].stock.toString());
    expect(priceInput.value).toEqual(MockProducts[2].pricePerUnit.toString());
  });

  it('#save button click to call service', fakeAsync(() => {
    spyOn(window, "alert").and.callThrough();
    spyOn(component, "saveProduct").and.callThrough();
    spyOn(service, "updateProduct").and.callThrough();
    stockInput.valueAsNumber = 100; stockInput.dispatchEvent(new Event('input'));
    unitKGInput.click();
    fixture.detectChanges();
    saveBtn = fixture.nativeElement.querySelector("#save-btn");
    saveBtn.click();
    tick();
    fixture.detectChanges();
    expect(component.saveProduct).toHaveBeenCalled();
    expect(service.updateProduct).toHaveBeenCalledWith({ id: 3, name: 'Coconut', unit: 'kg', stock: 100, pricePerUnit: 15, belongsTo: 2 });
    expect(window.alert).toHaveBeenCalledWith("Product updated");
    expect(locateURL.path()).toEqual("/home/farmers");
  }));

});
