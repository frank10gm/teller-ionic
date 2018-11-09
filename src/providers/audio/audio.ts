import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/*
  Generated class for the AudioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AudioProvider {

  curpost = new BehaviorSubject<any>({});
  audio;

  constructor(
    
  ) {
    this.audio = new Audio();
  }

}
