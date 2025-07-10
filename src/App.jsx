import './App.css';
//import Person from './person';
//import OfficerIndex from './officerindex';
//import RatingsIndex from './ratingsindex';
//import SimpleEditor from './simpleeditor';
import LaSAppBar from './lasappbar';
import { routes } from './routes';
import { useEffect } from 'react';
//import { Routes, Route, Navigate} from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Stack } from '@mui/material';
import { DialogsProvider } from '@toolpad/core/useDialogs';

const queryClientOptions = import.meta.env.VITE_PERSIST_CACHE ?
  {
    defaultOptions: {
      queries: {
        gcTime: Infinity,
      },
    },
  }
  :
  {}
;

const queryClient = new QueryClient(queryClientOptions);

if(import.meta.env.VITE_BROADCAST_CACHE) {
  console.log("Enabled cache state broadcast (changes made in one tab will be broadcast to others)");
  broadcastQueryClient({
    queryClient,
    broadcastChannel: 'tna-l@s',
  });
}

function App() {
  useEffect(()=> {
    const preventUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', preventUnload);
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, []);
  const theme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: 18, //TODO: This really should be relative to (a bit bigger than) "base" font size
          }
        }
      }
    }
  });
  if(import.meta.env.VITE_PERSIST_CACHE) {
    console.log("Enabled cache state persistence (changes made will survive refresh)");
    return (
      <div className="App">
        <DialogsProvider>
          <ThemeProvider theme={theme}>
            <LaSAppBar/>
            <Stack sx={{paddingTop: '20px'}}>
              <PersistQueryClientProvider client={queryClient} persistOptions={{persister: createSyncStoragePersister({storage: window.localStorage})}}>
                <ReactQueryDevtools initialIsOpen={false} />
                {routes}
              </PersistQueryClientProvider>
            </Stack>
          </ThemeProvider>
        </DialogsProvider>
      </div>
    );
  }
  else {
    return (
      <div className="App">
        <DialogsProvider>
          <ThemeProvider theme={theme}>
            <LaSAppBar/>
            <Stack sx={{paddingTop: '20px'}}>
              <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                {routes}
              </QueryClientProvider>
            </Stack>
          </ThemeProvider>
        </DialogsProvider>
      </div>
    );
  }
}

export default App;
