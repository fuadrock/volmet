import { Injectable } from '@angular/core';
import { timer, Subscription, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import * as sha512 from 'js-sha512';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  server_status_subscription: Subscription;
  eventLog: any;
  broadcast: any;
  public statusData = new BehaviorSubject<any>('');
  getStatusData = this.statusData.asObservable();

  public eventData = new BehaviorSubject<any>('');
  getEventData = this.eventData.asObservable();

  public broadcastData = new BehaviorSubject<any>('');
  getBroadcastData = this.broadcastData.asObservable();


  public weatherData = new BehaviorSubject<any>('');
  getWeatherData = this.weatherData.asObservable();

  public weatherStatus = new BehaviorSubject<any>('');
  getWeatherStatus = this.weatherStatus.asObservable();

  public broadcastStatus = new BehaviorSubject<any>('');
  getBroadcastStatus = this.broadcastStatus.asObservable();


  serverLog: any;
  wather_data: any;
  broadcast_Status_subscription: Subscription;
  weather_status_subscription: Subscription;
  event_log_subscription: Subscription;
  weather_data_subscription: Subscription;
  messageId: any;

  weatherStarted = 0;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  getServerLog() {
    let pagination = `&from=&to=&pageNumber=0&pageSize=17`;
    this.server_status_subscription = timer(0, environment.server_status_scheduling_time).pipe(
      switchMap(() => this.apiService.get('api/application-logs?types=SYSTEM' + pagination))
    ).subscribe(res => {
      this.statusData.next(res);

    },
    err=>{
      this.statusData.next(null);
    });
  }

  getEventLog() {
    let pagination = `&from=&to=&pageNumber=0&pageSize=17`;
    this.event_log_subscription = timer(0, environment.server_status_scheduling_time).pipe(
      switchMap(() => this.apiService.get('api/application-logs?types=EVENT,ERROR' + pagination))
    ).subscribe(res => {

      this.eventData.next(res);
    },
      err => {
        this.eventData.next(null);
      });
  }

  fetchWeatherData() {

    if (this.weatherStarted == 0) {
      this.weatherStarted = 1;
      this.weather_data_subscription = timer(5000, 5000).pipe(
        switchMap(() => this.apiService.get('api/text/weather-data'))
      ).subscribe(res => {
        var hash = sha512.sha512(JSON.stringify(res.data));
        console.log(hash);
        if (!this.wather_data) {
          this.wather_data = hash;
        };
        if (this.wather_data !== hash) {
          this.wather_data = hash;
          console.log("changes in service call:", res.data);
          this.messageId = res.data[0].MessageId;
          this.weatherData.next(res);

        }
      });
    }
  }

  setMessageId(id) {
    this.messageId = id;
  }



  fetchWeatherStatus() {

    this.weather_status_subscription = timer(0, environment.weather_status_scheduling_time).pipe(
      switchMap(() => this.apiService.get(`api/text/weather-data/status/${this.messageId}`))
    ).subscribe(res => {
      this.weatherStatus.next(res);
    })
  };

  weatherLockRelease(){

    return this.apiService.put(`api/text/weather-data/status/${this.messageId}?editable=true`, { editable: true });
  }


  fetchBroadcastStatus() {
    this.broadcast_Status_subscription = timer(0, environment.broadcast_status_scheduling_time).pipe(
      switchMap(() => this.apiService.get(`api/audio/broadcastStatus`))
    ).subscribe(res => {
      this.broadcastStatus.next(res);
    })
  };


  stopServerStatus() {
    if (this.server_status_subscription) {
      this.server_status_subscription.unsubscribe();
    }
  }

  stopBroadcastStatus() {
    if (this.broadcast_Status_subscription) {
      this.broadcast_Status_subscription.unsubscribe();
    }
  }
  stopWeatherStatus() {
    if (this.weather_status_subscription) {
      this.weather_status_subscription.unsubscribe();
    }
  }

  stopEventLog() {
    if (this.event_log_subscription) {
      this.event_log_subscription.unsubscribe();
    }
  }
  stopWeatherData() {
    if (this.weather_data_subscription) {
      this.weather_data_subscription.unsubscribe();
    }
  }
}
