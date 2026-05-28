import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MethodesGlobal } from '../../lib/MethodesGlobal';
import { Location } from '@angular/common';
import { PanierService } from '../../services/panier.service';

@Component({
  selector: 'app-historique-list',
  templateUrl: './historique-list.component.html',
  styleUrls: ['./historique-list.component.css']
})
export class HistoriqueListComponent implements OnInit {
  displayedColumns = ['numero', 'sujet', 'nom', 'prenom', 'courriel', 'dateExpiration', 'statut', 'url', 'lastDateModif', 'consulter'];
  listeItems: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  global: MethodesGlobal = new MethodesGlobal();
  items$: Observable<any[]> | undefined;

  textRechercher: string = localStorage.getItem('searcheHistoriqueFiltre') || '';
  ifAdmin = false;
  routeUrl = '';

  private readonly searchableFields = ['numero', 'sujet', 'nom', 'prenom', 'courriel', 'dateExpiration', 'statut', 'lastDateModif'];

  constructor(private panierService: PanierService, private _location: Location) {}

  ngOnInit(): void {
    this.creerTableau();
    this.ifAdmin = this.global.ifAdminFunction();
    this.routeUrl = window.location.origin;
  }

  getValue(value: string): string {
    return value.trim();
  }

  applyFilter(filterValue: string): void {
    this.textRechercher = filterValue;
    localStorage.setItem('searcheHistoriqueFiltre', filterValue);
    this.dataSource.filter = this.global.normalizeString(filterValue);
  }

  viderFiltre(): void {
    this.textRechercher = '';
    localStorage.setItem('searcheHistoriqueFiltre', '');
    this.dataSource.filter = '';
  }

  async creerTableau(): Promise<void> {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = this.searchableFields
        .map(field => this.global.normalizeString(String(data[field] ?? '')))
        .join(' ');
      return dataStr.includes(filter);
    };

    try {
      const res = await firstValueFrom(this.panierService.fetchAll());

      if (res) {
        this.listeItems = res.map((item: any, index: number) => ({
          numero: index + 1,
          idPanier: item.idPanier,
          sujet: item.sujet,
          nom: item.nom,
          prenom: item.prenom,
          courriel: item.courriel,
          dateExpiration: item.dateExpiration,
          statut: item.statut,
          cle: item.cle,
          lastDateModif: item.dateM ? item.dateM : item.dateA
        }));
      }

      this.dataSource.data = this.listeItems;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.matSort;

      if (this.textRechercher) {
        this.applyFilter(this.textRechercher);
      }
    } catch (err: any) {
      console.error(`Error: ${err?.message}`);
    }
  }

  backClicked(): void {
    this._location.back();
  }
}
