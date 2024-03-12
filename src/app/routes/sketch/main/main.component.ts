import { Component, OnInit } from '@angular/core';
import { SktechWorld } from '../world/World';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  constructor() { }

  declare world:SktechWorld;

  ngOnInit(): void {
    const world = new SktechWorld();
  }



}
