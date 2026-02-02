export class MockPrismaClient {
    public event: MockEventDelegate;

    constructor() {
        this.event = new MockEventDelegate();
    }
}

class MockEventDelegate {
    private events: any[] = [];

    async findMany(args?: any) {
        if (args?.where?.status?.not === 'INACTIVE') {
          return this.events.filter(e => e.status !== 'INACTIVE');
        }
        return this.events;
    }

    async upsert(args: { where: any, create: any, update: any }) {
        const existingIndex = this.events.findIndex(e => e.originalUrl === args.where.originalUrl);
        
        if (existingIndex >= 0) {
            // Update
            const updated = { ...this.events[existingIndex], ...args.update, id: this.events[existingIndex].id };
            this.events[existingIndex] = updated;
            return updated;
        } else {
            // Create
            const created = { ...args.create, id: Math.random().toString(36).substr(2, 9) };
            this.events.push(created);
            return created;
        }
    }
}
