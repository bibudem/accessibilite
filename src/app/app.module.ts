import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from "./app.component";

//Import material diseigner
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
// import pour multiselect
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
//import pour traduction
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { LoginRoutingModule } from './components/login/login-routing.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from "./services/auth-guard.service";
import {AdminGuard} from "./services/admin-guard.service";
import {MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { LOCALE_ID } from '@angular/core';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {NotAutoriseComponent} from "./components/not-autorise/not-autorise.component";
import { MatTabsModule } from '@angular/material/tabs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {ListBoxModule, DropDownListModule, ComboBoxModule, AutoCompleteModule, MultiSelectModule, DropDownTreeModule, MentionModule} from "@syncfusion/ej2-angular-dropdowns";
import { RouterModule } from '@angular/router';
import {CollectionsListComponent} from "./components/collections-list/collections-list.component";
import {CollectionsFormComponent} from "./components/collections-form/collections-form.component";
import {ItemsFormComponent} from "./components/items-form/items-form.component";
import {ItemsListComponent} from "./components/items-list/items-list.component";
import { LinkRecuperationComponent } from './components/link-recuperation/link-recuperation.component';
import { HistoriqueListComponent } from './components/historique-list/historique-list.component';
import { HistoriqueDetailsComponent } from './components/historique-details/historique-details.component';
// directive pour les masks
import {NotUserComponent} from "./components/not-user/not-user.component";
import {MatSortModule} from "@angular/material/sort";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {PanierFormComponent} from "./components/panier-form/panier-form.component";
import { RapportComponent } from './components/rapport/rapport.component';
import {UserAuthGuard} from "./services/user-auth.guard";
import {ViewerGuard} from "./services/viewer-guard.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    AccueilComponent,
    LoginComponent,
    PageNotFoundComponent,
    NotUserComponent,
    NotAutoriseComponent,
    CollectionsFormComponent,
    ItemsFormComponent,
    ItemsListComponent,
    CollectionsListComponent,
    LinkRecuperationComponent,
    HistoriqueListComponent,
    HistoriqueDetailsComponent,
    PanierFormComponent,
    RapportComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    LoginRoutingModule,
    AppRoutingModule,
    FormsModule,
    MatTabsModule,
    MatSnackBarModule,
    ClipboardModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressBarModule,
    ListBoxModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSortModule,
    NgbModule,
    DropDownListModule, ComboBoxModule, AutoCompleteModule, MultiSelectModule, DropDownTreeModule, MentionModule

  ],
  providers: [AuthGuard,AdminGuard,UserAuthGuard,ViewerGuard, { provide: LOCALE_ID, useValue: "fr-FR" },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true
    }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }


// Traduction : loader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// Traduction : initialisation avant démarrage
export function appInitializerFactory(translate: TranslateService) {
  return () => {
    const lang = 'fr';
    translate.setDefaultLang(lang);
    return translate.use(lang).toPromise();
  };
}
