const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const types = fs.readFileSync(path.join(root, 'src/types.ts'), 'utf8');
const app = fs.readFileSync(path.join(root, 'App.tsx'), 'utf8');
const routeUnion = types.split('export type Route =')[0].match(/export type ScreenName =([\s\S]*?);/);
assert.ok(routeUnion, 'ScreenName union was not found.');
const routes = [...routeUnion[1].matchAll(/(['"])([A-Za-z]+)\1/g)].map(
  (match) => match[2],
);
const cases = new Set(
  [...app.matchAll(/case\s+(['"])([A-Za-z]+)\1\s*:/g)].map(
    (match) => match[2],
  ),
);
const missing = routes.filter(route => !cases.has(route));
assert.deepEqual(missing, [], `Screens missing from App.tsx renderer: ${missing.join(', ')}`);
for (const route of routes) {
  assert.ok(cases.has(route), `No App.tsx route for ${route}`);
}
const sourceFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (/\.tsx?$/.test(entry.name)) sourceFiles.push(absolute);
  }
}
sourceFiles.push(path.join(root, 'App.tsx'));
walk(path.join(root, 'src'));
const knownRoutes = new Set(routes);
const invalidCalls = [];
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/\b(?:navigate|replace|resetTo)\(\s*(['"])([A-Za-z]+)\1/g)) {
    if (!knownRoutes.has(match[2])) invalidCalls.push(`${path.relative(root, file)}: unknown route ${match[2]}`);
  }
}
assert.deepEqual(invalidCalls, [], `Unknown navigation destinations: ${invalidCalls.join(', ')}`);
console.log(`Route map check passed: ${routes.length} registered screens; literal navigation targets are valid.`);
