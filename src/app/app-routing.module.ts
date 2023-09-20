import { NgModule } from '@angular/core';
import {CanActivate, RouterModule, Routes} from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from "./services/auth-guard.service";
import {NotUserComponent} from "./components/not-user/not-user.component";
import {AdminGuard} from "./services/admin-guard.service";
import { AccueilComponent } from './components/accueil/accueil.component';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { ItemsFormComponent } from './components/items-form/items-form.component';
import { CollectionsFormComponent } from './components/collections-form/collections-form.component';
import { NotAutoriseComponent } from './components/not-autorise/not-autorise.component';
import { ListeProcessusComponent } from './components/processus/liste-processus/liste-processus.component';
import { ListeProcessusDelailsComponent } from './components/processus/liste-processus-details/liste-processus-details.component';
import { ListFondsComponent } from './components/configuration/fonds/list-fonds/list-fonds.component';
import { ListFournisseursComponent } from './components/configuration/fournisseurs/list-fournisseurs/list-fournisseurs.component';
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
  { path: 'processus', component: ListeProcessusComponent, canActivate: [AuthGuard,AdminGuard] },
  { path: 'processus/add', component: ListeProcessusComponent, canActivate: [AuthGuard,AdminGuard] },
  { path: 'processus/details/:id', component: ListeProcessusDelailsComponent, canActivate: [AuthGuard] },
  { path: 'list-fonds', component: ListFondsComponent, canActivate: [AuthGuard,AdminGuard] },
  { path: 'list-fournisseurs', component: ListFournisseursComponent, canActivate: [AuthGuard,AdminGuard] },
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
