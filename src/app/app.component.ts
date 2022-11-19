import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  activePage:number = 0;

  displayActivePage(activePageNumber:number){
    this.activePage = activePageNumber
  }
}
