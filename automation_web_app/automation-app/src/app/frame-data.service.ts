import { Injectable               } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FrameDataService {

    private headers:        HttpHeaders;
    private accessPointUrl: string = 'https://localhost:44357/api/Recording';

    constructor(private http: HttpClient) { this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }); }

	public getRecordings(  )		{ return this.http.get(this.accessPointUrl);													}
    public getById		(id)		{ return this.http.get(this.accessPointUrl + '/' + id);											}

	public addRecording	(payload)	{ return this.http.post(this.accessPointUrl, payload);											}
	public addFrame(id, frame)		{ return this.http.post(this.accessPointUrl + '/' + id, JSON.stringify(frame), httpOptions);	}


    //public remove (payload) { return this.http.delete (this.accessPointUrl + '/' + payload.id,                            }
    //public update (payload) { return this.http.put    (this.accessPointUrl + '/' + payload.id,  payload                   }
}
