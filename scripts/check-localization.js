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

const translatableAttributes = new Set([
  'title',
  'subtitle',
  'label',
  'placeholder',
  'message',
  'helper',
  'accessibilityLabel',
  'detail',
  'emptyMessage',
  'notice',
]);
const translatableProperties = new Set(translatableAttributes);
const untranslatedExamples = new Set(['name@example.com']);
const missingStrings = new Map();

function inspectSource(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const source = ts.createSourceFile(
    filePath,
    text,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  function collect(value, node) {
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (
      !normalized ||
      normalized.length < 2 ||
      /^[0-9\W]+$/.test(normalized) ||
      entries.has(normalized) ||
      untranslatedExamples.has(normalized)
    ) {
      return;
    }
    const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
    const locations = missingStrings.get(normalized) || [];
    locations.push(`${path.relative(root, filePath)}:${line}`);
    missingStrings.set(normalized, locations);
  }
  function visit(node) {
    if (ts.isJsxText(node)) collect(node.text, node);
    if (
      ts.isJsxAttribute(node) &&
      translatableAttributes.has(node.name.getText(source)) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    ) {
      collect(node.initializer.text, node.initializer);
    }
    if (
      ts.isPropertyAssignment(node) &&
      translatableProperties.has(node.name.getText(source)) &&
      ts.isStringLiteral(node.initializer)
    ) {
      collect(node.initializer.text, node.initializer);
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(source) === 'Alert.alert'
    ) {
      for (const argument of node.arguments.slice(0, 2)) {
        if (ts.isStringLiteral(argument)) collect(argument.text, argument);
      }
    }
    if (
      ts.isNewExpression(node) &&
      node.expression.getText(source) === 'Error' &&
      node.arguments?.[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      collect(node.arguments[0].text, node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

function inspectDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) inspectDirectory(filePath);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) inspectSource(filePath);
  }
}

inspectDirectory(path.join(root, 'src'));
inspectSource(path.join(root, 'App.tsx'));
const mockData = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/mock-data.json'), 'utf8'),
);
const optionsPath = path.join(root, 'src/data/screen-options.ts');
const optionsText = fs.readFileSync(optionsPath, 'utf8');
const optionsSource = ts.createSourceFile(
  optionsPath,
  optionsText,
  ts.ScriptTarget.Latest,
  true,
);
const localizedOptionArrays = new Set([
  'NOTIFICATION_FILTERS',
  'SCHOOL_DETAILS_TABS',
  'TEACHER_DIRECTORY_FILTERS',
  'TEACHER_PROFILE_TABS',
]);
const localizedOptions = [];
function inspectOptions(node) {
  if (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    localizedOptionArrays.has(node.name.text) &&
    node.initializer &&
    ts.isArrayLiteralExpression(node.initializer)
  ) {
    for (const element of node.initializer.elements) {
      if (ts.isStringLiteral(element)) localizedOptions.push(element.text);
    }
  }
  if (ts.isPropertyAssignment(node) && ['title', 'detail'].includes(node.name.getText(optionsSource))) {
    if (ts.isStringLiteral(node.initializer)) localizedOptions.push(node.initializer.text);
  }
  ts.forEachChild(node, inspectOptions);
}
inspectOptions(optionsSource);
const localizedMockContent = [
  ...localizedOptions,
  ...mockData.notifications.flatMap((notice) => [
    notice.title,
    notice.message,
    notice.dateLabel,
  ]),
  ...mockData.helpTopics.flatMap((topic) => [topic.title, topic.body]),
  ...mockData.termsSections.flatMap((section) => [section.title, section.body]),
  ...mockData.privacySections.flatMap((section) => [section.title, section.body]),
];
for (const value of localizedMockContent) {
  if (entries.has(value)) continue;
  const locations = missingStrings.get(value) || [];
  locations.push('src/data/mock-data.json');
  missingStrings.set(value, locations);
}
assert.equal(
  missingStrings.size,
  0,
  `Missing Hindi translations for static UI strings:\n${[...missingStrings]
    .map(([value, locations]) => `- ${JSON.stringify(value)} (${locations.join(', ')})`)
    .join('\n')}`,
);

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
  assert.equal(translate('2 unread notifications', 'hi'), '2 अपठित सूचनाएँ');
  assert.match(translate('A demo PDF was created at: file:///demo.pdf', 'hi'), /डेमो PDF/);
  assert.equal(translate('September 2026', 'hi'), 'सितंबर 2026');
  assert.equal(translate('English', 'hi'), 'अंग्रेज़ी');
  assert.equal(translate('हिन्दी', 'hi'), 'हिन्दी');
  assert.equal(translate('Unmapped text', 'hi'), 'Unmapped text');
  console.log(
    `Localization checks passed: ${entries.size} Hindi strings; all static UI strings have Hindi translations.`,
  );
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
