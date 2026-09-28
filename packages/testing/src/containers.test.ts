import { Redis } from 'ioredis';
import postgres from 'postgres';
import { afterAll, describe, expect, it } from 'vitest';
import { startPostgres, startRedis, type RunningContainer } from './containers.js';

describe('startPostgres', () => {
  let pg: RunningContainer;

  afterAll(async () => {
    await pg.stop();
  });

  it('returns a connection URL for a database that accepts queries', async () => {
    pg = await startPostgres();
    const sql = postgres(pg.url);
    const [row] = await sql<{ ok: number }[]>`select 1 as ok`;
    await sql.end();
    expect(row?.ok).toBe(1);
  });

  it('has the pgvector extension available', async () => {
    const sql = postgres(pg.url);
    await sql`create extension if not exists vector`;
    const [row] = await sql<{ d: string }[]>`select '[1,2,3]'::vector <-> '[1,2,4]'::vector as d`;
    await sql.end();
    expect(Number(row?.d)).toBe(1);
  });
});

describe('startRedis', () => {
  let redis: RunningContainer;

  afterAll(async () => {
    await redis.stop();
  });

  it('returns a connection URL for a Redis that answers PING', async () => {
    redis = await startRedis();
    const client = new Redis(redis.url);
    const reply = await client.ping();
    client.disconnect();
    expect(reply).toBe('PONG');
  });
});
