import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-user',
  templateUrl: './not-user.component.html',
  styleUrls: ['./not-user.component.css'],
})
export class NotUserComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.translate.setDefaultLang('fr');
  }
}
