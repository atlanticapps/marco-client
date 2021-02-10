import { RTEvent } from './rt-event';

export interface EventResponse<T> {
	data: RTEvent<T>
}

export interface ErrorResponse {
	error: Error
}

export type Response<T> = EventResponse<T> | ErrorResponse
