import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor( private route: ActivatedRoute,
               private translate: TranslateService,) {

  }
  title = 'projet-accessibilite';
  isNotUserRoute: boolean = false;
  flagChoix:string= 'flag-icon-fr';
  ifAdmin = false;

  ngOnInit() {
    if(window.location.pathname=='/not-user'){
      this.isNotUserRoute =true;
    }
  }

}
