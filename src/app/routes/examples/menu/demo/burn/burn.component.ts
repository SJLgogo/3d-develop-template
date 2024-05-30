import { Component, OnInit } from '@angular/core';
import { Burn } from './elements/burn';

@Component({
  selector: 'app-burn',
  templateUrl: './burn.component.html',
  styleUrls: ['./burn.component.less']
})
export class BurnComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    new Burn('#three')
  }

}
