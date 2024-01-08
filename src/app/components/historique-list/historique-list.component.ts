// Import des modules Angular nécessaires
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
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
  // Colonnes affichées dans la table
  displayedColumns = ['numero', 'sujet', 'nom', 'prenom', 'courriel', 'dateExpiration', 'statut', 'url', 'lastDateModif', 'consulter'];

  // Liste des items récupérée du service
  listeItems: any[] = [];

  // DataSource pour la table Angular Material
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  // ViewChild pour obtenir les références aux composants MatSort et MatPaginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  // Instance de la classe MethodesGlobal pour les fonctions globales
  global: MethodesGlobal = new MethodesGlobal();

  // Observable pour la liste des items provenant du service Panier
  items$: Observable<any[]> | undefined;

  // Boolean pour vérifier si l'utilisateur est un administrateur
  ifAdmin = false;

  // Dernière date de modification utilisée dans la création de la liste des items
  lastDateModif = '';

  // URL de la route actuelle
  routeUrl = '';

  // Constructeur avec injection des dépendances
  constructor(private panierService: PanierService, private _location: Location) {}

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {
    // Création du tableau et initialisations
    this.creerTableau();
    this.ifAdmin = this.global.ifAdminFunction();
    this.routeUrl = window.location.origin;
  }

  // Méthode pour appliquer un filtre à la table
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Méthode asynchrone pour créer le tableau des items
  async creerTableau() {
    try {
      // Récupération des données depuis le service Panier
      const res = await this.panierService.fetchAll().toPromise();

      // Si des données sont récupérées
      if (res) {
        // Transformation des données pour la liste des items
        this.listeItems = res.map((item, index) => {
          this.lastDateModif = item.dateM ? item.dateM : item.dateA;
          return {
            numero: index + 1,
            idPanier: item.idPanier,
            sujet: item.sujet,
            nom: item.nom,
            prenom: item.prenom,
            courriel: item.courriel,
            dateExpiration: item.dateExpiration,
            statut: item.statut,
            cle: item.cle,
            lastDateModif: this.lastDateModif
          };
        });
      }

      // Initialisation de la dataSource avec la liste des items
      this.dataSource = new MatTableDataSource(this.listeItems);

      // Liaison du MatPaginator et du MatSort à la dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.matSort;

    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }

  // Méthode pour obtenir la valeur (trimmée) d'une chaîne
  getValue(value: string) {
    return value.trim();
  }

  // Méthode pour vider le filtre de recherche
  viderFiltre() {
    const searchInput = document.getElementById('searchePanier') as HTMLInputElement;

    if (searchInput.value) {
      searchInput.value = '';
      localStorage.setItem('searchePanier', '');
      this.applyFilter('');
    }
  }

  // Méthode pour revenir en arrière dans l'historique de navigation
  backClicked() {
    this._location.back();
  }
}
