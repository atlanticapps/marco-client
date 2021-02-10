import {Observable} from 'rxjs';
import {Backend} from './backend';
import {ArrayManager, SnapshotManager} from './manager';
import {RTEvent} from './rt-event';

export type ClientOptions<T> = Partial<{
    dataSelector: (input: any) => T
    initialValueSupplier: Observable<T[]>,
    keySelector: (value: T) => any
    manager: SnapshotManager<T>,
    headers: string | {
        [name: string]: string | string[];
    }
    observe: 'events' | 'snapshot';
}>

export class Client {
    constructor(protected backend: Backend) {
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
        manager: SnapshotManager<T>;
        headers?: string | {
            [name: string]: string | string[];
        }
        observe?: 'snapshot'
    }): Observable<T[]>;

    listen<T>(url: string): Observable<T[]>;

    listen(url: string): Observable<{}>;

    public listen<T>(url: string, opts?: ClientOptions<T>): Observable<T[] | RTEvent<T>> {
        const options = <ClientOptions<T>>Object.assign({}, {
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
                const manager = new ArrayManager({
                    keySelector: options.keySelector,
                    dataSelector: options.dataSelector,
                    initialValueSupplier: options.initialValueSupplier
                });
                return manager.connect(this.backend.listen<T>(url));
            }
        }
    }
}
