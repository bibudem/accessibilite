import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, firstValueFrom } from 'rxjs';
import { MethodesGlobal } from 'src/app/lib/MethodesGlobal';
import { ItemService } from 'src/app/services/item.service';
import { Location } from '@angular/common';
import { ListeChoixOptions } from '../../lib/ListeChoixOptions';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  displayedColumns = ['idItem', 'titre', 'isbn', 'auteur', 'annee', 'description', 'editeur', 'dateA', 'typeDocument', 'format', 'consulter'];
  listeItems: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) matSort: MatSort | any;

  global: MethodesGlobal = new MethodesGlobal();
  lstOptions: ListeChoixOptions = new ListeChoixOptions();
  items$: Observable<any[]> | undefined;

  textRechercher: string = localStorage.getItem('textFiltre') || '';
  ifAdmin = false;

  private readonly searchableFields = ['idItem', 'titre', 'isbn', 'auteur', 'annee', 'description', 'editeur', 'typeDocument', 'format', 'dateA', 'dateM'];

  constructor(private itemService: ItemService, private _location: Location) {}

  ngOnInit(): void {
    this.creerTableau();
    this.ifAdmin = this.global.ifAdminFunction();
  }

  getValue(value: string): string {
    return value.trim();
  }

  applyFilter(filterValue: string): void {
    this.textRechercher = filterValue;
    localStorage.setItem('textFiltre', filterValue);
    this.dataSource.filter = this.global.normalizeString(filterValue);
  }

  viderFiltre(): void {
    this.textRechercher = '';
    localStorage.setItem('textFiltre', '');
    this.dataSource.filter = '';
  }

  creerTableau(): void {
    // Défini une seule fois — recherche dans toutes les colonnes visibles uniquement
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = this.searchableFields
        .map(field => this.global.normalizeString(String(data[field] ?? '')))
        .join(' ');
      return dataStr.includes(filter);
    };

    this.items$ = this.fetchAll();
    firstValueFrom(this.items$).then(res => {
      if (res) {
        this.listeItems = res.map((item, index) => ({
          numero: index + 1,
          idItem: item.idItem,
          typeDocument: this.getDocumentTypeName(item.typeDocument),
          titre: item.titre,
          isbn: item.isbn,
          editeur: item.editeur,
          auteur: item.auteur,
          file: item.file,
          URL: '/assets/files/items/' + item.URL + '/' + item.file,
          format: this.getFormatName(item.format),
          annee: item.annee,
          description: item.description,
          dateA: item.dateA,
          dateM: item.dateM
        }));
      }

      this.dataSource.data = this.listeItems;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.matSort;

      if (this.textRechercher) {
        this.applyFilter(this.textRechercher);
      }
    }).catch(err => console.error(`Error: ${err?.message}`));
  }

  getDocumentTypeName(typeDocumentId: string): string {
    const id = Number(typeDocumentId);
    const documentType = this.lstOptions.lstTypeDocument.find(docType => docType.id === id);
    return documentType ? documentType.name : '';
  }

  getFormatName(formatId: number): string {
    const id = Number(formatId);
    const format = this.lstOptions.lstFormatSubstitut.find(f => f.id === id);
    return format ? format.name : 'Inconnu';
  }

  fetchAll(): Observable<any[]> {
    return this.itemService.fetchAll();
  }

  backClicked(): void {
    this._location.back();
  }
}
