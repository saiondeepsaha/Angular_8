/***** Modules *****/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/***** Guard *****/
import { AuthGuard } from './guard/auth.guard';

/***** Components *****/
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserHomePageComponent } from './components/user-home-page/user-home-page.component';
import { FarmerSaveProductsComponent } from './components/farmer-save-products/farmer-save-products.component';

// add 'AuthGuard' for the routes except login route
export const routes: Routes = [
  { path: 'login/:userType', component: UserLoginComponent },
  { path: 'home/:userType', component: UserHomePageComponent, canActivate:[AuthGuard]},
  { path: 'farmer-save-product', component: FarmerSaveProductsComponent, canActivate:[AuthGuard]},
  { path: 'farmer-save-product/:product', component: FarmerSaveProductsComponent, canActivate:[AuthGuard]},
  { path: '', redirectTo: 'login/farmers', pathMatch: 'full' },
  { path: '**', redirectTo: 'login/farmers', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [
  UserLoginComponent,
  FarmerSaveProductsComponent,
  UserHomePageComponent
]