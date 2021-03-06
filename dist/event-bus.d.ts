import { OnModuleDestroy, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CommandBus } from './command-bus';
import {
  IEvent,
  IEventBus,
  IEventHandler,
  IEventPublisher,
  ISaga,
} from './interfaces';
import { ObservableBus } from './utils/observable-bus';
export declare type EventHandlerType = Type<IEventHandler<IEvent>>;
export declare class EventBus extends ObservableBus<IEvent>
  implements IEventBus, OnModuleDestroy {
  private readonly commandBus;
  private readonly moduleRef;
  private _publisher;
  private readonly subscriptions;
  constructor(commandBus: CommandBus, moduleRef: ModuleRef);
  get publisher(): IEventPublisher;
  set publisher(_publisher: IEventPublisher);
  onModuleDestroy(): void;
  publish<T extends IEvent>(event: T): void;
  publishAll(events: IEvent[]): void;
  bind(handler: IEventHandler<IEvent>, name: string): void;
  registerSagas(types?: Type<any>[]): void;
  register(handlers?: EventHandlerType[]): void;
  protected registerHandler(handler: EventHandlerType): void;
  protected ofEventName(name: string): Observable<IEvent>;
  private getEventName;
  protected registerSaga(saga: ISaga): void;
  private reflectEventsNames;
  private useDefaultPublisher;
}
