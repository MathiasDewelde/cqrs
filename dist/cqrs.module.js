"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const command_bus_1 = require("./command-bus");
const event_bus_1 = require("./event-bus");
const event_publisher_1 = require("./event-publisher");
const query_bus_1 = require("./query-bus");
const explorer_service_1 = require("./services/explorer.service");
let CqrsModule = class CqrsModule {
    constructor(explorerService, eventsBus, commandsBus, queryBus) {
        this.explorerService = explorerService;
        this.eventsBus = eventsBus;
        this.commandsBus = commandsBus;
        this.queryBus = queryBus;
    }
    onModuleInit() {
        const { events, queries, sagas, commands } = this.explorerService.explore();
        this.eventsBus.register(events);
        this.commandsBus.register(commands);
        this.queryBus.register(queries);
        this.eventsBus.registerSagas(sagas);
    }
};
CqrsModule = __decorate([
    common_1.Module({
        providers: [command_bus_1.CommandBus, query_bus_1.QueryBus, event_bus_1.EventBus, event_publisher_1.EventPublisher, explorer_service_1.ExplorerService],
        exports: [command_bus_1.CommandBus, query_bus_1.QueryBus, event_bus_1.EventBus, event_publisher_1.EventPublisher],
    }),
    __metadata("design:paramtypes", [explorer_service_1.ExplorerService,
        event_bus_1.EventBus,
        command_bus_1.CommandBus,
        query_bus_1.QueryBus])
], CqrsModule);
exports.CqrsModule = CqrsModule;
