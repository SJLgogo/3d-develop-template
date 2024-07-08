import { Component, OnInit } from '@angular/core';
import { PathAlgorithm2 } from './World/PathAlgorithm';

@Component({
  selector: 'app-path-algorithm2',
  templateUrl: './path-algorithm2.component.html',
  styleUrls: ['./path-algorithm2.component.less']
})
export class PathAlgorithm2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new PathAlgorithm2('#three');
  }

}
