import { Component, OnInit } from '@angular/core';
import { LineClip } from './Element/LineClip';

@Component({
  selector: 'app-line-clip',
  templateUrl: './line-clip.component.html',
  styleUrls: ['./line-clip.component.less']
})
export class LineClipComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new LineClip('#three');
  }

}
