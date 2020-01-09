"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const INTERNAL_EVENTS = Symbol();
const IS_AUTO_COMMIT_ENABLED = Symbol();
const VERSION = Symbol();
class AggregateRoot {
    constructor() {
        this[_a] = false;
        this[_b] = [];
        this[_c] = -1;
    }
    set autoCommit(value) {
        this[IS_AUTO_COMMIT_ENABLED] = value;
    }
    get autoCommit() {
        return this[IS_AUTO_COMMIT_ENABLED];
    }
    publish(event, expectedVersion) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const event of this[INTERNAL_EVENTS]) {
                yield this.publish(event, this[VERSION]++);
            }
            this[INTERNAL_EVENTS].length = 0;
        });
    }
    uncommit() {
        this[INTERNAL_EVENTS].length = 0;
    }
    getUncommittedEvents() {
        return this[INTERNAL_EVENTS];
    }
    loadFromHistory(history) {
        history.forEach(event => this.apply(event, true));
    }
    apply(event, isFromHistory = false) {
        if (!isFromHistory && !this.autoCommit) {
            this[INTERNAL_EVENTS].push(event);
        }
        this.autoCommit && this.publish(event, this[VERSION]++);
        const handler = this.getEventHandler(event);
        handler && handler.call(this, event);
    }
    getEventHandler(event) {
        const handler = `on${this.getEventName(event)}`;
        return this[handler];
    }
    getEventName(event) {
        const { constructor } = Object.getPrototypeOf(event);
        return constructor.name;
    }
}
exports.AggregateRoot = AggregateRoot;
_a = IS_AUTO_COMMIT_ENABLED, _b = INTERNAL_EVENTS, _c = VERSION;
