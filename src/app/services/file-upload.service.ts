import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private url = "/api/collections";

  // Options HTTP pour les requêtes
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {}

  // Méthode pour télécharger un fichier
  getFile(file: string): Observable<any> {
    const url = `${this.url}/file/${file}`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("consulter")));
  }

  // Méthode pour télécharger tous les fichiers
  fetchAll(): Observable<any> {
    const url = `${this.url}/all`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("all collections")));
  }

  // Méthode pour téléverser un fichier
  upload(formData: FormData): Observable<any> {
    return this.http
      .put<any>(`${this.url}/save`, formData, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("update")));
  }

  // Méthode pour supprimer un fichier
  deleteFile(file: string): Observable<any> {
    const url = `${this.url}/delete/${file}`;
    return this.http
      .delete<any>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>("delete")));
  }
}
