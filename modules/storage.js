// Profile-aware persistence boundary. This module deliberately has no DOM
// dependency so migrations, isolation, and backups can be tested independently.
window.Storage = (function () {
  const CUR = 'fr_current_user_v2';
  const USERS = 'fr_users_v2';
  const NS_MIGRATION = 'fr_user_namespace_v3';

  function encodeUser(name) {
    const bytes = new TextEncoder().encode(String(name || ''));
    let binary = '';
    bytes.forEach(b => { binary += String.fromCharCode(b); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
  function userPrefix(name) { return `fr_u_v3.${encodeUser(name)}.`; }
  function legacyUserPrefix(name) { return `fr_u_${name}_`; }

  function getCurrentUser() { return localStorage.getItem(CUR) || ''; }
  function setCurrentUser(name) {
    if (name) localStorage.setItem(CUR, name);
    else localStorage.removeItem(CUR);
  }
  function listUsers() {
    try {
      const value = JSON.parse(localStorage.getItem(USERS));
      return Array.isArray(value) ? value.filter(name => typeof name === 'string') : [];
    } catch { return []; }
  }
  function saveUsers(list) { localStorage.setItem(USERS, JSON.stringify(list)); }
  function addUser(name) {
    const users = listUsers();
    if (!users.includes(name)) { users.push(name); saveUsers(users); }
  }
  function removeUser(name) {
    saveUsers(listUsers().filter(x => x !== name));
    const prefix = userPrefix(name);
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(prefix)) localStorage.removeItem(k);
    });
    if (getCurrentUser() === name) setCurrentUser('');
  }
  function prefixedKey(key) {
    const user = getCurrentUser();
    return user ? userPrefix(user) + key : `fr_anon_${key}`;
  }
  function getItem(key) { return localStorage.getItem(prefixedKey(key)); }
  function setItem(key, value) { localStorage.setItem(prefixedKey(key), value); }
  function removeItem(key) { localStorage.removeItem(prefixedKey(key)); }
  function resetCurrentUserProgress() {
    const user = getCurrentUser();
    if (!user) return;
    const prefix = userPrefix(user);
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(prefix)) localStorage.removeItem(k);
    });
  }

  function exportData() {
    const user = getCurrentUser();
    if (!user) return null;
    const prefix = userPrefix(user);
    const data = {};
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(prefix)) data[k.slice(prefix.length)] = localStorage.getItem(k);
    });
    return { app: 'bonjour-frenchclb6', version: 2, user, exportedAt: new Date().toISOString(), data };
  }
  function importData(obj) {
    if (!obj || obj.app !== 'bonjour-frenchclb6' || !obj.data || typeof obj.data !== 'object' || Array.isArray(obj.data)) return -1;
    const user = getCurrentUser();
    if (!user) return -1;
    const entries = Object.entries(obj.data).filter(([suffix, value]) =>
      typeof value === 'string' && suffix.length > 0 && suffix.length <= 128 && !/[\u0000-\u001f]/.test(suffix)
    );
    const prefix = userPrefix(user);
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(prefix)) localStorage.removeItem(k);
    });
    let count = 0;
    for (const [suffix, value] of entries) {
      try { localStorage.setItem(prefix + suffix, value); count++; } catch { break; }
    }
    return count;
  }

  function migrateUserNamespaces() {
    if (localStorage.getItem(NS_MIGRATION) === '1') return;
    const users = listUsers().slice().sort((a, b) => b.length - a.length);
    const oldKeys = Object.keys(localStorage).filter(k => k.startsWith('fr_u_') && !k.startsWith('fr_u_v3.'));
    for (const key of oldKeys) {
      const owner = users.find(name => key.startsWith(legacyUserPrefix(name)));
      if (!owner) continue;
      const suffix = key.slice(legacyUserPrefix(owner).length);
      const next = userPrefix(owner) + suffix;
      try {
        if (localStorage.getItem(next) === null) localStorage.setItem(next, localStorage.getItem(key));
        localStorage.removeItem(key);
      } catch { return; }
    }
    localStorage.setItem(NS_MIGRATION, '1');
  }

  function migrateLegacy() {
    migrateUserNamespaces();
    if (localStorage.getItem('fr_migrated_v2') === '1') return;
    const legacyKeys = ['fr_app_state_v1', 'fr_srs_v1', 'fr_mistakes_v1'];
    const draftKeys = Object.keys(localStorage).filter(k => k.startsWith('fr_draft_'));
    const hasLegacy = legacyKeys.some(k => localStorage.getItem(k)) || draftKeys.length > 0;
    if (hasLegacy) {
      addUser('Guest');
      setCurrentUser('Guest');
      const remap = {
        fr_app_state_v1: 'state',
        fr_srs_v1: 'srs',
        fr_mistakes_v1: 'mistakes',
      };
      for (const [oldKey, newKey] of Object.entries(remap)) {
        const value = localStorage.getItem(oldKey);
        if (value) {
          localStorage.setItem(userPrefix('Guest') + newKey, value);
          localStorage.removeItem(oldKey);
        }
      }
      for (const draftKey of draftKeys) {
        const value = localStorage.getItem(draftKey);
        const newKey = draftKey.replace(/^fr_draft_/, 'draft_');
        localStorage.setItem(userPrefix('Guest') + newKey, value);
        localStorage.removeItem(draftKey);
      }
    }
    localStorage.setItem('fr_migrated_v2', '1');
  }

  return {
    getCurrentUser, setCurrentUser,
    listUsers, addUser, removeUser,
    getItem, setItem, removeItem,
    resetCurrentUserProgress,
    exportData, importData,
    migrateLegacy,
  };
})();
