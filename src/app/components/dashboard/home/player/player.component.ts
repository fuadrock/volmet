import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../services/api.service';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';

@Component({
  selector: 'ngx-player',
  styleUrls: ['./player.component.scss'],
  templateUrl: './player.component.html',
})
export class PlayerComponent implements OnDestroy {
  @Input()
  @HostBinding('class.collapsed')
  collapsed: boolean;
  baseUrl : string
  player: HTMLAudioElement;
  shuffle: boolean;
  link: string;
  messageId: any;


  constructor(private apiService: ApiService,private dataCom:DataCommunicationService,  private toaster: NbToastrService,) {
    this.baseUrl = environment.base_url;
    this.link = "";

    this.dataCom.getMessageId.subscribe(
      res =>{
        if(res){
          this.messageId = res;
          console.log(this.messageId);
          this.apiService.get(`/api/audio/link?messageId=${this.messageId}`).subscribe(
            (res) => {
              this.link = res.data;
              console.log("audio response: ",res);
              this.createPlayer();
            },
            (err) => {
             // this.showToast('danger', err.error.errors[0].message)
             // this.createPlayer();
            }
          );
        }
      },
      err =>{

      }
    )
  }

  ngOnDestroy() {
    this.player.pause();
    this.player.src = '';
    this.player.load();
  }

  playPause() {
    if (this.player.paused) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  reloadStream() {
    this.dataCom.getMessageId.subscribe(
      res =>{
        if(res){
          this.messageId = res;
          console.log(this.messageId);
          this.apiService.get(`/api/audio/link?messageId=${this.messageId}`).subscribe(
            (res) => {
              this.link = res.data;
              console.log("audio response: ",res);
              this.player.pause();
              this.player.src = '';
              this.setTrack();
            },
            (err) => {
             // this.showToast('danger', err.error.errors[0].message)

            }
          );
        }
      },
      err =>{

      }
    )


    console.log(this.messageId);

  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
  }

  toggleLoop() {
    this.player.loop = !this.player.loop;
  }

  setVolume(volume: number) {
    this.player.volume = volume / 100;
  }

  getVolume(): number {
    return this.player?.volume * 100;
  }

  setProgress(duration: number) {
    if(this.link != ""){
      this.player.currentTime = this.player?.duration * duration / 100;
    } else {
      this.player.currentTime = 0;
    }
  }

  getProgress(): number {
    if(this.link != ""){
      return this.player?.currentTime / this.player?.duration * 100 || 0;
    } else {
      return 0;
    }
  }

  private createPlayer() {
    this.player = new Audio();
    this.setTrack();
  }

  private setTrack() {
    this.player.loop = false;
    this.player.currentTime = 0;
    if(this.link != ""){
      this.player.src = this.baseUrl + "api/audio/stream/" + this.link;
    }
    this.player.load();
  }


  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }
}
