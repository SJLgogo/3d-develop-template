import { Component, OnInit } from '@angular/core';
import { Particles } from './Particles';

@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.less']
})
export class ParticlesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Particles('#three')
  }

}
