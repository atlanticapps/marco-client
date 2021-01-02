import { RTEvent } from './rt-event';

export interface RTEventResponse<T> {
	data: RTEvent<T>
}

export interface RTEventErrorResponse {
	error: Error
}

export type RtEventClientResponse<T> = RTEventResponse<T> | RTEventErrorResponse
