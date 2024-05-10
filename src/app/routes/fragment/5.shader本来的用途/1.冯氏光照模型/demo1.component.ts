import { Component, OnInit } from '@angular/core';
import { Demo } from './demo';

@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.less']
})
export class Demo1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Demo('#three')
  }

}
