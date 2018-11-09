import { AudioProvider } from './../../providers/audio/audio';
import { ApiProvider } from './../../providers/api/api';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  public posts$: Observable<any[]> = null;
  private curPost: number = 0;  
  private lastPost: number = 0;
  private infiniteEvent: any;
  public posts: any[] = null;

  constructor(
    public navCtrl: NavController,
    private api: ApiProvider,    
    private audioService: AudioProvider
  ) {
    
  }
  
  ngOnInit(){
    // get posts
    this.posts$ = this.api.posts$;
    this.posts$.pipe(
      tap(resp =>{
        if(this.infiniteEvent) this.infiniteEvent.complete();             
        this.curPost = resp.length;             
        if(this.lastPost === resp.length){
          if(this.infiniteEvent) this.infiniteEvent.enable(false);
        }else{
          this.lastPost = resp.length;
        }
      })
    ).subscribe(resp => {
      console.log('dev11', resp);
      this.posts = resp;           
    });

    this.api.getPosts({
      num: 0
    });
    this.audioService.audio = new Audio();
  }

  infiniteLoad(event){          
    console.log('dev10', this.curPost);
    this.api.getPosts({
      num: this.curPost
    })    
    this.infiniteEvent = event;
  }

  doRefresh(event){
    this.curPost = 0;
    this.lastPost = 0;

    this.api.getPosts({
      num: this.curPost
    }, true);     
  }

  openMessages(){
    //    
  }

  identify(index, post){    
    return post.id;
  }

}
