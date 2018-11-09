import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { ToastController } from 'ionic-angular';

/*
  Generated class for the ProvidersApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  postsSubject = new BehaviorSubject<any[]>([]);
  posts$: Observable<any[]>;
  isLoading = new BehaviorSubject<boolean>(false);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };
  environment = {
    mainEndpoint: 'http://localhost/hackweb/hw_web/www/api/'
    // mainEndpoint: 'https://www.hackweb.it/api/'
  }

  constructor(
    public http: HttpClient,
    private toast: ToastController
  ) {
    this.posts$ = this.postsSubject;
  }

  // get all the posts
  getPosts(data: any, reset: boolean = false) {    
    const sendData = {
      action: 'getPosts',      
      order: 'added',
      order2: '20',
      lat: '40',
      lng: '11',
      user_id: 0,
      ...data
    };    
    
    this.isLoading.next(true);

    return this.http.post<any[]>(this.environment.mainEndpoint, sendData, this.httpOptions)
    .pipe(
      tap(resp => {
        this.isLoading.next(false);      
      })
    )
    .subscribe(resp => {
      if(reset) this.postsSubject.next([...resp]);      
      else this.postsSubject.next([...this.postsSubject.getValue(), ...resp]);
    });
  }

  // present toast messages
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000      
    });
    toast.present();
  }

  // get searched posts
  searchPosts(data: any, reset: boolean = false) {    
    const sendData = {
      api: 'TELLER',
      action: 'searchPosts',
      data: {            
        order2: '20',
        lat: '40',
        lng: '11',
        user_id: 0,
        ...data
      }      
    };    
    
    this.isLoading.next(true);

    return this.http.post<any[]>(this.environment.mainEndpoint+'?v=3', sendData, this.httpOptions)
    .pipe(
      tap(resp => {
        this.isLoading.next(false);        
      })
    )
  }

}
