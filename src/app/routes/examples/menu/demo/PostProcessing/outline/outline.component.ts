import { Component, OnDestroy, OnInit } from '@angular/core';
import { Outline } from './outline';

@Component({
  selector: 'app-outline',
  templateUrl: './outline.component.html',
  styleUrls: ['./outline.component.less']
})
export class OutlineComponent implements OnInit , OnDestroy {

  constructor() { }

  outline!:Outline;

  ngOnDestroy(): void {
    this.outline.destory()
  }

  ngOnInit(): void {
   this.outline =  new Outline('#three')
  }

}
