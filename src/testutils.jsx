// following https://testing-library.com/docs/react-testing-library/setup/#custom-render and
// https://testing-library.com/docs/react-testing-library/setup/#add-custom-queries
import { render, queries, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as customQueries from './testqueries';

import { setupServer } from 'msw/node';
import { handlers } from './testHandlers';

//re https://mswjs.io/docs/faq#why-do-i-get-stale-responses-with-react-queryswrapolloetc
import { QueryCache } from '@tanstack/react-query'

const queryCache = new QueryCache()
const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  queryCache.clear();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// redefine queries
const allQueries = {
  ...queries,
  ...customQueries,
}
const customScreen = { ...screen, ...within(document.body, allQueries) };
const customWithin = element => within(element, allQueries);

// render-with-providers
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

// redefine render
import { createRoutesStub } from 'react-router';
const customRender = (ui, {route = '/', initialEntry = '/', ...options} = {}) => {
  const allProviders = ({children}) => {
    const Stub = createRoutesStub([
    {
      path: route,
      Component: () => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    }]);
    return (
      <Stub initialEntries={[initialEntry]}/>
    );
  }

  return render(ui, {
    queries: allQueries,
    wrapper: allProviders,
    ...options,
  });
}

// re-export with overrides
export * from '@testing-library/react'
export { customScreen as screen, customWithin as within, customRender as render }
