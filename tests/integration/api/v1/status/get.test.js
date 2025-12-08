test("GET /api/v1/status returns 200 and status message", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
  const responseBody = await response.json();

  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toBe(parseUpdatedAt);

  expect(responseBody.dependencies.database).toBeDefined();
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(
    responseBody.dependencies.database.connected_connections,
  ).toBeDefined();

  expect(responseBody.dependencies.database.version).toEqual("16.0");
  expect(responseBody.dependencies.database.max_connections).toBeGreaterThan(0);
  expect(
    responseBody.dependencies.database.connected_connections,
  ).toBeGreaterThanOrEqual(1);
});
