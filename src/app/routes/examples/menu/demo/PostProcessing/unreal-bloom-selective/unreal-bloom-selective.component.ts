import { Component, OnInit } from '@angular/core';
import { Bloom } from './bloom';

@Component({
  selector: 'app-unreal-bloom-selective',
  templateUrl: './unreal-bloom-selective.component.html',
  styleUrls: ['./unreal-bloom-selective.component.less']
})
export class UnrealBloomSelectiveComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Bloom('#three')
  }

}
