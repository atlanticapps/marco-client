import { Observable, Observer } from 'rxjs';
import { RtEventClientResponse } from '../../client-response';
import { RTEvent } from '../../rt-event';
import { RTEventClientBackend } from '../rt-event-client-backend';
import { EventSourceEvent } from './event-source-event';
import { SSEvent } from './ssevent';

declare var EventSource: any;

export class EventSourceRTEventClientBackend implements RTEventClientBackend {
  listen<T>(url: string,
            options?: { headers?: string | { [p: string]: string | string[] }; observe?: 'events' }): Observable<RTEvent<T>>;
  listen<T>(url: string,
            options?: { headers?: string | { [p: string]: string | string[] }; observe?: 'response' }): Observable<RtEventClientResponse<T>>;
  listen(url: string,
         options?: { headers?: string | { [p: string]: string | string[] }; observe?: 'events' } | { headers?: string | { [p: string]: string | string[] }; observe?: 'response' } | { headers?: string | { [p: string]: string | string[] }; observe?: 'events' | 'response' }): any;
  listen<T>(url: string,
            options?: { headers?: string | { [p: string]: string | string[] }; observe?: 'events' | 'response' }): Observable<RTEvent<T> | RtEventClientResponse<T>> {
    options = Object.assign({}, {headers: {}, observe: 'events'}, options);
    let _propagateEvent = (observer, event) => {
      let body: any;
      if (!event['data']) {
        body = null;
      } else {
        body = <T>JSON.parse(event['data']);
      }
      if (options.observe === 'events') {
        observer.next(body);
      } else {
        observer.next({data: body});
      }
    };

    return Observable.create((obs: Observer<SSEvent<T> | EventSourceEvent<T>>) => {
      const h = options.headers;
      const ev = new EventSource(url, {headers: h});
      ev.onmessage = (event) => {
        if (obs.closed) {
          return;
        }
        _propagateEvent(obs, event);
      };
      ev.onerror = () => {
        const err = new Error('EventSource connection closed, connection error. (' + url + ')');
        if (ev.readyState === ev.CLOSED) {
          obs.error(err);
        } else {
          if (options.observe === 'events') {
            obs.next({error: err});
          }
        }
      };
      return () => {
        ev.close();
      };
    });
  }
}
