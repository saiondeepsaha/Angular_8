/***** Modules *****/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/***** Components *****/
import { AppComponent } from './app.component';
import { UserMenuOptionsComponent } from './components/user-menu-options/user-menu-options.component';
import { UserViewProductsComponent } from './components/user-view-products/user-view-products.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents,
    UserMenuOptionsComponent,
    UserViewProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
