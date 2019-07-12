import { Component, OnInit } from '@angular/core';
import {FrameComponent} from "../frame/frame.component";

@Component({
  selector: 'app-entity-class',
  templateUrl: './entity-class.component.html',
  styleUrls: ['./entity-class.component.css']
})
export class EntityClassComponent implements OnInit {

  constructor(public framework: FrameComponent) { }

  ngOnInit() {
  }

}
