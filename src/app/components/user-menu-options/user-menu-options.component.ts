/***** Modules *****/
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/***** Modals *****/
import { User } from 'src/app/modals/User';

/***** Services *****/
import { FarmersApiService } from 'src/app/service/farmers-api.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu-options.component.html'
})
export class UserMenuOptionsComponent implements OnInit {

  @Input() menus: any; // data from another component

  loggedInUser!: User;
  userName!: string;
  isLoggedIn!: string | null;

  constructor(private _router: Router, private _service: FarmersApiService) { }

  ngOnInit(): void {

     /**
      * check 'isLoggedIn' in local storage
      * if user logged in, 
      *       call 'getLoggedInUser' and assign it to 'loggedInUser'
      *       get name of the user
      * 
      */

     this.isLoggedIn = localStorage.getItem('isLoggedIn');

     if(this.isLoggedIn){
        this.loggedInUser = this._service.getLoggedInUser();
        this.userName = this.loggedInUser.name;
     }
     
  
  }

  selectedOption(event: any) {
    // based on the menu 'name', route to menu 'path'
    switch(event.target.value){
      case 'Farmer': {
        this._router.navigate(['login/farmers']);
        break;
      }
      case 'Customer': {
        this._router.navigate(['login/customers']);
        break;
      }
      case 'Add product': {
        this._router.navigate(['farmer-save-product']);
        break;
      }
      default : {
        this._router.navigate([`login/${this.loggedInUser.userType}`]);
        break;
      }
    }
  }

}
