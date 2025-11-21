import { createContext } from 'react';

export const LockedContext = createContext([true/* default -- fail safe by assuming locked */, null]);
