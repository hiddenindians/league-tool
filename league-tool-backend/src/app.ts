// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import * as dotenv from 'dotenv'
dotenv.config()
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

import { configurationValidator } from './configuration'
import type { Application } from './declarations'
import { logError } from './hooks/log-error'
import { mongodb } from './mongodb'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'
import ratelimit from 'koa-ratelimit'
import {LRUCache} from 'lru-cache'

let Redis: any;

let authRateLimit: any;

(async () => {
  let rateLimitStore: any;
  let driver: 'redis' | 'memory' = 'memory';

  try {
    if (process.env.NODE_ENV === 'production') {
      Redis = await import('ioredis').then(m => m.default);
      const redis = new Redis({ host: 'redis', port: 6379, connectTimeout: 1000 });
      await redis.ping();
      rateLimitStore = redis;
      driver = 'redis';
      console.log('[RateLimit] Using Redis backend');
    } else {
      throw new Error('Skip Redis in development');
    }
  } catch (err) {
    rateLimitStore = new LRUCache({ max: 500, ttl: 15 * 60 * 1000 });
    console.warn('[RateLimit] Redis not available — falling back to in-memory store');
  }

  authRateLimit = ratelimit({
    driver,
    db: rateLimitStore,
    duration: 15 * 60 * 1000,
    errorMessage: 'Too many requests, please try again later.',
    id: (ctx: any) => ctx.ip,
    max: 5,
    whitelist: () => false,
    blacklist: () => false
  });
})();

// General rate limit config

const app: Application = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))


// Set up Koa middleware
app.use(cors())
app.use(async (ctx, next) => {
  if (ctx.path === '/auth-management' || (ctx.path === '/users' && ctx.method === 'POST')) {
    if (authRateLimit) {
      return authRateLimit(ctx, next);
    }
  }
  return next();
})
//app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())
// Configure services and transports
app.configure(rest())
app.configure(
  socketio({
    cors: {
     origin: app.get('origins')
    // origin: "http://localhost:4200"
    }
  })
)
app.configure(mongodb)
app.configure(authentication)
app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
