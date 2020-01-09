import { IEvent } from './interfaces/index';

const INTERNAL_EVENTS = Symbol();
const IS_AUTO_COMMIT_ENABLED = Symbol();
const VERSION = Symbol();

export abstract class AggregateRoot {
  public [IS_AUTO_COMMIT_ENABLED] = false;
  private readonly [INTERNAL_EVENTS]: IEvent[] = [];
  private [VERSION]: number = -1;

  set autoCommit(value: boolean) {
    this[IS_AUTO_COMMIT_ENABLED] = value;
  }

  get autoCommit(): boolean {
    return this[IS_AUTO_COMMIT_ENABLED];
  }

  async publish(event: IEvent, expectedVersion?: number | undefined): Promise<void> {}

  async commit(): Promise<void> {
    for (const event of this[INTERNAL_EVENTS]) {
      await this.publish(event, this[VERSION]++);
    }
    this[INTERNAL_EVENTS].length = 0;
  }

  uncommit() {
    this[INTERNAL_EVENTS].length = 0;
  }

  getUncommittedEvents(): IEvent[] {
    return this[INTERNAL_EVENTS];
  }

  loadFromHistory(history: IEvent[]) {
    history.forEach(event => this.apply(event, true));
  }

  apply(event: IEvent, isFromHistory = false) {
    if (!isFromHistory && !this.autoCommit) {
      this[INTERNAL_EVENTS].push(event);
    }
    this.autoCommit && this.publish(event, this[VERSION]++);

    const handler = this.getEventHandler(event);
    handler && handler.call(this, event);
  }

  private getEventHandler(event: IEvent): Function | undefined {
    const handler = `on${this.getEventName(event)}`;
    return this[handler];
  }

  protected getEventName(event): string {
    const { constructor } = Object.getPrototypeOf(event);
    return constructor.name as string;
  }
}
