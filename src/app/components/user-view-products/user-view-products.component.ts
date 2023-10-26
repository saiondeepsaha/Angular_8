/***** Modules *****/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/***** Modals *****/
import { Product } from 'src/app/modals/Product';
import { User } from 'src/app/modals/User';

/***** Services *****/
import { FarmersApiService } from 'src/app/service/farmers-api.service';

@Component({
  selector: 'app-user-products',
  templateUrl: './user-view-products.component.html',
  styleUrls: ['./user-view-products.component.css']
})
export class UserViewProductsComponent implements OnInit {

  quantity: Number;
  products!: Product[];
  loggedInUser!: User;
  noOfProducts: number;

  constructor(private _router: Router, private _service: FarmersApiService) { }

  ngOnInit(): void {
    // call 'getLoggedInUser' and assign it to 'loggedInUser'
    this.loggedInUser = this._service.getLoggedInUser();
    this.getProducts();
  }

  // getting products from server for farmers and customers
  getProducts() {
    /**
     * call 'getProducts' from service
     * get the products based on the logged in user
     * to view the details in template
     */
    this._service.getProducts().subscribe({
      next: data => {
        this.products = data.filter((f:any)=>{
          //return f.belongsTo == this.loggedInUser.id;
          return f.belongsTo;
        });
      },
      error: error => {
          console.error('There was an error!', error);
      },
      complete: () => {
        this.noOfProducts = this.products.length;
      }
    });
  }

  // deleting the products from server for farmers
  deleteProduct(id: number) { 
    /**
     * call 'deleteProductByFarmer' from service
     * on successful deletion, 
     *      show window alert "Product removed" and call 'getProducts' fn
     */
    this._service.deleteProductByFarmer(id).subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
          console.error('There was an error!', error);
      },
      complete: () => {
        alert("Product removed");
        this.getProducts();
      }
    });
  }

  getUpdateForm(product: Product) {
    // route to FarmerSaveProduct component to update the product for farmers user
    this._router.navigate(['farmer-save-product',JSON.stringify({"id":product['id'],"unit":product['unit'],"pricePerUnit":product['pricePerUnit'],"name":product['name'],"stock":product['stock'],"belongsTo":product['belongsTo']})]);
  }

  setQty(event:any){
    this.quantity = parseInt(event.target.value);
  }

  // to buy the product for customers user
  buyProduct(product: Product) {
    /**
     * if input quantity is greater than product stock, show window alert "Out of stock"
     * else 
     *      update the stock value
     *      call service 'updateProduct' with product details (which contain updated stock)
     *      reset the quantity input to 1
     *      show alert 'Product is shipped, it will reach you soon.'
     *      call 'getProducts' fn
     */
    if(this.quantity > product.stock){
      alert("Out of stock");
    }else{
      product.stock = this.quantity;
      this._service.updateProduct(product).subscribe({
        next: data => {
          console.log(data);
        },
        error: error => {
            console.error('There was an error!', error);
        },
        complete: () => {
          alert('Product is shipped, it will reach you soon.');
          this.getProducts();
          this.quantity = 1;
          document.querySelector('input').value = JSON.stringify(this.quantity);
        }
      });
    }
  }

}
