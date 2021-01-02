import { Observable } from 'rxjs';
import { RtEventClientResponse } from '../client-response';
import { RTEvent } from '../rt-event';

export interface RTEventClientBackend {
	listen<T>(url: string, options?: {
		headers?: string | {
			[name: string]: string | string[];
		},
		observe?: 'events'
	}): Observable<RTEvent<T>>

	listen<T>(url: string, options?: {
		headers?: string | {
			[name: string]: string | string[];
		},
		observe?: 'response'
	}): Observable<RtEventClientResponse<T>>

	listen<T>(url: string, options?: {
		headers?: string | {
			[name: string]: string | string[];
		},
		observe?: 'events' | 'response'
	}): Observable<RTEvent<T> | RtEventClientResponse<T>>
}
