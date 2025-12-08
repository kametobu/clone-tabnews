import database from "infra/database";
import { version } from "react";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersion = dbVersionResult.rows[0].server_version;
  const dbmaxConnectionsResult = await database.query("SHOW max_connections;");
  const dbMaxConnections = dbmaxConnectionsResult.rows[0].max_connections;
  const databaseName = process.env.POSTGRES_DB;
  const dbConnectedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const dbConnectedConnections = dbConnectedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion,
        max_connections: parseInt(dbMaxConnections),
        connected_connections: dbConnectedConnections,
      },
    },
  });
}

export default status;
