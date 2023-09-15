import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { ErrorHandlerService } from "./error-handler.service";

import {Pret} from "../models/Pret";


@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  [x: string]: any;
  private url = "http://localhost:9100/collections";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {}



  upload(formData: FormData): Observable<any> {
    return this.http
      .put<any>(this.url+'/save', formData, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("update")));
  }

  deleteFile(file: string): Observable<any> {
    const url = this.url+`/delete/${file}`;

    return this.http
      .delete<any>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("delete")));
  }
  getFile(file: string): Observable<any> {
    //console.log(id);
    const url = this.url+`/file/${file}`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("consulter")));
  }

  fetchAll(): Observable<any> {
    const url = this.url+`/all`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("all collections")));
  }

}
