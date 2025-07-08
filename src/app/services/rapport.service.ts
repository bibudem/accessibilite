import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { ErrorHandlerService } from "./error-handler.service";


@Injectable({
  providedIn: "root",
})
export class RapportService {
  [x: string]: any;
  private url = "/api/rapport/list";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {}

  //chercher le total des logs
  getRapport(): Observable<any[]> {
    //console.log(this.url+'/count')
    return this.http
      .get<any[]>(this.url, { responseType: "json" })
      .pipe(
        tap((_) => console.log("Rapport")),
        catchError(
          this.errorHandlerService.handleError<any[]>("getRapport", [])
        )
      );
  }


}
