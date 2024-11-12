import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpProgressEvent} from "@angular/common/http";
import { Injectable } from "@angular/core";

import {filter, Observable} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import { Item } from "../models/Item";

import { ErrorHandlerService } from "./error-handler.service";


@Injectable({
  providedIn: "root",
})
export class ItemService {
  [x: string]: any;
  private url = "/api/items";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {}

  async upload(formData: FormData) {
    //console.log(formData);
    const upload$ = await this.http.put( this.url+`/uploud`, formData);

    return  upload$.subscribe();
  }

//chercher toute la liste
  fetchAll(): Observable<any[]> {
    return this.http
      .get<any[]>(this.url+'/all', { responseType: "json" })
      .pipe(
        tap((_) => console.log("fetched monographies")),
        catchError(
          this.errorHandlerService.handleError<any[]>("fetchAll", [])
        )
      );
  }

  //chercher toute la liste
  fetchAllCollection(): Observable<any[]> {
    return this.http
      .get<any[]>(this.url+'/all/collections', { responseType: "json" })
      .pipe(
        tap((_) => console.log("fetched collection")),
        catchError(
          this.errorHandlerService.handleError<any[]>("fetchAllCollection", [])
        )
      );
  }
  post(item: Item): Observable<any> {
    console.log(item)
    return this.http
      .post<any>(this.url+'/add', item, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("post")));
  }

  update(item: Item): Observable<any> {
    console.log(item);
    return this.http
      .put<Item>(this.url+'/save', item, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("update")));
  }

  delete(id: number): Observable<any> {
    const url = this.url+`/delete/${id}`;

    return this.http
      .delete<Item>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("delete")));
  }
  consulter(id: number): Observable<any> {
    const url = this.url+`/fiche/${id}`;
    return this.http
      .get<Item>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("consulter")));

  }
  //supprimer file
  deleteFile(name:string,folder:string): Observable<any> {
    let param=name+'&'+folder;
    const url = this.url+`/deleteFile/${param}`;
    return this.http
      .get<any[]>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("delete")));
  }

  //veriffier si file existe
  getFile(name:string,folder:string): Observable<Blob>  {
    let param=name+'&'+folder;
    console.log(this.url+`/file/${param}`);
    return this.http
      .get(`${this.url}/file/${param}`, {
        responseType: 'blob' // Utilisation correcte pour recevoir un fichier binaire
      })
      .pipe(catchError(this.errorHandlerService.handleError<any>("verifier si file existe")));
  }

  //mise a jour d'url
  updateUrl(id:string,ancienURL:string,newUrl:string): Observable<any> {
    let rep=id+'&'+ancienURL+'&'+newUrl;
    const url = this.url+`/updateUrl/${rep}`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("mise a jour url")));

  }
// liste de suivi pour un item
  allListeSuivi(id: number): Observable<any> {
    const url = this.url+`/suivi/${id}`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("liste suivi")));

  }

  uploadWithProgress(formData: FormData) {
    return this.http.put( this.url+`/uploud`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      // Filtrer uniquement les événements de type HttpProgressEvent
      filter(event => event.type === HttpEventType.UploadProgress),
      map((event: HttpProgressEvent) => {
        if (event.total) {
          // Calcul de la progression en pourcentage
          return Math.round((100 * event.loaded) / event.total);
        }
        return 0;  // Retourner 0 si aucun total n'est disponible
      })
    );
  }


}
