import { createContext } from 'react';

const AppContext = createContext({ categories: [] as string[], cuisines: [] as string[], units: [] as string[] });

export default AppContext;
