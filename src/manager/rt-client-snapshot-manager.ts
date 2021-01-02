import { Observable, Observer, Subscription } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { RTEvent } from '../rt-event';

export interface RTClientSnapshotManagerOptions<T> {
	keySelector: (T) => any,
	dataSelector?: (any) => T,
	initialValueSupplier?: Observable<T[]>,
	comparator?: (lhs: T, rhs: T) => number
}

export abstract class RTClientSnapshotManager<T> {
	protected keySelector: (T) => any;
	protected dataSelector: (any) => T;
	protected compareFn: ((a: T, b: T) => number) | null;
	private sub;

	constructor(private options: RTClientSnapshotManagerOptions<T>) {
		if ('comparator' in options) {
			this.compareFn = options.comparator;
		}
		if ('dataSelector' in options) {
			this.dataSelector = options.dataSelector;
		} else {
			this.dataSelector = (it) => it;
		}
		this.keySelector = options.keySelector;
	}



	public disconnect() {
		this.sub.unsubscribe();
	}

	public connect(obs: Observable<RTEvent<T>>): Observable<T[]> {
		return Observable.create((observer: Observer<T[]>) => {
			this.sub = this.onConnect(observer);
			if ('initialValueSupplier' in this.options && this.options.initialValueSupplier != null) {
				this.sub.add(
				  this.options.initialValueSupplier.pipe(
					first(),
					tap((init) => this.setInitialValue(init)),
					switchMap(() => obs)
				  ).subscribe(this.digestEvent.bind(this)));
			} else {
				this.sub.add(obs.subscribe(this.digestEvent.bind(this)));
			}
			return () => {
				this.sub.unsubscribe();
				this.tearDown();
			};
		});
	}

	abstract setInitialValue(value: T[])

	abstract onConnect(observer: Observer<T[]>): Subscription

	abstract clear()

	abstract addValues(values: T[])

	abstract removeKeys(keys: any[])

	protected tearDown() {
		this.clear();
	}

	protected digestEvent(rtevent: RTEvent<any>) {
		switch (rtevent.type) {
			case 'NEW':
				this.addValues(rtevent.new.map(it => this.dataSelector(it)));
				break;
			case 'CHANGED':
				const values = rtevent.changed.map(it => this.dataSelector(it));
				this.removeValues(values);
				this.addValues(values);
				break;
			case 'DELETED':
				this.removeKeys(rtevent.deleted);
				break;
			case 'CLEAR':
				this.clear();
				break;
		}
	}

	protected removeValues(values: T[]) {
		this.removeKeys(values.map(it => this.keySelector(it)));
	}
}
