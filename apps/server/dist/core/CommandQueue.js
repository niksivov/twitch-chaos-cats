"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandQueue = void 0;
class CommandQueue {
    constructor() {
        this.commands = [];
    }
    enqueue(command) {
        this.commands.push(command);
    }
    drain() {
        const commands = [
            ...this.commands,
        ];
        this.commands = [];
        return commands;
    }
}
exports.CommandQueue = CommandQueue;
