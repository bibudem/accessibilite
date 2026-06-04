import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  stats: any = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getCount().subscribe(data => {
      if (data && data.length > 0) {
        this.stats = data[0];
      }
    });
  }
}
