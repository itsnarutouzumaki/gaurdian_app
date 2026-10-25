const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const sourceRoot = path.join(root, 'src');
const files = [path.join(root, 'App.tsx')];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (/\.tsx?$/.test(entry.name)) files.push(absolute);
  }
}
walk(sourceRoot);
const failures = [];
for (const file of files) {
  const result = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  for (const diagnostic of result.diagnostics || []) {
    if (diagnostic.category !== ts.DiagnosticCategory.Error) continue;
    const location = diagnostic.file && diagnostic.start !== undefined ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start) : null;
    const where = location ? `${path.relative(root, file)}:${location.line + 1}:${location.character + 1}` : path.relative(root, file);
    failures.push(`${where}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
// Resolve project-local imports and verify named imports against their exports.
function resolveLocal(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.json`, `${base}.js`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')];
  return candidates.find(candidate => fs.existsSync(candidate));
}
const sourceFiles = new Map(files.map(file => [path.resolve(file), ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)]));
function exportedNames(sourceFile) {
  const names = new Set();
  for (const node of sourceFile.statements) {
    const modifiers = node.modifiers || [];
    const isExported = modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
    const isDefault = modifiers.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword);
    if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isEnumDeclaration(node)) && isExported && node.name) names.add(node.name.text);
    if (ts.isVariableStatement(node) && isExported) for (const declaration of node.declarationList.declarations) if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
    if (ts.isExportAssignment(node)) names.add('default');
    if (isDefault) names.add('default');
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause) && !node.moduleSpecifier) {
      for (const element of node.exportClause.elements) names.add((element.name || element.propertyName).text);
    }
  }
  return names;
}
const exportCache = new Map();
function exportsFor(file) {
  if (!file || file.endsWith('.json')) return new Set(['default']);
  const absolute = path.resolve(file);
  if (!exportCache.has(absolute)) {
    const source = sourceFiles.get(absolute);
    exportCache.set(absolute, source ? exportedNames(source) : new Set());
  }
  return exportCache.get(absolute);
}
for (const file of files) {
  const sourceText = fs.readFileSync(file, 'utf8');
  const sourceAst = sourceFiles.get(path.resolve(file));
  for (const statement of sourceAst.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const specifier = statement.moduleSpecifier.text;
    if (!specifier.startsWith('./') && !specifier.startsWith('../')) continue;
    const target = resolveLocal(file, specifier);
    if (!target) { failures.push(`${path.relative(root, file)}: cannot resolve local import ${specifier}`); continue; }
    if (!statement.importClause || target.endsWith('.json')) continue;
    const names = exportsFor(target);
    if (statement.importClause.name && !names.has('default')) failures.push(`${path.relative(root, file)}: ${specifier} has no default export`);
    const bindings = statement.importClause.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) {
        if (element.isTypeOnly && target.endsWith('.json')) continue;
        const imported = (element.propertyName || element.name).text;
        if (!names.has(imported)) failures.push(`${path.relative(root, file)}: ${specifier} does not export ${imported}`);
      }
    }
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Source syntax and local imports passed for ${files.length} TypeScript files.`);
