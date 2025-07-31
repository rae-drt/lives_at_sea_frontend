import { routeRender, screen, within } from './config/testutils';
import userEvent from '@testing-library/user-event';
import { cleanup, act, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import RatingsIndexNavigator from '@/ratingsindexnavigator';
import { describe, expect, it } from 'vitest';
import { Alert } from '@mui/material';

//Following tricks https://stackoverflow.com/a/72289488, http://pawelgoscicki.com/archives/2022/05/testing-usenavigate-navigate-from-react-router-v6/, https://mayashavin.com/articles/two-shades-of-mocking-vitest to spy on useParams
import * as router from 'react-router';

async function getComponents() {
  //These will fail if things cannot be found
  const dropdown = await screen.findByTestId('dropdown');
  return {
    dropdown:          dropdown,
    dropdownSelection: within(dropdown).getByRole('combobox'),
    forwardButton:     await screen.findByTestId('forwardButton'),
    backButton:        await screen.findByTestId('backButton'),
  }
}

//fromPiece + increment may not equal toPiece as there can be gaps in the series
function testFromTo(description, fromPiece, toPiece, increment) {
  if(increment === 0) throw Error();

  describe(description, () => {
    beforeEach(() => {
      checkPiece('' + fromPiece);
    });
    it('button', async () => { //tests navigation via buttons
      const button = increment > 0 ? forwardButton : backButton;
      const promises = [];
      for(let i = 0; i < Math.abs(increment); i++) promises.push(user.click(button));
      await(Promise.all(promises));
      checkPiece('' + toPiece); //awaiting the click seems to be enough for synchronization. Alternative if it ever fails:
                           //await(waitFor(()=>expect(dropdownSelection.value).toBe('6')));
    });
    it('keyboard', async () => { //tests navigation via combo
      await user.type(dropdownSelection, (fromPiece + increment) + '{Enter}');
      checkPiece('' + toPiece);
    });
    it('list', async () => { //Perhaps don't need this one, the above keyboard case already tests the combo
      await user.type(dropdownSelection, '{ArrowDown}'.repeat(fromPiece + increment - 5) + '{Enter}');
      checkPiece('' + toPiece);
    });
  });
}

//re https://testing-library.com/docs/dom-testing-library/api-async for the async functions
describe('RatingsIndexNavigator', () => {
  describe('happy path', () => {
    beforeEach(async ()=>{
      this.user = userEvent.setup();
      const paramSpy= vi.spyOn(router, 'useParams');
      routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/7');
      Object.assign(this, await getComponents());
      this.checkPiece = (expected) => {
        expect(dropdownSelection.value).toBe(expected);
        expect(paramSpy.mock.results.at(-1).type).toEqual('return');
        expect(paramSpy.mock.results.at(-1).value.piece).toEqual(expected);
      }
    });
    afterEach(() => {
      vi.resetAllMocks();
    });
    it('renders', async () => {
      checkPiece('7'); //redundant with pre-conditions of below tests, but keeps units self-contained
    });
    testFromTo('back one',    7,  6, -1);
    testFromTo('forward one', 7,  8,  1);
    testFromTo('leap',        7, 27, 20); //testing the buttons doesn't make sense for a leap, but it's harmless and easy
    it('tooltips', async () => { //seems tricky to test that the tooltips are not there when they should not be, but it is minor functionality, this will do
      await user.hover(backButton);
      expect(await screen.findByText('Back one piece')).toBeInTheDocument();
      await user.hover(forwardButton);
      expect(await screen.findByText('Forward one piece')).toBeInTheDocument();
      const forwardTip = await screen.getByText('Forward one piece');
    });
  });
  describe('invalid piece', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(()=>{}); //just to stop the console filling up with garbage
    });
    afterEach(() => {
      vi.resetAllMocks();
    });
    it('string', async () => {
      routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/fake');
      expect(await screen.findByText(/^No such piece: fake$/));
    });
    it('zero', async () => {
      routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/0');
      expect(await screen.findByText(/^No such piece: 0$/));
    });
    it('negative', async () => {
      routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/-1');
      expect(await screen.findByText(/^No such piece: -1$/));
    });
    it('noninteger', async () => {
      routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/3.141');
      expect(await screen.findByText(/^No such piece: 3.141$/));
    });
    it('path', async () => {
      routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/three/3');
      expect(await screen.findByText(/^Bad location: \/ratings\/three\/3$/));
    });
    it('deep path', async () => {
      routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/three/point/one/four/1');
      expect(await screen.findByText(/^Bad location: \.3.141$/));
    });
  });
  describe('low missing piece', () => {
    describe('error on render', () => {
      beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(()=>{}); //just to stop the console filling up with garbage
      });
      afterEach(() => {
        vi.resetAllMocks();
      });
      describe('url', () => {
        //TODO: Other bad inputs
        it('positive integer below minimum', async () => {
          //These really should be waiting to see the message in an exception
          //But I have spent several hours failing to expect an exception out of this thing
          //Perhaps in part the problem is that this component re-renders a couple of times as the queryStatus changes
          //So catching the text from the ErrorBoundary will have to do
          const user = userEvent.setup();

          routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/2');
          expect(await screen.findByText(/^No such piece: 2$/));
        });
      });
      describe('input cannot be too low', () => {
        beforeEach(() => {
          routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/5');
        });
        //TODO: Other bad inputs
        it('positive integer below minimum', async () => {
          const user = userEvent.setup();
          const { dropdownSelection } = await getComponents();
          await user.type(dropdownSelection, '2{Enter}');
          expect(dropdownSelection.value).toBe('12'); //restricted to values available in the dropdown
        });
      });
    });
    it('stop at minimum', async () => {
      const user = userEvent.setup();
      routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/5');
      const { dropdownSelection, backButton } = await getComponents();
      expect(dropdownSelection.value).toBe('5');
      expect(backButton).toBeDisabled();
    });
  });/*
  it('renders high missing piece', async() => {
    //A little testing around illegal piece number
    //This is really an undefined area, so this is very provisional
    const user = userEvent.setup();
    routeRender(<RatingsIndexNavigator/>, 'ratings/:piece', '/ratings/1100');
    const { dropdown, pieceBackwardArrow } = await getComponents();
    expectPieceNumber('1100', dropdown);

    //clicking forward takes us to the first legal piece
    await user.click(pieceBackwardArrow);
    expectPieceNumber('undefined', dropdown); //TODO: Arguably not what should happen, but does it matter?
  });
  it('renders first piece', async () => {
    const user = userEvent.setup();

    routeRender(<RatingsIndexNavigator/>, '/ratings/:piece', '/ratings/5');
    const { dropdown, pieceForwardArrow, pieceBackwardArrow } = await getComponents();

    expectPieceNumber('5', dropdown);

    await user.click(pieceForwardArrow);
    expectPieceNumber('6', dropdown);

    await user.click(pieceBackwardArrow);
    expectPieceNumber('5', dropdown);
  });*/
});
