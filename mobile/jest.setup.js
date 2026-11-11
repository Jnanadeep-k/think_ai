require('@testing-library/react-native/extend-expect');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('expo-secure-store', () => {
  const values = new Map();
  return {
    getItemAsync: jest.fn(async key => values.get(key) ?? null),
    setItemAsync: jest.fn(async (key, value) => { values.set(key, value); }),
    deleteItemAsync: jest.fn(async key => { values.delete(key); }),
    __reset: () => values.clear(),
  };
});

/**
 * NetInfo is a native module with no Jest implementation, so it is mocked
 * globally. Tests drive connectivity through `src/utils/connectivity`'s
 * `__setOnlineForTests` seam, or by emitting here.
 */
jest.mock('@react-native-community/netinfo', () => {
  const listeners = new Set();
  const netInfo = {
    addEventListener: jest.fn((listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }),
    fetch: jest.fn(() =>
      Promise.resolve({ isConnected: true, isInternetReachable: true })
    ),
  };
  return {
    __esModule: true,
    default: netInfo,
    __emit: (state) => listeners.forEach((listener) => listener(state)),
    __reset: () => listeners.clear(),
  };
});

/**
 * Fake timers are enabled globally so `Animated` never ticks mid-assertion
 * (which would otherwise produce `act()` warnings) and debounce/300 ms search
 * windows can be advanced deterministically. `@testing-library/react-native`
 * detects fake timers and advances them inside `waitFor`, so async helpers keep
 * working.
 */
jest.useFakeTimers();

/**
 * Every test starts with empty storage and a restored online connection so the
 * offline cache/queue modules cannot leak state between cases (the mocked
 * AsyncStorage is a shared in-memory store for the whole file).
 */
beforeEach(async () => {
  require('expo-secure-store').__reset();
  const asyncStorageModule = require('@react-native-async-storage/async-storage');
  const asyncStorage = asyncStorageModule.default ?? asyncStorageModule;
  await asyncStorage.clear();
  require('./src/utils/connectivity').__resetConnectivityForTests();
});
