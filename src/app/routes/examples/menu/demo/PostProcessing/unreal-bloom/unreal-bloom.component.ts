import { Component, OnInit } from '@angular/core';
import { Bloom } from './bloom';

@Component({
  selector: 'app-unreal-bloom',
  templateUrl: './unreal-bloom.component.html',
  styleUrls: ['./unreal-bloom.component.less']
})
export class UnrealBloomComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
   new Bloom('#three')
  }

}
