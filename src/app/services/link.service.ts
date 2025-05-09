import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { ErrorHandlerService } from "./error-handler.service";
import {Router} from "@angular/router";


@Injectable({
  providedIn: "root",
})
export class LinkService {
  [x: string]: any;
  private url = "/api/link";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient,
    private router: Router
  ) {}


//chercher les infos d'item
  fetchAll(key:string): Observable<any[]> {
    return this.http
      .get<any[]>(this.url+`/${key}`, { responseType: "json" })
      .pipe(
        tap((_) => console.log("info link")),
        catchError(
          this.errorHandlerService.handleError<any[]>("fetchAll", [])
        )
      );
  }

  updateStateLink(id: string): Observable<any> {
    const url = this.url+`/update-state/${id}`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("updateStateLink")));
  }

  download(url: string,key:string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(() => {
        // Effectuer la redirection vers '/merci' après la requête HTTP
        this.router.navigate(['/lien/'+key]);
      })
    );
  }

  downloadAndOpen(url: string, id: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(() => {
        // Effectuer la redirection vers '/merci' après la requête HTTP
        this.router.navigate(['/items/'+id]);
      })
    );
  }

}
