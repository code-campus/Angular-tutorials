/**
 * Import des dépendances Angular
 */
import { Component, OnDestroy, OnInit } from '@angular/core';

/**
 * Import des dépendances du module
 */
import { MusicPlayerService } from 'ngx-soundmanager2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
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
      title: '-',
      artist: 'Glitter',
      url: 'http://54.38.228.105:8000/stream'
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
