import { Component, OnInit } from '@angular/core';
import { StationArrow } from './World/StationArrow';

@Component({
  selector: 'app-station-arrow',
  templateUrl: './station-arrow.component.html',
  styleUrls: ['./station-arrow.component.less']
})
export class StationArrowComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new StationArrow('#three');
  }

}
