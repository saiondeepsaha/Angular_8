import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockFarmers, MockProducts } from '../mocks/MockResponse';

import { FarmersApiService } from './farmers-api.service';

describe('FarmersApiService', () => {
  let service: FarmersApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FarmersApiService]
    });
    httpTesting = TestBed.get(HttpTestingController);
    service = TestBed.get(FarmersApiService);
  });

  it('getProducts API request', () => {
    service.getProducts().subscribe(response => {
      expect(response).toEqual(MockProducts);
    });
    const api1 = httpTesting.expectOne("/api/products");
    expect(api1.request.method).toEqual("GET");
    api1.flush(MockProducts);
    
    service.deleteProductByFarmer("1").subscribe(response => {
      expect(response).toEqual({ message: "Product removed" });
    });
    const api2 = httpTesting.expectOne("/api/products/1");
    expect(api2.request.method).toEqual("DELETE");
    api2.flush({ message: "Product removed" });
    
    const newProd = { name: "Apple", unit: "count", pricePerUnit: 15, stock: 10 }
    service.addProductByFarmer(newProd).subscribe(response => {
      expect(response).toEqual({ message: "Product added" });
    });
    const api3 = httpTesting.expectOne("/api/products");
    expect(api3.request.method).toEqual("POST");
    expect(api3.request.body).toEqual(newProd);
    api3.flush({ message: "Product added" });
    
    service.updateProduct(MockProducts[0]).subscribe(response => {
      expect(response).toEqual(MockProducts[0]);
    });
    const api4 = httpTesting.expectOne("/api/products/1");
    expect(api4.request.method).toEqual("PUT");
    expect(api4.request.body).toEqual(MockProducts[0]);
    api4.flush(MockProducts[0]);
  });

});
