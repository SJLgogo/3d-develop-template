import { Component, OnInit } from '@angular/core';
import { PathAlgorithm } from './World/PathAlgorithm';

@Component({
  selector: 'app-path-algorithm',
  templateUrl: './path-algorithm.component.html',
  styleUrls: ['./path-algorithm.component.less']
})
export class PathAlgorithmComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new PathAlgorithm('#three');
  }

}
