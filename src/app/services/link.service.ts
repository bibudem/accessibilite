import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

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
  // Les erreurs ne sont pas avalées : la page doit distinguer une session expirée (401)
  // d'une erreur technique, au lieu d'afficher « aucun document » dans tous les cas.
  fetchAll(key:string): Observable<any[]> {
    return this.http
      .get<any[]>(this.url+`/${key}`, { responseType: "json" });
  }

  updateStateLink(id: string): Observable<any> {
    const url = this.url+`/update-state/${id}`;
    return this.http
      .get<any>(url, { responseType: "json" })
      .pipe(catchError(this.errorHandlerService.handleError<any>("updateStateLink")));
  }

  /**
   * Télécharge un fichier sans le charger en mémoire : une requête HEAD vérifie d'abord l'accès
   * (sans transférer le contenu), puis le navigateur télécharge lui-même le fichier en continu.
   * Émet une erreur (HttpErrorResponse) si le fichier est inaccessible.
   */
  telechargerFichier(url: string, nomFichier: string): Observable<void> {
    return this.http.head(url, { observe: 'response' }).pipe(
      map(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = nomFichier;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
    );
  }

  // Message à afficher quand telechargerFichier échoue
  messageErreurTelechargement(status: number): string {
    switch (status) {
      case 401:
        return 'Votre session a expiré. Rechargez la page pour vous reconnecter.';
      case 403:
        return "Ce fichier n'est plus accessible avec votre compte (lien expiré ou destiné à une autre personne).";
      case 404:
        return 'Le fichier est introuvable sur le serveur. Contactez le Service Accessibilité.';
      default:
        return 'Le téléchargement a échoué. Vérifiez votre connexion et réessayez.';
    }
  }

}
