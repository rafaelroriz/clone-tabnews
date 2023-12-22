const { version } = require("react");

test("GET to /api/v1/status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  const maxConenections = responseBody.dependencies.database.max_connections;
  expect(maxConenections).toEqual(100);

  const openedConnections =
    responseBody.dependencies.database.opened_connections;
  expect(typeof openedConnections).toBe("number");
  expect(openedConnections).toEqual(1);

  const max = maxConenections;
  const opened = openedConnections;
  expect(opened).toBeLessThanOrEqual(max);

  const version = responseBody.dependencies.database.version;
  expect(typeof version).toBe("string");
  expect(version).toEqual("16.0");
});
