import { Injectable               } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';


@Injectable()
export class FrameDataService {

    private headers:        HttpHeaders;
    private accessPointUrl: string = 'https://localhost:44357/api/Recording';

    constructor(private http: HttpClient) { this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }); }

    public get    (   ) { return this.http.get(this.accessPointUrl); }
    public getById(id) { console.log(this.accessPointUrl + '/' + id); return this.http.get(this.accessPointUrl + '/' + id); }
    //public add    (payload) { return this.http.post   (this.accessPointUrl,                     payload                   }
    //public remove (payload) { return this.http.delete (this.accessPointUrl + '/' + payload.id,                            }
    //public update (payload) { return this.http.put    (this.accessPointUrl + '/' + payload.id,  payload                   }
}
