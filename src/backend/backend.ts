import { Observable } from 'rxjs';
import { Response } from '../client-response';
import { RTEvent } from '../rt-event';

export interface Backend {
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
	}): Observable<Response<T>>

	listen<T>(url: string, options?: {
		headers?: string | {
			[name: string]: string | string[];
		},
		observe?: 'events' | 'response'
	}): Observable<RTEvent<T> | Response<T>>
}
