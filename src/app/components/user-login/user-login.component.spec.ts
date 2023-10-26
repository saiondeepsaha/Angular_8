import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { credentials, credentials2, MockCustomers, MockFarmers } from 'src/app/mocks/MockResponse';
import { MockComponent, MockRoutes } from 'src/app/mocks/MockRoutes';
import { MockFarmersService } from 'src/app/mocks/MockService';
import { FarmersApiService } from 'src/app/service/farmers-api.service';
import { UserMenuOptionsComponent } from '../user-menu-options/user-menu-options.component';

import { UserLoginComponent } from './user-login.component';
import { routes } from 'src/app/app-routing.module';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let service: FarmersApiService;
  let locateURL: Location;

  // input elms
  let emailInput: HTMLInputElement;
  let passInput: HTMLInputElement;

  // validation err elms
  let emailError: HTMLElement;
  let passError: HTMLElement;

  // form login btn
  let loginBtn: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes(MockRoutes)],
      declarations: [UserLoginComponent, UserMenuOptionsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService },
        { provide: UserMenuOptionsComponent, useClass: MockComponent },
        {
          provide: ActivatedRoute, useValue: {
            paramMap: of({
              get: () => {
                return "farmers";
              }
            })
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    service = TestBed.get(FarmersApiService);
    locateURL = TestBed.get(Location);
    fixture.detectChanges();

    emailInput = fixture.nativeElement.querySelector("#input-email");
    passInput = fixture.nativeElement.querySelector("#input-password");
  });

  it('form -  title, input validation messages and disable button', () => {
    let userType: HTMLElement = fixture.nativeElement.querySelector("#user-type");
    expect(userType.innerText.trim()).toEqual("Farmers Login");

    emailError = fixture.nativeElement.querySelector("#invalid-email");
    passError = fixture.nativeElement.querySelector("#invalid-password");
    expect(emailError).toBeFalsy();
    expect(passError).toBeFalsy();

    emailInput.value = ""; emailInput.dispatchEvent(new Event('input'));
    passInput.value = ""; passInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    emailError = fixture.nativeElement.querySelector("#invalid-email");
    passError = fixture.nativeElement.querySelector("#invalid-password");
    expect(emailError.innerText.trim()).toEqual("Mail is required");
    expect(passError.innerText.trim()).toEqual("Password is required");

    loginBtn = fixture.nativeElement.querySelector("#login-btn");
    expect(loginBtn.disabled).toBeTruthy();
  });

  it("toggle eye icon", () => {
    passInput = fixture.nativeElement.querySelector("#input-password");
    expect(passInput.getAttribute("type")).toEqual("password");
    let pwdEye: HTMLElement = fixture.nativeElement.querySelector("#eye");
    pwdEye.click();
    fixture.detectChanges();
    expect(passInput.getAttribute("type")).toEqual("text");
    pwdEye.click();
    fixture.detectChanges();
    expect(passInput.getAttribute("type")).toEqual("password");
  });

  it('#loginUser - set local storage', fakeAsync(() => {
    spyOn(component, "loginUser").and.callThrough();
    spyOn(service, "getSpecificUsers").and.returnValue(of(MockFarmers));
    spyOn(localStorage, "setItem").and.callThrough();
    emailInput.value = credentials.email; emailInput.dispatchEvent(new Event('input'));
    passInput.value = credentials.password; passInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    loginBtn = fixture.nativeElement.querySelector("#login-btn");
    expect(loginBtn.disabled).toBeFalsy();
    loginBtn.click();
    tick();
    fixture.detectChanges();
    expect(component.loginUser).toHaveBeenCalled();
    expect(service.getSpecificUsers).toHaveBeenCalledWith('farmers');
    expect(localStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify(MockFarmers[0]));
    expect(localStorage.setItem).toHaveBeenCalledWith("isLoggedIn", "true");
    expect(locateURL.path()).toEqual("/home/farmers");
  }));

});

describe('UserLoginComponent - Testing with different values', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let service: FarmersApiService;
  let locateURL: Location;

  // input elms
  let emailInput: HTMLInputElement;
  let passInput: HTMLInputElement;

  // form login btn
  let loginBtn: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes(MockRoutes)],
      declarations: [UserLoginComponent, UserMenuOptionsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService }, {
          provide: ActivatedRoute, useValue: {
            paramMap: of({
              get: () => {
                return "customers";
              }
            })
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    service = TestBed.get(FarmersApiService);
    locateURL = TestBed.get(Location);
    fixture.detectChanges();

    emailInput = fixture.nativeElement.querySelector("#input-email");
    passInput = fixture.nativeElement.querySelector("#input-password");
  });

  it('#form title - loginUser - set local storage', fakeAsync(() => {
    let userType: HTMLElement = fixture.nativeElement.querySelector("#user-type");
    expect(userType.innerText.trim()).toEqual("Customers Login");

    spyOn(component, "loginUser").and.callThrough();
    spyOn(service, "getSpecificUsers").and.returnValue(of(MockCustomers));
    spyOn(localStorage, "setItem").and.callThrough();
    emailInput.value = credentials2.email; emailInput.dispatchEvent(new Event('input'));
    passInput.value = credentials2.password; passInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    loginBtn = fixture.nativeElement.querySelector("#login-btn");
    loginBtn.click();
    tick();
    fixture.detectChanges();
    expect(component.loginUser).toHaveBeenCalled();
    expect(service.getSpecificUsers).toHaveBeenCalledWith('customers');
    expect(localStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify(MockCustomers[0]));
    expect(localStorage.setItem).toHaveBeenCalledWith("isLoggedIn", "true");
    expect(locateURL.path()).toEqual("/home/customers");
  }));

});
