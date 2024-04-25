import { Component, OnInit } from '@angular/core';
import Halo from '../Halo/Halo';

@Component({
  selector: 'app-energy-halo',
  templateUrl: './energy-halo.component.html',
  styleUrls: ['./energy-halo.component.less']
})
export class EnergyHaloComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Halo('#three')
  }

}
