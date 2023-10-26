import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { MockComponent, MockRoutes } from '../mocks/MockRoutes';
import { routes } from '../app-routing.module';
import { UserLoginComponent } from '../components/user-login/user-login.component';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockNext: any;
  let mockState: any;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(MockRoutes)],
      declarations: [MockComponent]
    });
    guard = TestBed.get(AuthGuard);
    location = TestBed.get(Location);
  });
  
  it('#canActivate should return true for loggedin users and route to login page for loggedout users', async () => {
    spyOn(localStorage, 'getItem').and.returnValues("true", "false");
    expect(guard.canActivate(mockNext, mockState)).toBe(true);

    await guard.canActivate(mockNext, mockState);
    expect(location.path()).toBe('/');
    expect(guard.canActivate(mockNext, mockState)).toBe(false);
  });

});
