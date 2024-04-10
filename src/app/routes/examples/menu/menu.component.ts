import { Component, OnInit } from '@angular/core';
import Experience from '../../su7/views/Experience/Experience';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
    
  }


  view(url:string){
    this.router.navigateByUrl(url)
  } 



}
