/***** Modules *****/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/***** Data *****/
import { loginMenu } from 'src/app/menus/app-menus';

/***** Services *****/
import { FarmersApiService } from 'src/app/service/farmers-api.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html'
})
export class UserLoginComponent implements OnInit {

  menus = loginMenu;
  loginForm!: FormGroup;
  form: any;
  userType: any;
  password: boolean = true;

  // validation messages for input fields
  emailRequiredError = "Mail is required";
  passwordRequiredError = "Password is required";

  constructor(
    private _formBuilder: FormBuilder,
    private _service: FarmersApiService,
    private _router: Router, private _actRoute: ActivatedRoute) { }

  ngOnInit(): void {

    // on load to clear the local storage
    localStorage.clear();

    // form fields and its validators
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // get url param of 'userType'
    this._actRoute.paramMap.subscribe((params: ParamMap)=>{
      this.userType = params.get('userType');
      this.loginForm.reset();
    })

  }

  get loginFormControl(){
    return this.loginForm.controls;
  }

  togglePasswordField(){
    this.password = !this.password;
  };

  loginUser(form: FormGroup) {
    /**
     * call 'getSpecificUsers' from service based on userType
     * check the form credentials from response details
     * if matches with any of the users,
     *      set local storage 'user' with the specific user details
     *      set local storage 'isLoggedIn' as 'true'
     *      route to user home page
     * else
     *      show window alert 'Username or password is wrong'
     * reset the form
     */

    this._service.getSpecificUsers(this.userType).subscribe((data)=>{
      data.map((obj:any)=>{
        if(obj.email === this.loginForm.controls.email.value && obj.password === this.loginForm.controls.password.value){
          localStorage.setItem('user',JSON.stringify({"id": obj.id, "name": obj.name, "mobile": obj.mobile, "email": obj.email, "address": obj.address, "password": obj.password, "userType":this.userType}));
          localStorage.setItem('isLoggedIn','true');
        }
      });
      
      if(localStorage.getItem('isLoggedIn') === "true"){
        this._router.navigate([`home/${this.userType}`]);
      }
      else{
        alert("Username or password is wrong");
        this.loginForm.reset();
      }
      
    });

  }

}
