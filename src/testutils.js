// following https://testing-library.com/docs/react-testing-library/setup/#custom-render and
// https://testing-library.com/docs/react-testing-library/setup/#add-custom-queries
import { render, queries, within, screen } from '@testing-library/react'
import * as customQueries from './testqueries'

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
