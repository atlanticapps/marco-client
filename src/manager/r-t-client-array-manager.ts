import { BehaviorSubject, Observer, Subscription } from 'rxjs';
import { RTEvent } from '../rt-event';
import { RTClientSnapshotManager } from './rt-client-snapshot-manager';

export class RTClientArrayManager<T> extends RTClientSnapshotManager<T> {
	protected _value: T[] = [];
	protected _valueChanges = new BehaviorSubject<T[]>(this._value);

	setInitialValue(value: T[]) {
		this._value = value;
		this.reSort();
		this._valueChanges.next(this._value);
	}

	onConnect(observer: Observer<T[]>): Subscription {
		return this._valueChanges.subscribe(observer);
	}

	public removeExplicitly(key: string) {
		this.removeKeys([key]);
		this._valueChanges.next(this._value);
	}

	clear() {
		this._value = [];
	}

	addValues(values: any[]) {
		if (this._value === null || typeof this._value === 'undefined') {
			this._value = [];
		}
		this._value.push(...values.map(it => this.dataSelector(it)));
	}

	removeKeys(keys: any[]) {
		keys.forEach(key => {
			this._value = this._value.filter((it) => this.keySelector(it) !== key);
		});
	}

	protected digestEvent(rtevent: RTEvent<any>) {
		super.digestEvent(rtevent);
		this.reSort();
		this._valueChanges.next(this._value);
	}

	protected reSort(arr: T[] = this._value) {
		if (this.compareFn) {
			arr.sort(this.compareFn);
		}
	}

}
