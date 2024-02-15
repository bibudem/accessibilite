import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { ErrorHandlerService } from "./error-handler.service";

import {Panier} from "../models/Panier";


@Injectable({
  providedIn: "root",
})
export class PanierService {
  private panier: Array<any> = [];  // Déclarez le tableau avec le type approprié

  [x: string]: any;  // Signature d'index
  private url = "/api/panier";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {
    // Récupérer le panier depuis localStorage lors de l'initialisation du service
    this.panier = JSON.parse(localStorage.getItem('panier') || '[]');
  }

  post(obj: Panier): Observable<any> {
    return this.http
      .post<Partial<Panier>>(this.url+'/add', obj, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("post")));
  }

  update(obj: Panier): Observable<any> {
    console.log(obj)
    return this.http
      .put<Panier>(this.url+'/save-panier', obj, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("update")));
  }

  delete(id: number): Observable<any> {
    const url = this.url+`/delete/${id}`;
    return this.http
      .delete<Panier>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("delete")));
  }

  consulter(id: number): Observable<any> {
    const url = this.url+`/fiche/${id}`;
    return this.http
      .get<Panier>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("consulter")));
  }

  fetchAll(): Observable<any> {
    const url = this.url+`/all`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("all panier")));
  }

  postPanierDetails(obj: any): Observable<any> {
    return this.http
      .post<Partial<any>>(this.url+'/add-details', obj, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("post")));
  }

  getPanier(): Array<any> {
    return this.panier;
  }

  addToPanier(item: any): void {
    // Vérifier si l'élément existe déjà dans le panier
    const itemExist = this.panier.some((panierItem) => panierItem.idItem === item.idItem);

    // Si l'élément n'existe pas, l'ajouter au panier
    if (!itemExist) {
      this.panier.push(item);
      localStorage.setItem('panier', JSON.stringify(this.panier));
    } else {
      alert('Cet item est déjà dans le panier.');
    }
  }


  removeFromPanier(itemId: any): void {
    this.panier = this.panier.filter((item) => item.idItem !== itemId);
    localStorage.setItem('panier', JSON.stringify(this.panier));
  }

  clearPanierLocalStorage(): void {
    localStorage.removeItem('panier');
    this.panier = []; // Assurez-vous également de vider le tableau local
  }

  listeHistorique(idItem: number): Observable<any> {
    const url = this.url+`/historique/${idItem}`;
    return this.http
      .get<Panier>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("consulter")));
  }

}
