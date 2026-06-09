import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || '';

interface ConnectionState {
  isConnected: boolean;
  isMock: boolean;
}

const connection: ConnectionState = {
  isConnected: false,
  isMock: false,
};

// Local JSON DB file path for mock database
const MOCK_DB_DIR = path.join(process.cwd(), '.mockdb');
const MOCK_DB_FILE = path.join(MOCK_DB_DIR, 'db.json');

// Initialize Mock DB file if not exists
function initMockDb() {
  if (!fs.existsSync(MOCK_DB_DIR)) {
    fs.mkdirSync(MOCK_DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(MOCK_DB_FILE)) {
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify({
      users: [],
      analyses: [],
      roadmaps: [],
      careers: [],
      internships: []
    }, null, 2));
  }
}

// Helper to read Mock DB
export function readMockDb() {
  initMockDb();
  try {
    const data = fs.readFileSync(MOCK_DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mock database, resetting...', error);
    const emptyDb = { users: [], analyses: [], roadmaps: [], careers: [], internships: [] };
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(emptyDb, null, 2));
    return emptyDb;
  }
}

// Helper to write Mock DB
export function writeMockDb(data: any) {
  initMockDb();
  fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(data, null, 2));
}

// Connect to Database (real or mock)
export async function connectToDatabase() {
  if (connection.isConnected) {
    return connection;
  }

  if (!MONGODB_URI) {
    console.warn('⚠️ No MONGODB_URI provided in environment. Running in LOCAL MOCK DATABASE mode.');
    connection.isConnected = true;
    connection.isMock = true;
    initMockDb();
    return connection;
  }

  try {
    // Attempt connecting to live MongoDB with 5s timeout
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    connection.isConnected = db.connections[0].readyState === 1;
    connection.isMock = false;
    console.log('🚀 Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection failed. Falling back to LOCAL MOCK DATABASE mode.', error);
    connection.isConnected = true;
    connection.isMock = true;
    initMockDb();
  }

  return connection;
}

// Generic Mock Model to mirror Mongoose API
export class MockModel<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private getCollection(): any[] {
    const db = readMockDb();
    return db[this.collectionName] || [];
  }

  private saveCollection(data: any[]) {
    const db = readMockDb();
    db[this.collectionName] = data;
    writeMockDb(db);
  }

  async find(query: any = {}): Promise<T[]> {
    let items = this.getCollection();
    return items.filter(item => {
      for (const key in query) {
        if (query[key] !== undefined) {
          // Check for object matching or primitive matching
          if (typeof query[key] === 'object' && query[key] !== null) {
            // Handle simple array inclusion (like { tags: "Python" } or { tags: { $in: [...] } })
            if (Array.isArray(item[key])) {
              if (query[key].$in) {
                const intersect = item[key].filter((v: any) => query[key].$in.includes(v));
                if (intersect.length === 0) return false;
              } else if (!item[key].includes(query[key])) {
                return false;
              }
            }
          } else if (item[key] !== query[key]) {
            return false;
          }
        }
      }
      return true;
    }) as T[];
  }

  async findOne(query: any = {}): Promise<T | null> {
    const results = await this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  async findById(id: string): Promise<T | null> {
    return this.findOne({ _id: id });
  }

  async create(doc: any): Promise<T> {
    const newDoc = {
      _id: doc._id || new mongoose.Types.ObjectId().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    const items = this.getCollection();
    items.push(newDoc);
    this.saveCollection(items);
    return newDoc as T;
  }

  async findByIdAndUpdate(id: string, update: any, options: any = {}): Promise<T | null> {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  async findOneAndUpdate(query: any, update: any, options: any = {}): Promise<T | null> {
    const items = this.getCollection();
    const index = items.findIndex(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });

    if (index === -1) {
      if (options.upsert) {
        const newDoc = await this.create({ ...query, ...(update.$set || update) });
        return newDoc;
      }
      return null;
    }

    const currentItem = items[index];
    const updatePayload = update.$set || update;
    
    // Perform field merges
    const updatedItem = {
      ...currentItem,
      ...updatePayload,
      updatedAt: new Date().toISOString()
    };

    // Special handling for sub-objects like user.skills or roadmap.phases
    for (const key in updatePayload) {
      if (typeof updatePayload[key] === 'object' && updatePayload[key] !== null && !Array.isArray(updatePayload[key])) {
        updatedItem[key] = {
          ...currentItem[key],
          ...updatePayload[key]
        };
      }
    }

    items[index] = updatedItem;
    this.saveCollection(items);
    return updatedItem as T;
  }

  async deleteOne(query: any): Promise<{ deletedCount: number }> {
    const items = this.getCollection();
    const initialLength = items.length;
    const remaining = items.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return true;
      }
      return false;
    });
    this.saveCollection(remaining);
    return { deletedCount: initialLength - remaining.length };
  }
}

// Wrapper function to expose the correct DB access layer
export function getModel<T>(modelName: string, mongooseModel: mongoose.Model<any>): any {
  const collectionMap: { [key: string]: string } = {
    User: 'users',
    Analysis: 'analyses',
    Roadmap: 'roadmaps',
    Career: 'careers',
    Internship: 'internships'
  };
  const collectionKey = collectionMap[modelName] || `${modelName.toLowerCase()}s`;

  // Use a Proxy to dynamically check connection.isMock at query time, 
  // rather than locking in the decision at module import time!
  return new Proxy({}, {
    get(target, prop) {
      if (connection.isMock || !MONGODB_URI) {
        const mockModel = new MockModel<T>(collectionKey);
        const value = (mockModel as any)[prop];
        return typeof value === 'function' ? value.bind(mockModel) : value;
      }
      const value = (mongooseModel as any)[prop];
      return typeof value === 'function' ? value.bind(mongooseModel) : value;
    }
  });
}
