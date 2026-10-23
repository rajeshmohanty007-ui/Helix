import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const mockRedis = {
  store: {},
  async get(key) {
    return this.store[key] || null;
  },
  async set(key, value, options) {
    this.store[key] = value;
    if (options && options.EX) {
      setTimeout(() => {
        delete this.store[key];
      }, options.EX * 1000);
    }
    return "OK";
  },
  async del(key) {
    delete this.store[key];
    return 1;
  },
};

if (typeof window === "undefined" && !globalThis.redisClient) {
  let hasLoggedWarning = false;
  const client = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries >= 2) {
          // Stop retrying to connect after 2 failed attempts
          return false;
        }
        return 1000; // Retry after 1 second
      }
    }
  });
  
  client.on("error", (err) => {
    if (!hasLoggedWarning) {
      console.warn("Could not connect to Redis. Running in resilient in-memory mock mode. Details:", err.message);
      hasLoggedWarning = true;
    }
  });

  client.connect()
    .then(() => {
      console.log("Redis connected successfully to:", redisUrl);
      globalThis.redisClient = client;
    })
    .catch((err) => {
      globalThis.redisClient = mockRedis;
    });
}

const redisClient = new Proxy({}, {
  get(target, prop) {
    const activeClient = globalThis.redisClient || mockRedis;
    const value = activeClient[prop];
    if (typeof value === "function") {
      return value.bind(activeClient);
    }
    return value;
  }
});

export { redisClient };
