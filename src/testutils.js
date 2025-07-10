// following https://testing-library.com/docs/react-testing-library/setup/#custom-render and
// https://testing-library.com/docs/react-testing-library/setup/#add-custom-queries
import { render, queries, within, screen } from '@testing-library/react'
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

/*
const server = setupServer(
  http.get('/user', () => {
    return HttpResponse.json({
      id: '15d42a4d-1948-4de4-ba78-b8a893feaf45',
      firstName: 'John',
    })
  })
)
*/
// redefine queries
const allQueries = {
  ...queries,
  ...customQueries,
}
const customScreen = { ...screen, ...within(document.body, allQueries) };
const customWithin = element => within(element, allQueries);


// render-with-providers
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
const allProviders = ({children}) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
}


// redefine render
const customRender = (ui, options) => 
  render(ui, {
    queries: allQueries,
    wrapper: allProviders,
    ...options
  });

// re-export with overrides
export * from '@testing-library/react'
export { customScreen as screen, customWithin as within, customRender as render }
