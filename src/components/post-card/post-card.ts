import { ApiProvider } from './../../providers/api/api';
import { AudioProvider } from './../../providers/audio/audio';
import { Component, Input, OnInit } from '@angular/core';

/**
 * Generated class for the PostCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'post-card',
  templateUrl: 'post-card.html'
})
export class PostCardComponent implements OnInit {

  @Input() post: any;  
  lastaudiopos: any;

  constructor(    
    private audioService: AudioProvider,
    private api: ApiProvider
  ) {
          
  }

  ngOnInit(){
    //bind functions
    this.audioService.audio.ontimeupdate = (e) => {
      this.handleTimeUpdate(this.audioService.curpost.getValue());
    }

    this.audioService.audio.onended = (e) => {
      this.audioService.curpost.getValue().audioPlaying = false;
      this.audioService.curpost.getValue().currentTime = 0;
      this.audioService.curpost.getValue().elapsed = 0;
    }

    this.audioService.audio.onerror = (e) => {        
      this.api.presentToast('There was an error with this audio file.')
      this.audioService.curpost.getValue().audioEnabled = false;
      this.audioService.curpost.getValue().audioPlaying = false;
    }

    this.audioService.audio.onloadeddata = (e) => {
      if(this.audioService.curpost.getValue().elapsed) this.audioService.audio.currentTime = this.audioService.curpost.getValue().elapsed;          
    }
  }

  playPost(post){
    if(post.audioPlaying) {
      this.audioService.audio.pause();
      post.audioPlaying = false;
      return;
    }    

    if(post !== this.audioService.curpost.getValue()){
      //pause previous
      this.audioService.audio.pause();
      this.audioService.curpost.getValue().audioPlaying = false;

      //assing new post   
      this.audioService.curpost.next(post);                           
      
      //load new one
      this.audioService.audio.src = this.api.environment.mainEndpoint+'/uploads/audio/'+post.audio; //'0aa1883c6411f7873cb83dacb17b0afc.m4a';
      this.audioService.audio.load();        
    }                     

    if(typeof post.elapsed != 'undefined') {      
      this.audioService.audio.currentTime = post.elapsed;      
      if(post.elapsed <= 0.1) this.audioService.audio.currentTime = 0;
      if(post.elapsed >= post.duration) this.audioService.audio.currentTime = 0;      
    }    
    
    post.audioEnabled = true;
    post.audioPlaying = true;            
    this.audioService.audio.play();       
          
  }

  handleTimeUpdate(post) {
    if(post === this.audioService.curpost.getValue()) {
      if(!this.audioService.audio.paused){
        const elapsed = this.audioService.audio.currentTime;
        const duration = this.audioService.audio.duration;    
        post.position = elapsed / duration;
        post.elapsed = (elapsed);
        post.duration = (duration);
      }      
    }    
  }

  audioChange(e, post){            
    this.lastaudiopos = e.detail.value;
    if(post === this.audioService.curpost.getValue()) {
      if(this.audioService.audio.paused) post.elapsed = e.detail.value;
    }else post.elapsed = e.detail.value;         
  }

  pauseFrom(post){        
    if(post === this.audioService.curpost.getValue()) {
      this.audioService.audio.pause();  
      // post.audioPlaying = false;                      
    }
  }

  playFrom(post){    
    if(post === this.audioService.curpost.getValue() && post.audioPlaying) {        
      window.setTimeout(()=>{            
        this.audioService.audio.currentTime = this.lastaudiopos;
        post.audioPlaying = true;
        this.audioService.audio.play();
      }, 500);
    }
  }

}
