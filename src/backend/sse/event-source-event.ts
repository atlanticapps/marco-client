import { SSEvent } from './ssevent';

export type EventSourceEvent<T> = EventSourceResponseEvent<T> | EventSourceErrorEvent

export interface EventSourceResponseEvent<T> {
	body: SSEvent<T>;
}

export interface EventSourceErrorEvent {
	error: Error;
}