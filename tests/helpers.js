const fs = require('node:fs');
const vm = require('node:vm');

function createLocalStorage(entries = {}) {
  const storage = {};
  const methods = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(this, key) ? this[key] : null;
    },
    setItem(key, value) { this[String(key)] = String(value); },
    removeItem(key) { delete this[key]; },
    clear() { Object.keys(this).forEach(key => delete this[key]); },
    key(index) { return Object.keys(this)[index] ?? null; },
  };
  for (const [name, fn] of Object.entries(methods)) {
    Object.defineProperty(storage, name, { value: fn, enumerable: false });
  }
  Object.defineProperty(storage, 'length', {
    get() { return Object.keys(this).length; },
    enumerable: false,
  });
  Object.assign(storage, entries);
  return storage;
}

function loadBrowserModules(files, globals = {}) {
  const context = {
    console,
    Date,
    JSON,
    TextEncoder,
    btoa: value => Buffer.from(value, 'binary').toString('base64'),
    ...globals,
  };
  context.window = context;
  vm.createContext(context);
  for (const file of files) {
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  }
  return context;
}

function loadBrowserModule(file, globals = {}) {
  return loadBrowserModules([file], globals);
}

module.exports = { createLocalStorage, loadBrowserModule, loadBrowserModules };
