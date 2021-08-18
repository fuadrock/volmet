import {Injectable, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  testBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    this.testBrowser = isPlatformBrowser(platformId);
  }

  public getAccessToken(): any {
    if (this.testBrowser) {
      return localStorage.getItem('accessToken');
    } else
      return;
  }

  public setRoleData(role){
    localStorage ? localStorage.setItem("userRole", JSON.stringify(role)): "";
    return this;
  }

  public getRoleData(){
    return localStorage ? JSON.parse(localStorage.getItem("userRole")) : '';
  }
  public setAccessToken(token): any {
    localStorage ? localStorage.setItem('accessToken', token) : "";

  }

  public getUserData():any {
    const token = this.getAccessToken();
    if(token){
      const payload = this.payload(token);

    return payload;
    }
  }



  public payload(token): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  public clear(): any {
    localStorage ? localStorage.removeItem('accessToken') : '';
  }

  public setOthersData(data, key_name): any {

    localStorage ? localStorage.setItem(key_name, JSON.stringify(data)) : '';

  }

  public getOthersData(key_name): any {

    return localStorage ? JSON.parse(localStorage.getItem(key_name)) : '';

  }

  public setFilterData(data): void {
    let filterData = this.getOthersData('filterData') ? this.getOthersData('filterData') : {};
    if (data["pageIndex"] >= 0) {
      filterData["pageIndex"] = data["pageIndex"];
    }
    if (data["pageSize"]) {
      filterData["pageSize"] = data["pageSize"];
    }
    if (data["filterData"]) {
      filterData["filterData"] = data["filterData"];
    }
    if (data["search"] == "clear") {
      filterData["search"] = "";
    } else if (data["search"] != "" && data["search"] != undefined) {
      filterData["pageIndex"] = 0;
      filterData["pageSize"] = 100;
      filterData["search"] = data["search"];
    }

    this.setOthersData(filterData, "filterData");
  }

  public getFilterData(): any {

    return localStorage ? JSON.parse(localStorage.getItem("filterData")) : '';

  }

  public clearFilterData(): void {

    localStorage ? localStorage.removeItem('filterData') : '';
  }


  public clearOthersData(key_name: string) {
    localStorage.removeItem(key_name);
  }
}
