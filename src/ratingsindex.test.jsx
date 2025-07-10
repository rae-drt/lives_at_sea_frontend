import { act, render, screen, waitFor, within } from './testutils';
import userEvent from '@testing-library/user-event';
import { prettyDOM } from '@testing-library/dom';
import RatingsIndex from './ratingsindex';

//re https://testing-library.com/docs/dom-testing-library/api-async for the async functions
test('RatingsIndex', async() => {
  const user = userEvent.setup();
  render(<RatingsIndex/>, { route: '/ratings/:piece', initialEntry: '/ratings/5' });
  const adm = await screen.findByText('ADM');
  const series = await screen.findByText('188');
  const dropdown = await screen.findByLabelText('Piece'); //will fail if Piece cannot be found, even though it does not explicitly test anything -- means I do not have to do an explicit expect(...).toBeInTheDocumet() test.
  const pieceBackward = await screen.findByAriaLabel('Back one piece');
  const pieceForward = await screen.findByAriaLabel('Forward one piece');
  const pieceForwardArrow = within(pieceForward).getByTestId('ArrowForwardIosIcon');
  const nextUnfinished = await screen.findByAriaLabel('Next un-cross-checked record');
  expect(dropdown.value).toBe('5');
  await userEvent.click(pieceForwardArrow);
  expect(dropdown.value).toBe('6');
});
