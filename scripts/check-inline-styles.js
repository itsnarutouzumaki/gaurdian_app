const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const files = [path.join(root, 'App.tsx')];

function collectTsx(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectTsx(absolute);
    else if (entry.isFile() && entry.name.endsWith('.tsx')) files.push(absolute);
  }
}

collectTsx(path.join(root, 'src', 'screens'));
collectTsx(path.join(root, 'src', 'components'));

function isStaticExpression(node) {
  if (
    ts.isStringLiteral(node) ||
    ts.isNumericLiteral(node) ||
    node.kind === ts.SyntaxKind.TrueKeyword ||
    node.kind === ts.SyntaxKind.FalseKeyword ||
    node.kind === ts.SyntaxKind.NullKeyword ||
    ts.isNoSubstitutionTemplateLiteral(node)
  ) {
    return true;
  }
  if (ts.isParenthesizedExpression(node)) return isStaticExpression(node.expression);
  if (ts.isPrefixUnaryExpression(node)) {
    return isStaticExpression(node.operand);
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.every(isStaticExpression);
  }
  if (ts.isObjectLiteralExpression(node)) {
    return node.properties.every(
      (property) =>
        ts.isPropertyAssignment(property) &&
        isStaticExpression(property.initializer),
    );
  }
  if (ts.isPropertyAccessExpression(node)) {
    let rootExpression = node.expression;
    while (ts.isPropertyAccessExpression(rootExpression)) {
      rootExpression = rootExpression.expression;
    }
    return (
      ts.isIdentifier(rootExpression) &&
      ['C', 'R', 'S', 'styles', 'StyleSheet'].includes(rootExpression.text)
    );
  }
  return false;
}

function isStaticInlineStyle(node) {
  return (
    ts.isJsxAttribute(node) &&
    ts.isIdentifier(node.name) &&
    node.name.text === 'style' &&
    node.initializer &&
    ts.isJsxExpression(node.initializer) &&
    node.initializer.expression &&
    ts.isObjectLiteralExpression(node.initializer.expression) &&
    isStaticExpression(node.initializer.expression)
  );
}

const fixture = ts.createSourceFile(
  'style-check-fixture.tsx',
  '<View style={{ marginTop: 4 }} /><View style={{ height: size }} />',
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const fixtureStyles = [];
function collectFixtureStyles(node) {
  if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name) && node.name.text === 'style') {
    fixtureStyles.push(isStaticInlineStyle(node));
  }
  ts.forEachChild(node, collectFixtureStyles);
}
collectFixtureStyles(fixture);
if (fixtureStyles[0] !== true || fixtureStyles[1] !== false) {
  throw new Error('Inline style check self-test failed.');
}

const violations = [];
for (const file of files) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function visit(node) {
    if (isStaticInlineStyle(node)) {
      const location = source.getLineAndCharacterOfPosition(node.getStart(source));
      violations.push(
        `${path.relative(root, file)}:${location.line + 1}: static inline style object; move it to a StyleSheet`,
      );
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

if (violations.length) {
  console.error(violations.join('\n'));
  process.exit(1);
}

console.log(`Static inline style check passed for ${files.length} TSX files.`);
