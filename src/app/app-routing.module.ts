import { NgModule } from '@angular/core';
import {CanActivate, RouterModule, Routes} from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from "./services/auth-guard.service";
import {NotUserComponent} from "./components/not-user/not-user.component";
import { AccueilComponent } from './components/accueil/accueil.component';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { ItemsFormComponent } from './components/items-form/items-form.component';
import { CollectionsFormComponent } from './components/collections-form/collections-form.component';
import { NotAutoriseComponent } from './components/not-autorise/not-autorise.component';
import {SuiviComponent} from "./components/suivi/suivi.component";
import {CollectionsListComponent} from "./components/collections-list/collections-list.component";
import {LinkRecuperationComponent} from "./components/link-recuperation/link-recuperation.component";

const routes: Routes = [
  { path: '', component: AccueilComponent, canActivate: [AuthGuard] },
  { path: 'accueil', component: AccueilComponent, canActivate: [AuthGuard] },
  { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard] },
  { path: 'items/:id', component: ItemsFormComponent, canActivate: [AuthGuard] },
  { path: 'items/edit/:id', component: ItemsFormComponent, canActivate: [AuthGuard] },
  { path: 'suivi/:id', component: SuiviComponent, canActivate: [AuthGuard] },
  { path: 'items/add', component: ItemsFormComponent, canActivate: [AuthGuard] },
  { path: 'lien/:key', component: LinkRecuperationComponent, canActivate: [AuthGuard] },
  { path: 'collection', component: CollectionsListComponent, canActivate: [AuthGuard]},
  { path: 'collection/:id', component: CollectionsFormComponent, canActivate: [AuthGuard]},
  { path: 'page-not-found', component: PageNotFoundComponent, canActivate: [AuthGuard]  },
  { path: 'not-user', component: NotUserComponent },
  { path: 'not-access', component: NotAutoriseComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
