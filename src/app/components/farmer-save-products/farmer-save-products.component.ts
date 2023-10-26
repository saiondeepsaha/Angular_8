/***** Modules *****/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

/***** Modals *****/
import { Product } from 'src/app/modals/Product';
import { User } from 'src/app/modals/User';

/***** Services *****/
import { FarmersApiService } from 'src/app/service/farmers-api.service';

@Component({
  selector: 'app-farmer-save-products',
  templateUrl: './farmer-save-products.component.html'
})
export class FarmerSaveProductsComponent implements OnInit {

  saveProductForm!: FormGroup;
  product!: Product;
  loggedInUser!: User;

  // validation message for saveProductForm fields
  nameRequiredError = "Name is required";
  nameMinMaxError = "Invalid name";
  stockRequiredError = "Stock is required";
  stockMinError = "Invalid stock";
  priceRequiredError = "Price is required";
  priceMinError = "Invalid price";

  constructor(
    private _formBuilder: FormBuilder,
    private _service: FarmersApiService,
    private _router: Router, private _actRoute: ActivatedRoute) { }

  ngOnInit(): void {

    // call 'getLoggedInUser' and assign it to 'loggedInUser'
    this.loggedInUser = this._service.getLoggedInUser();

    // form fields and its validators
    this.saveProductForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      unit: ['kg'],
      stock: ['', [Validators.required, Validators.min(1)]],
      pricePerUnit: ['', [Validators.required, Validators.min(1)]]
    });

    /**
     * get route params
     * if there is a url param with 'product', 
     * fill it in the form to edit details
     */

    this._actRoute.paramMap.subscribe((data: ParamMap)=>{
      console.log(data.get('product'));
      if(data.get('product') !== null){
        this.product = JSON.parse(data.get('product'));
        this.saveProductForm.setValue({
          name: this.product['name'],
          unit: this.product['unit'],
          stock: this.product['stock'],
          pricePerUnit: this.product['pricePerUnit']
        });
      }
    });

  }

  get saveProductFormControl(){
    return this.saveProductForm.controls;
  }

  // To add/update the product details
  saveProduct(form: FormGroup) {
    /**
     * sending the details to the service
     * For updating, get 'product' details and update with the form values and send
     * For adding, add 'belongsTo' (id of loggedin user) with the form values and send
     * On successful adding/updating, route to UserHomepage component : '/home/farmers' 
     */

    let formInputData = {};

    if(this.product !== undefined){
      formInputData = {
        id: this.product['id'],
        name: form.value['name'],
        unit: form.value['unit'],
        stock: form.value['stock'],
        pricePerUnit: form.value['pricePerUnit'],
        belongsTo: this.product['belongsTo']
      };
      this._service.updateProduct(formInputData).subscribe({
        next: data => {
          console.log(data);
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
          alert("Product updated");
          this._router.navigate(['home/farmers']);
        }
      });
    }else{
      formInputData = {
        name: form.value['name'],
        unit: form.value['unit'],
        stock: form.value['stock'],
        pricePerUnit: form.value['pricePerUnit'],
        belongsTo: this.loggedInUser['id']
      };
      this._service.addProductByFarmer(formInputData).subscribe({
        next: data => {
          console.log(data);
        },
        error: error => {
          console.error('There was an error!', error);
        },
        complete: () => {
          alert("Product added");
          this._router.navigate(['home/farmers']);
        }
      });
    }

  }

}
