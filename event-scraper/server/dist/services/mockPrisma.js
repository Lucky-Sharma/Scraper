"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPrismaClient = void 0;
class MockPrismaClient {
    constructor() {
        this.event = new MockEventDelegate();
    }
}
exports.MockPrismaClient = MockPrismaClient;
class MockEventDelegate {
    constructor() {
        this.events = [];
    }
    async findMany(args) {
        if (args?.where?.status?.not === 'INACTIVE') {
            return this.events.filter(e => e.status !== 'INACTIVE');
        }
        return this.events;
    }
    async upsert(args) {
        const existingIndex = this.events.findIndex(e => e.originalUrl === args.where.originalUrl);
        if (existingIndex >= 0) {
            // Update
            const updated = { ...this.events[existingIndex], ...args.update, id: this.events[existingIndex].id };
            this.events[existingIndex] = updated;
            return updated;
        }
        else {
            // Create
            const created = { ...args.create, id: Math.random().toString(36).substr(2, 9) };
            this.events.push(created);
            return created;
        }
    }
}
