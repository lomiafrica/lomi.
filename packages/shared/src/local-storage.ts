type BrowserStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

type BrowserGlobal = {
  window?: {
    localStorage?: BrowserStorage;
  };
};

function browserLocalStorage(): BrowserStorage | null {
  // SAFETY: localStorage lives on window; optional chaining is the browser host boundary.
  const candidate = globalThis as BrowserGlobal;
  return candidate.window?.localStorage ?? null;
}

export const getLocalStorageItem = (key: string): string | null => {
  const storage = browserLocalStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage`, error);
    return null;
  }
};

export const setLocalStorageItem = (key: string, value: string): void => {
  const storage = browserLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage`, error);
  }
};

export const removeLocalStorageItem = (key: string): void => {
  const storage = browserLocalStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage`, error);
  }
};
