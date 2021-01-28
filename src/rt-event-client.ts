import { defer, Observable, of } from 'rxjs';
import { RTEventClientBackend } from './backend/rt-event-client-backend';
import { RTClientArrayManager } from './manager';
import { RTClientSnapshotManager } from './manager/rt-client-snapshot-manager';
import { RTEvent } from './rt-event';
import { EventSourceRTEventClientBackend} from './backend/sse/event-source-rt-event-client-backend';

export type RtEventClientOptions<T> = RTEventClientOptionalParams<T>;
export type RtEventClientSettings<T> = RTEventClientOptionalParams<T>;


export interface RTEventClientOptionalParams<T> {
	dataSelector?: (input: any) => T
	initialValueSupplier?: Observable<T[]>,
	keySelector?: (T) => any
	manager?: RTClientSnapshotManager<T>,
	headers?: string | {
		[name: string]: string | string[];
	}
	observe?: 'events' | 'snapshot';
}

export interface RTEventClientOptions<T> {
	initialValueSupplier?: Observable<T[]>,
	dataSelector: (input: any) => T
	headers: string | {
		[name: string]: string | string[];
	}
	observe?: 'events' | 'snapshot';
}

export class RTEventClient {
	constructor(protected backend: RTEventClientBackend = new EventSourceRTEventClientBackend()) {
	}

	listen<T>(url: string, options: {
		initialValueSupplier?: Observable<T[]>,
		dataSelector?: (any) => T
		headers?: string | {
			[name: string]: string | string[];
		}
		observe?: 'events'
	}): Observable<RTEvent<T>>;

	listen<T>(url: string, options: {
		initialValueSupplier?: Observable<T[]>,
		dataSelector?: (input: any) => T
		keySelector?: (T) => any
		headers?: string | {
			[name: string]: string | string[];
		}
		observe?: 'snapshot'
	}): Observable<T[]>;

	listen<T>(url: string, options: {
		manager: RTClientSnapshotManager<T>;
		headers?: string | {
			[name: string]: string | string[];
		}
		observe?: 'snapshot'
	}): Observable<T[]>;

	listen<T>(url: string): Observable<T[]>;

	listen(url: string): Observable<{}>;

	public listen<T>(url: string, opts?: RtEventClientOptions<T>): Observable<T[] | RTEvent<T>> {
		const options = <RtEventClientOptions<T>>Object.assign({}, {
			dataSelector: (it: any) => it,
			keySelector: (it: T) => it['syncId'],
			observe: 'body'
		}, opts);
		if (options.observe === 'events') {
			return this.backend.listen<T>(url);
		} else {
			if ('manager' in options) {
				return options.manager.connect(this.backend.listen<T>(url));
			} else {
				const manager = new RTClientArrayManager({
					keySelector: options.keySelector,
					dataSelector: options.dataSelector,
					initialValueSupplier: options.initialValueSupplier
				});
				return manager.connect(this.backend.listen<T>(url));
			}
		}
	}
}
