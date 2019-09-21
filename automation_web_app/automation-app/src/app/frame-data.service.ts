import { Injectable               } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FrameDataService {

    private headers:        HttpHeaders;
    private accessPointUrl: string = 'http://localhost:5000';

    constructor(private http: HttpClient) { this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }); }

	//GET
	public getRecordingPreviews	()			{ return this.http.get	 (this.accessPointUrl + '/RecordingPreviews');					}
	public getRecording			(id)		{ return this.http.get	 (this.accessPointUrl + '/Recording/' + id	);					}
	public getFriends			()			{ return this.http.get	 (this.accessPointUrl + '/Friend'			);					}
	
	//DELETE
	public deleteRecording		(id)		{ return this.http.delete(this.accessPointUrl + '/Recording/' + id	);					}

	//PATCH
	public updateRecordingName	(id, name)	{ return this.http.patch(this.accessPointUrl + '/Recording/' + id + '/' + name, "");	}

	//POST
	public postFriend			(data)		{ return this.http.post	(this.accessPointUrl + '/Friend', data);						}
}
