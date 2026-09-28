import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';

export interface RunningContainer {
  url: string;
  stop: () => Promise<void>;
}

// Keep in step with the Postgres major version of the Supabase projects.
const POSTGRES_IMAGE = 'pgvector/pgvector:pg17';
const REDIS_IMAGE = 'redis:8';

/** Throwaway Postgres (with pgvector) for integration tests. */
export async function startPostgres(): Promise<RunningContainer> {
  const container = await new PostgreSqlContainer(POSTGRES_IMAGE).start();
  return {
    url: container.getConnectionUri(),
    stop: async () => {
      await container.stop();
    },
  };
}

/** Throwaway Redis for integration tests (queues, rate limits). */
export async function startRedis(): Promise<RunningContainer> {
  const container = await new RedisContainer(REDIS_IMAGE).start();
  return {
    url: container.getConnectionUrl(),
    stop: async () => {
      await container.stop();
    },
  };
}
