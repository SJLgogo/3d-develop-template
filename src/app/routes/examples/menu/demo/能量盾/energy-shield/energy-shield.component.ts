import { Component, OnInit } from '@angular/core';
import Shield from '../Shield/Shield';

@Component({
  selector: 'app-energy-shield',
  templateUrl: './energy-shield.component.html',
  styleUrls: ['./energy-shield.component.less']
})
export class EnergyShieldComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Shield('#three')
  }

}
