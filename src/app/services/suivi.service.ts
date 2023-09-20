import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ErrorHandlerService } from "./error-handler.service";

import {Suivi} from "../models/Suivi";


@Injectable({
  providedIn: "root",
})
export class SuiviService {
  [x: string]: any;
  private url = "http://localhost:9100/suivi";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {}

  post(obj: Suivi): Observable<any> {
    console.log(obj);
    return this.http
      .post<Partial<Suivi>>(this.url+'/add', obj, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("post")));
  }

  update(obj: Suivi): Observable<any> {
    //console.log(revue);
    return this.http
      .put<Partial<Suivi>>(this.url+'/save', obj, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("update")));
  }

  delete(id: number): Observable<any> {
    const url = this.url+`/delete/${id}`;

    return this.http
      .delete<Suivi>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("delete")));
  }


//chercher toute la liste
  fetchAll(id: number): Observable<any[]> {
    return this.http
      .get<any[]>(this.url+`/all/${id}`, { responseType: "json" })
      .pipe(
        tap((_) => console.log("all suivi")),
        catchError(
          this.errorHandlerService.handleError<any[]>("fetchAll", [])
        )
      );
  }
}
