import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { ErrorHandlerService } from "./error-handler.service";

import {Collection} from "../models/Collection";


@Injectable({
  providedIn: "root",
})
export class CollectionService {
  [x: string]: any;
  private url = "/api/collections";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {}

  post(obj: Collection): Observable<any> {
    return this.http
      .post<Partial<Collection>>(this.url+'/add', obj, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("post")));
  }

  update(obj: Collection): Observable<any> {
    return this.http
      .put<Collection>(this.url+'/save', obj, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("update")));
  }

  delete(id: number): Observable<any> {
    const url = this.url+`/delete/${id}`;
    return this.http
      .delete<Collection>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("delete")));
  }

  consulter(id: number): Observable<any> {
    //console.log(id);
    const url = this.url+`/fiche/${id}`;
    return this.http
      .get<Collection>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("consulter")));
  }

  fetchAll(): Observable<any> {
    const url = this.url+`/all`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("all collections")));
  }

}
