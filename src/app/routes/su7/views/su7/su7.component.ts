import { AfterViewInit, Component, OnInit } from '@angular/core';
import { adaptMobileDOM } from '../../kokomi/web/responsive';
import Experience from '../Experience/Experience';

@Component({
  selector: 'app-su7',
  templateUrl: './su7.component.html',
  styleUrls: ['./su7.component.less']
})
export class Su7Component implements OnInit , AfterViewInit {

  constructor() { }


  ngOnInit(): void {
    this.init()
  }

  init():void{
    
  }

  ngAfterViewInit(): void {
    const app = document.querySelector("#app")! as HTMLElement;
    adaptMobileDOM(app)

    new Experience('#sketch')
  }

  

}
