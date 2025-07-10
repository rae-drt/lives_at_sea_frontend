import { act, render, screen, within } from './testutils';
import userEvent from '@testing-library/user-event'
import RatingsIndex from './ratingsindex';

test('RatingsIndex', async() => {
  const user = userEvent.setup()
  render(<RatingsIndex/>);

  const adm = await screen.findByText('ADM');
  //screen.debug(undefined, 99999); //after the first await. So I'm more confident that we are fully rendered.
  const series = await screen.findByText('188');
  const dropdown = await screen.findByLabelText('Piece'); //will fail if Piece cannot be found, even though it does not explicitly test anything -- means I do not have to do an explicit expect(...).toBeInTheDocumet() test.
  const pieceBackward = await screen.findByAriaLabel('Back one piece');
  const pieceForward = await screen.findByAriaLabel('Forward one piece');
  const pieceForwardArrow = within(pieceForward).getByTestId('ArrowForwardIosIcon');
  const nextUnfinished = await screen.findByAriaLabel('Next un-cross-checked record');
  expect(dropdown.value).toBe("");
  //console.log(pieceForward.constructor.name);
  await user.click(pieceForwardArrow);
  //screen.debug(undefined, 99999);
  expect(dropdown.value).toBe("");
  const dropdown2 = await screen.findByLabelText('Piece'); //will fail if Piece cannot be found, even though it does not explicitly test anything -- means I do not have to do an explicit expect(...).toBeInTheDocumet() test.
  //screen.debug(dropdown2.value);
  screen.debug(dropdown);
  expect(dropdown2.value).not.toBe("")
});
