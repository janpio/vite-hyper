import { Client } from 'pg';

export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "HYPERDRIVE" with the variable name you defined.
  HYPERDRIVE: Hyperdrive;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    console.log(JSON.stringify(env));
    // Create a database client that connects to your database via Hyperdrive
    // Hyperdrive generates a unique connection string you can pass to
    // supported drivers, including node-postgres, Postgres.js, and the many
    // ORMs and query builders that use these drivers.
    const client = new Client({
      host: env.HYPERDRIVE.host,
      user: env.HYPERDRIVE.user,
      password: env.HYPERDRIVE.password,
      port: Number(env.HYPERDRIVE.port),
      database: env.HYPERDRIVE.database,
    });

    try {
      // Connect to your database
      await client.connect();

      // Test query
      const result = await client.query({ text: 'SELECT * FROM pg_tables' });

      // Return result rows as JSON
      return Response.json({ result: result });
    } catch (e) {
      console.log(e);
      return Response.json({ error: JSON.stringify(e) }, { status: 500 });
    }
  },
};
