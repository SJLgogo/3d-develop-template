import { Component, OnInit } from '@angular/core';
import { Huiztech } from './Huiztech';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Huiztech('#three')
  }

}
