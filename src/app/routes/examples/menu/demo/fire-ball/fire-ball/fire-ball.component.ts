import { Component, OnInit } from '@angular/core';
import { Fire } from '../Class/Fire';

@Component({
  selector: 'app-fire-ball',
  templateUrl: './fire-ball.component.html',
  styleUrls: ['./fire-ball.component.less']
})
export class FireBallComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new Fire('#three')
  }

}
