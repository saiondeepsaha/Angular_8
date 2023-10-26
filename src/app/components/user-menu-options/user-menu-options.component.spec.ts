import { Location } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { farmersMenu, loginMenu } from 'src/app/menus/app-menus';
import { MockComponent, MockRoutes } from 'src/app/mocks/MockRoutes';
import { MockFarmersService } from 'src/app/mocks/MockService';
import { FarmersApiService } from 'src/app/service/farmers-api.service';

import { UserMenuOptionsComponent } from './user-menu-options.component';

describe('UserMenuOptionsComponent - Login menus', () => {
  let component: UserMenuOptionsComponent;
  let fixture: ComponentFixture<UserMenuOptionsComponent>;
  let service: FarmersApiService;
  let locateURL: Location;

  let select: HTMLSelectElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(MockRoutes)],
      declarations: [UserMenuOptionsComponent, MockComponent],
      providers: [
        { provide: FarmersApiService, useClass: MockFarmersService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuOptionsComponent);
    component = fixture.componentInstance;
    service = TestBed.get(FarmersApiService);
    locateURL = TestBed.get(Location);
  });

  const setUpLoginMenu = () => {
    spyOn(localStorage, "getItem").and.returnValue("false");
    component.menus = loginMenu;
    component.ngOnInit();
    fixture.detectChanges();
    let selectMenu: HTMLSelectElement = fixture.nativeElement.querySelector("select");
    return selectMenu;
  }

  const setUpFarmersMenu = () => {
    spyOn(service, "getLoggedInUser").and.callThrough();
    spyOn(localStorage, "getItem").and.returnValue("true");
    component.menus = farmersMenu;
    component.ngOnInit();
    fixture.detectChanges();
    let selectMenu: HTMLSelectElement = fixture.nativeElement.querySelector("select");
    return selectMenu;
  }

  it('#login menus - routing', fakeAsync(() => {
    select = setUpLoginMenu();
    expect(select.options[0].value).toEqual("Switch to");
    expect(select.options[1].value).toEqual("Farmer");
    expect(select.options[2].value).toEqual("Customer");

    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(locateURL.path()).toEqual("/login/farmers");

    select.value = select.options[2].value;
    select.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(locateURL.path()).toEqual("/login/customers");
  }));

  it('#admin menus - routing', fakeAsync(() => {
    select = setUpFarmersMenu();
    expect(select.options[1].value).toEqual("Sign out");
    expect(select.options[2].value).toEqual("Add product");
    expect(select.options[3]).toBeFalsy();

    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(locateURL.path()).toEqual("/login/farmers");

    select.value = select.options[2].value;
    select.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(locateURL.path()).toEqual("/farmer-save-product");
  }));

});
