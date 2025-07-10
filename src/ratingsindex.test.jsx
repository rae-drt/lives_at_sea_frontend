import { act, render, screen, within } from './testutils';
import userEvent from '@testing-library/user-event'
import RatingsIndex from './ratingsindex';
import App from './App';

test('RatingsIndex', async() => {
  const user = userEvent.setup()
  //console.log('p1', global.window.location.pathname);
  render(<App/>);
  //console.log('p2', global.window.location.pathname);

  const adm = await screen.findByText('ADM');
  //screen.debug(undefined, 99999); //after the first await. So I'm more confident that we are fully rendered.
  const series = await screen.findByText('188');
  const pieceBackward = await screen.findByAriaLabel('Back one piece');
  const pieceForward = await screen.findByAriaLabel('Forward one piece');
  const pieceForwardArrow = within(pieceForward).getByTestId('ArrowForwardIosIcon');
  const nextUnfinished = await screen.findByAriaLabel('Next un-cross-checked record');
  //console.log('before', pieceForward.constructor.name);
  /*
  user.click(pieceForwardArrow).then(() => {
    screen.findByLabelText('Piece').then((dropdown2)=>{
      console.log('then');
      screen.debug(dropdown2);
      expect(dropdown2.value).not.toBe('');
    }, ()=>{console.error('hmm')});
  });*/
  for(let i = 5; i < 1095; i++) {
    //handle missing pieces
    if      (i ===   83) i =   91;
    else if (i ===  245) i =  268;
    else if (i ===  428) i =  429;
    else if (i ===  512) i =  513;
    else if (i ===  560) i =  647;
    else if (i ===  835) i =  867;
    else if (i ===  972) i =  988;
    else if (i === 1012) i = 1018;
    else if (i === 1088) i = 1094;
    //console.log(' PREclick');
    const dropdown = await screen.findByLabelText('Piece'); //will fail if Piece cannot be found, even though it does not explicitly test anything -- means I do not have to do an explicit expect(...).toBeInTheDocumet() test.
    expect(dropdown.value).toBe('' + i);
    await user.click(pieceForwardArrow);
    //console.log('POSTclick');
    //console.log('p3', global.window.location.pathname);
  //screen.debug(undefined, 99999);
  //expect(dropdown.value).toBe("6");
  }
  await user.click(pieceForwardArrow);
  expect(dropdown.value).toBe("1094");
  //screen.debug(dropdown2.value);
  //screen.debug(dropdown2);
  //console.error(global.window.location.pathname);
  //expect(dropdown2.value).not.toBe("");
}, 75000);
