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
  private url = "/api/suivi";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {}

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
