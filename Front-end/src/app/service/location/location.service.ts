import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  poly: {Latitude: number; Longitude: number}[] = [];

  constructor() { }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
      },
      err => {
        reject(err);
      });
    });
  }

  
  // Fungsi untuk mengecek lokasi perangkat
  getLocation(x: number, y: number): void {
    this.getPosition()
      .then(pos => {
        return x = pos.lat, y = pos.lng
      });
  }

  getCordinates() {
  
    let latitude = window.localStorage.getItem("latitude")?.split(',');
    let longitude = window.localStorage.getItem("longitude")?.split(',');

    if (latitude && longitude){
      for (let i=0; i<((latitude.length+longitude.length)/2); i++) {
      let obj = {Latitude: Number(latitude[i]), Longitude: Number(longitude[i])}

      this.poly.push(obj);
    }
    }
  }

  getLocationValid(): Promise<boolean> {
    this.getCordinates();
    let inside = false;
  
    return new Promise<boolean>((resolve, reject) => {
      this.getPosition()
        .then(pos => {
          // const x = pos.lat;
          // const y = pos.lng;
          const x = -6.292965338158925;
          const y = 106.64300190546072;

          console.log(x,y);
          
          for (let i = 0, j = this.poly.length - 1; i < this.poly.length; j = i++) {
            let xi = this.poly[i].Latitude, yi = this.poly[i].Longitude;
            let xj = this.poly[j].Latitude, yj = this.poly[j].Longitude;
            let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
              inside = !inside;
            }
          }
          resolve(inside);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // getLocationValid(): boolean {
  //   this.getCordinates();

  //   let x: number = 0, y: number = 0;
  //   this.getLocation(x, y);
  //   let inside = false;
    
  //   for (let i = 0, j = this.poly.length - 1; i < this.poly.length; j = i++) {
  //     console.log(j)
  //     let xi = this.poly[i].Latitude, yi = this.poly[i].Longitude;
  //     let xj = this.poly[j].Latitude, yj = this.poly[j].Longitude;
  //     let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
  //     if (intersect) inside = !inside;
  //   }
  //   return inside;
  // }
}
