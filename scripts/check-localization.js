const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'src/lib/i18n.ts');
const sourceText = fs.readFileSync(sourcePath, 'utf8');
const sourceFile = ts.createSourceFile(
  sourcePath,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
);
const entries = new Set();
function findDictionary(node) {
  if (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    node.name.text === 'hindi' &&
    node.initializer &&
    ts.isObjectLiteralExpression(node.initializer)
  ) {
    for (const property of node.initializer.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = ts.isStringLiteral(property.name)
        ? property.name.text
        : ts.isIdentifier(property.name)
          ? property.name.text
          : null;
      if (!key) continue;
      assert.equal(entries.has(key), false, `Duplicate Hindi translation key: ${key}`);
      entries.add(key);
    }
  }
  ts.forEachChild(node, findDictionary);
}
findDictionary(sourceFile);

const temp = fs.mkdtempSync(path.join(root, 'scripts', '.localization-check-'));
try {
  const transpiled = ts.transpileModule(sourceText, {
    fileName: sourcePath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const modulePath = path.join(temp, 'i18n.js');
  fs.writeFileSync(modulePath, transpiled.outputText);
  const { translate } = require(modulePath);
  assert.equal(translate('My Profile', 'hi'), 'मेरी प्रोफ़ाइल');
  assert.equal(translate('My Profile', 'en'), 'My Profile');
  assert.equal(translate('4 unread updates', 'hi'), '4 अपठित अपडेट');
  assert.equal(translate('English', 'hi'), 'English');
  assert.equal(translate('हिन्दी', 'hi'), 'हिन्दी');
  assert.equal(translate('Unmapped text', 'hi'), 'Unmapped text');
  console.log(`Localization checks passed: ${entries.size} Hindi strings and language fallback.`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
