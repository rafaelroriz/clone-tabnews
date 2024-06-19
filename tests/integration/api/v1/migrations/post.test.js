import database from "infra/database";
import { join } from "node:path";
import fs from "fs";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("DROP schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations", async () => {
  const firstResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(firstResponse.status).toBe(201);
  const firstResponseBody = await firstResponse.json();
  expect(Array.isArray(firstResponseBody)).toBe(true);
  const migrationsQtd = await getMigrationsQtd();
  expect(firstResponseBody.length).toBe(migrationsQtd);

  // for (const migration of firstResponseBody) {
  //   expect(typeof migration.path).toBe("string");
  //   expect(migration.path).not.toBe(0);
  //   expect(typeof migration.name).toBe("string");
  //   expect(migration.name.length).not.toBe(0);
  //   expect(typeof migration.timestamp).toBe("number");
  //   const timestamp = new Date(migration.timestamp);
  //   expect(timestamp.getTime()).toBeGreaterThan(0);
  // }

  const secondResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );

  expect(secondResponse.status).toBe(200);
  const secondResponseBody = await secondResponse.json();
  expect(Array.isArray(secondResponseBody)).toBe(true);
  expect(secondResponseBody.length).toBe(0);
});

async function getMigrationsQtd() {
  return new Promise((resolve, reject) => {
    fs.readdir(join("infra", "migrations"), (err, files) => {
      resolve(files.length);
    });
  });
}
