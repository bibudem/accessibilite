import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, catchError, finalize, of } from 'rxjs';
import { MethodesGlobal } from 'src/app/lib/MethodesGlobal';
import { RapportService } from 'src/app/services/rapport.service';
import { Location } from '@angular/common';
import { ListeChoixOptions } from "../../lib/ListeChoixOptions";
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Formulaires et données
  filterForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  allFields: string[] = [];
  selectedFields: string[] = [];
  isLoading = false;
  hasError = false;

  // Options de filtre
  typeDocumentOptions: any[] = [];
  langueOptions: any[] = [];
  formatOptions: any[] = [];
  visuelAccessibleOptions: any[] = [];

  // Importer les fonctions globales
  global: MethodesGlobal = new MethodesGlobal();

  // Importer les listes des choix
  lstOptions: ListeChoixOptions = new ListeChoixOptions();

  rapport$: Observable<any[]> | undefined;
  ifAdmin = false;

  constructor(
    private rapportService: RapportService,
    private _location: Location,
    private fb: FormBuilder,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      typeDocument: [''],
      langue: [''],
      format: [''],
      dateStart: [''],
      dateEnd: ['']
    });
  }

  ngOnInit(): void {
    this.ifAdmin = this.global.ifAdminFunction();
    this.loadOptions();
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOptions(): void {
    this.typeDocumentOptions = this.lstOptions.lstTypeDocument;
    this.langueOptions = this.lstOptions.lstLangue;
    this.formatOptions = this.lstOptions.lstFormatSubstitut;
    this.visuelAccessibleOptions = this.lstOptions.lstVisuelAccessible;
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.hasError = false;
    this.rapport$ = this.getRapport().pipe(
      catchError(error => {
        console.error('Error loading data:', error);
        this.hasError = true;
        this.showError(this.translate.instant('error.load-data'));
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    );

    this.rapport$.subscribe(data => {
      if (data && data.length > 0) {
        this.allFields = Object.keys(data[0]);
        this.selectedFields = [...this.allFields];
        this.updateDisplayedColumns();
        this.dataSource.data = data;
      }
    });
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.selectedFields;
  }

  getRapport(): Observable<any[]> {
    return this.rapportService.getRapport().pipe(
      catchError(error => {
        console.error('Error fetching report:', error);
        throw error;
      })
    );
  }

  applyFilters(): void {
    this.isLoading = true;
    this.hasError = false;
    this.rapport$ = this.getRapport().pipe(
      catchError(error => {
        console.error('Error applying filters:', error);
        this.hasError = true;
        this.showError(this.translate.instant('error.apply-filters'));
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    );

    this.rapport$.subscribe(data => {
      let filteredData = [...data];
      const filters = this.filterForm.value;

      if (filters.typeDocument) {
        filteredData = filteredData.filter(item => item.typeDocument === filters.typeDocument);
      }
      if (filters.langue) {
        filteredData = filteredData.filter(item => item.langue === filters.langue);
      }
      if (filters.format) {
        filteredData = filteredData.filter(item => item.format === filters.format);
      }
      if (filters.dateStart) {
        filteredData = filteredData.filter(item => new Date(item.dateA) >= new Date(filters.dateStart));
      }
      if (filters.dateEnd) {
        filteredData = filteredData.filter(item => new Date(item.dateA) <= new Date(filters.dateEnd));
      }

      this.dataSource.data = filteredData;
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.applyFilters();
  }

  exportToExcel(): void {
    if (this.dataSource.filteredData.length === 0) {
      this.showError(this.translate.instant('error.no-data-export'));
      return;
    }

    try {
      const dataToExport = this.dataSource.filteredData.map(item => {
        const exportedItem: any = {};
        this.displayedColumns.forEach(col => {
          exportedItem[this.translate.instant(`rapport.fields.${col}`) || col] = item[col];
        });
        return exportedItem;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Rapport');
      XLSX.writeFile(wb, `rapport_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      this.showError(this.translate.instant('error.export-excel'));
    }
  }

  toggleFieldSelection(field: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedFields.includes(field)) {
        this.selectedFields.push(field);
      }
    } else {
      this.selectedFields = this.selectedFields.filter(f => f !== field);
    }
    this.updateDisplayedColumns();
  }

  selectAllFields(selectAll: boolean): void {
    this.selectedFields = selectAll ? [...this.allFields] : [];
    this.updateDisplayedColumns();
  }

  isFieldSelected(field: string): boolean {
    return this.selectedFields.includes(field);
  }

  // Méthode pour obtenir le nom correspondant à un ID
  getOptionName(id: any, options: any[]): string {
    if (id == null || !Array.isArray(options)) return '';

    const foundOption = options.find(opt => 
      opt?.id === id || 
      opt?.value === id ||
      String(opt?.id) === String(id)
    );

    if (!foundOption) return String(id);

    return this.translate.instant(foundOption.name || foundOption.label || '') || String(id);
  }

  backClicked(): void {
    this._location.back();
  }

  private showError(message: string): void {
    this.snackBar.open(message, this.translate.instant('close'), {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}