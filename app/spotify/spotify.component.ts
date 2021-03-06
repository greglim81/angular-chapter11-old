import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { FormControl } from '@angular/forms';

import { SpotifyService } from './spotify.service'; 

@Component({
  selector: 'spotify',
    styles: [`
      .img {
          position: relative;
          float: left;
          width:  100px;
          height: 100px;
          background-position: 50% 50%;
          background-repeat:   no-repeat;
          background-size:     cover;
      }            
    `],  
  template: `            
        <input class="form-control" type="search" [formControl]="searchControl">            
        <h3>Spotify Results</h3>    
        <div *ngIf="isLoading">
          <i class="fa fa-spinner fa-spin fa-3x"></i>
        </div>    
        <div *ngFor="let artist of artists" class="media">
            <div class="media-left">
                <a [routerLink]="['artist',artist.id, artist.name]">
                <img class="media-object img" src="{{ artist.images[2]?.url }}" alt="...">
                </a>
            </div>
            <div class="media-body">
                <h4 class="media-heading">{{ artist.name }}</h4>
                Followers: {{ artist.followers.total}}
                Popularity: {{ artist.popularity }}
            </div>
        </div>                                            
    `
  //providers: [SpotifyService]
})
export class SpotifyComponent {
  searchControl = new FormControl();

  isLoading = false;

  artists = [];

  constructor(private _spotifyService: SpotifyService){
      
  }

  ngOnInit() {
      this.searchControl.valueChanges
          .filter(text => text.length >= 3)   
          .debounceTime(400)   
          .distinctUntilChanged()    
          .subscribe(value => {
            this.isLoading = true;            
            this._spotifyService.getSpotifyData(value)
                .subscribe(data => {
                  this.isLoading = false;
                  this.artists = data.artists.items;                  
                });            
      });          
  }

}

/**
 * 
 * <a href="https://api.spotify.com/v1/artists/{{ artist.id }}">
 * 
 */