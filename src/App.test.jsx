import { render, screen } from './testutils';
import App from './App';

//for dumping render to file re https://stackoverflow.com/questions/62703526/can-you-print-write-the-result-of-screen-debug-to-a-file
import { prettyDOM} from '@testing-library/dom';
import fs from 'node:fs';

describe('App', () => {
  jest.setTimeout(10000);
  it('renders App component', async () => {
    render(<App/>);

    //testing that default routing is as we expect TODO Look for guidance on testing routing, this way feels bit iffy
    expect(global.window.document.title).toBe('Ratings Progress: ADM 188/5');
    expect(global.window.location.pathname).toBe('/ratings/5');
    const dropdown = await screen.findByLabelText('Piece');
    expect(dropdown.value).toBe("5");


    //await new Promise(resolve => setTimeout(resolve, 5000));
    //fs.writeFileSync('dump.html', prettyDOM(undefined, 999999, {highlight:false})); //undefined supposedly sets to root. The number is max chars to print. Re https://stackoverflow.com/questions/59763739/react-testing-library-some-portion-of-debugs-output-is-not-visible
  });
});
