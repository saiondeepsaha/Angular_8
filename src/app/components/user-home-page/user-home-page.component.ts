/***** Modules *****/
import { Component, OnInit } from '@angular/core';

/***** Data *****/
import { customersMenu, farmersMenu } from 'src/app/menus/app-menus';

/***** Modal *****/
import { User } from 'src/app/modals/User';

/***** Services *****/
import { FarmersApiService } from 'src/app/service/farmers-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './user-home-page.component.html'
})
export class UserHomePageComponent implements OnInit {

  menus: any;
  userType: any;
  loggedInUser!: User;

  constructor(private _service: FarmersApiService) { }

  ngOnInit(): void {

    /**
     * call 'getLoggedInUser' and assign it to 'loggedInUser'
     * if the loggedin user type is 'farmers', assign 'farmersMenu' to 'menus'
     * else assign 'customersMenu' to 'menus'
     */

    this.loggedInUser = this._service.getLoggedInUser();
    this.userType = this.loggedInUser.userType;

    if(this.userType === 'farmers'){
      this.menus = farmersMenu;
    }else{
      this.menus = customersMenu;
    }

  }

}