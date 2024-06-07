import { Component, OnInit } from '@angular/core';
import { HyperSpace } from './hyperSpace';

@Component({
  selector: 'app-hyper-space',
  templateUrl: './hyper-space.component.html',
  styleUrls: ['./hyper-space.component.less']
})
export class HyperSpaceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new HyperSpace('#three')
  }

}
