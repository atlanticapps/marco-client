export type RTEvent<T> = RTNewEvent<T> | RTChangeEvent<T> | RTDeleteEvent | RTClearEvent

export interface RTClearEvent {
	type: 'CLEAR';
	entityType: string;
}

export interface RTDeleteEvent {
	type: 'DELETED';
	deleted: string[];
	entityType: string;
}

export interface RTNewEvent<T> {
	type: 'NEW';
	new: T[];
	entityType: string;
}

export interface RTChangeEvent<T> {
	type: 'CHANGED';
	changed: T[];
	entityType: string;
}
