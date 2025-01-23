import { atom } from 'recoil';

type user = {
  id: string;
  name: string;
};

type auth = {
  token: string;
};

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
    if (typeof window !== 'undefined') {
      const saveValue = localStorage.getItem(key);
      if (saveValue != null) {
        setSelf(JSON.parse(saveValue));
      }

      onSet((newValue: any, _: any, isRest: any) => {
        isRest
          ? localStorage.removeItem(key)
          : localStorage.setItem(key, JSON.stringify(newValue));
      });
    }
  };

const sessionStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
    if (typeof window !== 'undefined') {
      const saveValue = sessionStorage.getItem(key);
      if (saveValue != null) {
        setSelf(JSON.parse(saveValue));
      }

      onSet((newValue: any, _: any, isReset: any) => {
        isReset
          ? sessionStorage.removeItem(key)
          : sessionStorage.setItem(key, JSON.stringify(newValue));
      });
    }
  };

export const userState = atom<user>({
  key: 'userState',
  default: { name: '', id: '' },
  effects: [localStorageEffect('user')],
});

export const authState = atom<auth>({
  key: 'authState',
  default: { token: '' },
  effects: [sessionStorageEffect('session')],
});
