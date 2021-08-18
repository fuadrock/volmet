import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor() { }

  validateUser(userInfo: any) : boolean {
      console.log(userInfo);
      return true;
  }
}
