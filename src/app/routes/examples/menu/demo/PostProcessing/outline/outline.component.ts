import { Component, OnInit } from '@angular/core';
import { Outline } from './outline';

@Component({
  selector: 'app-outline',
  templateUrl: './outline.component.html',
  styleUrls: ['./outline.component.less']
})
export class OutlineComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Outline('#three')
  }

}
