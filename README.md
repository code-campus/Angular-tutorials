# Audio Player : SoundManager 2
> ### Objectifs :
> Intégration et utilisation de la librairie SoundManager2




# Création d'un nouveau projet

```bash
ng new my-project --style=less --routing
cd my-project
```




# Installation des dépendances

## Liste des dépendances

- `soundmanager2` : Librairie SoundManager 2
- `ngx-soundmanager2` : Compatibilité de la librairie SoundManager 2 avec Angular

## Commandes d'intallation

```bash
npm i soundmanager2 --save
npm i ngx-soundmanager2 --save
```




# Importer SoundManager dans l'application

## Importer la source SM2

Ajouter la dépendance SoundManager2 dans le fichier `angular.json`

```json
"scripts": [
  "./node_modules/soundmanager2/script/soundmanager2-jsmin.js"
],
```

## Importer l'adaptateur SM2 dans le module principale

Importer l'adaptateur `ngx-soundmanager2` dans le module principale `app.module.ts`

```typescript
import { NgxSoundmanager2Module } from 'ngx-soundmanager2';

// ... 


@NgModule({
  imports: [
    // ...
    NgxSoundmanager2Module.forRoot()
  ],
})
```




# Création du composant

## Importer les dépendances

```typescript
/**
 * Import des dépendances Angular
 */
import { Component, OnDestroy, OnInit } from '@angular/core';

/**
 * Import des dépendances du module
 */
import { MusicPlayerService } from 'ngx-soundmanager2';

// ...

constructor(
  private _musicPlayerService: MusicPlayerService
) {}
```

## Ajouter les propriétés et méthodes

```typescript
export class AppComponent implements OnInit, OnDestroy {

  title = 'my-project';

  // Fake Model : songs
  songs = [
    {
      id: 'AZERTYUIO-2154251565235A-JGHFDSQ',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      url: 'https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3'
    },
    {
      id: 'one',
      title: 'Kick It',
      artist: 'Raised On Zenith',
      url: 'https://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=10442536bc89f9881e8da2eb81ecd5fb&id=120877506&stream=1&ts=1502502685.0'
    },
    {
      id: 'two',
      title: 'How Long',
      artist: 'Raised On Zenith',
      url: 'https://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=468f1ed20aae2aba824fb4e6923ff850&id=470307233&stream=1&ts=1502595994.0'
    },
    {
      id: 'three',
      title: 'Details and Structures',
      artist: 'Air This Side of Caution',
      url: 'http://lukefarran.com/music/AirThisSideOfCaution/NatureWillTurnOnUs/02_Details%26Structures.mp3'
    },
    {
      id: 'four',
      title: 'Here We Go',
      artist: 'Air This Side of Caution',
      url: 'http://lukefarran.com/music/AirThisSideOfCaution/NatureWillTurnOnUs/03_HereWeGo.mp3'
    },
    {
      id: 'five',
      title: 'Without You',
      artist: 'The Assembly',
      url: 'http://lukefarran.com/music/TheAssembly/TheFutureHasBeenSold_LukeMaster/07_WithoutYou.mp3'
    }
  ];

  mute: boolean;
  currentPlaying: any;
  currentTrackPostion: number;
  currentTrackDuration: number;
  currentTrackProgress: number;
  volume: number;

  // subscriptions
  private _musicPlayerMuteSubscription: any;
  private _musicPlayerTrackIdSubscription: any;
  private _musicPlayerVolumeSubscription: any;

  constructor(
    private _musicPlayerService: MusicPlayerService
  ) {}

  ngOnInit() {
    // Subscribe for mute changes to update bindings
    this.mute = this._musicPlayerService.getMuteStatus();
    this._musicPlayerMuteSubscription = this._musicPlayerService.musicPlayerMuteEventEmitter
      .subscribe((event: any) => {
        this.mute = event.data;
      });

    // Subscribe for track changes
    this.currentPlaying = this._musicPlayerService.currentTrackData();
    this._musicPlayerTrackIdSubscription = this._musicPlayerService.musicPlayerTrackEventEmitter
      .subscribe((event: any) => {
        this.currentPlaying = this._musicPlayerService.currentTrackData();
        this.currentTrackPostion = event.data.trackPosition;
        this.currentTrackDuration = event.data.trackDuration;
        this.currentTrackProgress = event.data.trackProgress;
      });

    // subscribe for volume changes
    this.volume = this._musicPlayerService.getVolume();
    this._musicPlayerVolumeSubscription = this._musicPlayerService.musicPlayerVolumeEventEmitter
      .subscribe((event: any) => {
        this.volume = event.data;
      });
  }

  ngOnDestroy() {
    this._musicPlayerMuteSubscription.unsubscribe();
    this._musicPlayerTrackIdSubscription.unsubscribe();
    this._musicPlayerVolumeSubscription.unsubscribe();
  }

  get progress(): string {
    return this.currentTrackProgress ? (this.currentTrackProgress.toString() + '%') : '0%';
  }

  get playlist(): any {
    return this._musicPlayerService.getPlaylist();
  }
}
```

## Modifier le template HTML

```html
<h1>
  Welcome to {{ title }}!
</h1>


<h3>Currently Playing</h3>

<ul>
  <li>Is Playing ?: <span *ngIf="currentPlaying">Yes</span></li>
  <li>Title: {{ currentPlaying.title }}</li>
  <li>Performer: {{ currentPlaying.artist }}</li>
  <li>Duration : {{ currentTrackDuration | humanTime }}</li>
  <li>Position : {{ currentTrackPostion | humanTime }}</li>
  <li>Progress : {{ currentTrackProgress }}</li>
  <li>Progress : {{ progress }}</li>
</ul>

{{ currentPlaying | json}}

<hr>



<h3>Controls</h3>

<button playAll [songs]="songs">Play all</button>
<button playAll [songs]="songs" [play]="false">Add all</button>
<br>
<button previousTrack>Prev.</button>
<button nextTrack>Next</button>
<button clearPlaylist>Clear Playlist</button>
<br>
<button playMusic>Play</button>
<button pauseMusic>Pause</button>
<button stopMusic>Stop</button>
<button repeatMusic>Repeat</button>

      
<hr>



<h3>Volume</h3>

<h5>Volume: {{ volume }}</h5>

<div class="button-row">
  <button increaseVolume>+</button>
  <button decreaseVolume>-</button>
  <button muteMusic>Mute ({{ mute }})</button>
</div>

<hr>



<h3>Playlist</h3>

<ul>
  <li *ngFor="let song of playlist; index as i;">
    <span playFromPlaylist [song]="song">{{ song.title }}</span>
    <button [musicPlayer]="'play'" [song]="song">play</button>
    <button removeFromPlaylist [song]="song" [index]="i">remove</button>
    <span *ngIf="currentPlaying && currentPlaying.id == song.id"> - (current)</span>
  </li>
</ul>

<hr>



<h3>Catalog</h3>

<div *ngFor="let song of songs" class="songs">

  <span>{{ song.title }}</span>
  <button [musicPlayer]="'play'" [song]="song">play</button>
  <button musicPlayer [song]="song">+</button>

</div>
```




# Démarrer le Serveur de développement

```bash
ng serve
```