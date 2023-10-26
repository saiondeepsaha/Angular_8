// mocking the service for testing

import { Observable, of } from 'rxjs';
import { MockFarmers, MockProducts } from './MockResponse';

export class MockFarmersService {

  getLoggedInUser(): any {
    return MockFarmers[0];
  }

  getSpecificUsers(userType: string): Observable<any> {
    return of(MockFarmers);
  }

  getProducts(): Observable<any> {
    return of(MockProducts);
  }

  updateProduct(details: any): Observable<any> {
    return of({ message: "Product is shipped, it will reach you soon." });
  }

  addProductByFarmer(details: any): Observable<any> {
    return of({ message: "Product added" });
  }

  deleteProductByFarmer(id: any): Observable<any> {
    return of({ message: "Product removed" });
  }

}