import { Component, OnInit } from '@angular/core';
import { Shader } from './Shader';

@Component({
  selector: 'app-shader',
  templateUrl: './shader.component.html',
  styleUrls: ['./shader.component.less']
})
export class ShaderComponent implements OnInit {

  constructor() { 
  }

  ngOnInit(): void {
    new Shader('#three')
  }

}
