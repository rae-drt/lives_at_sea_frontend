import { setupWorker } from 'msw/browser';
import { bypass, http, HttpResponse } from 'msw';

const TRACE = false;
const PERSON_MAP = new Map();
const PERSON_OVERRIDES = new Map();

const PIECE_OVERRIDES = new Map();
import piece_summary_5 from './piece_summary_5.js';
PIECE_OVERRIDES.set(5, piece_summary_5);

function getParam(url, param) {
  const searchParams = new URL(url).searchParams;
  if(searchParams.has(param)) {
    if(searchParams.getAll(param).length >= 1) {
      return searchParams.getAll(param).at(-1); //if multiple are given then we just get the last one
    }
  }
  return null;
}

function getNumericParam(url, param) {
  const text = getParam(url, param);
  if(text.match(/^\d+$/)) return Number(text);
  else                    return null;
}
 
export const handlers = [
  http.get(import.meta.env.VITE_API_ROOT + 'person/lastpost', ({request}) => { //emulate real server by returning from map if there
    const pid = getNumericParam(request.url, 'personid');
    if(TRACE) console.log('GET /person/lastpost', pid);
    if(pid === null) {
      return HttpResponse.json({message: 'Internal server error'}, {status: 502});
    }
    if(PERSON_MAP.has(pid)) {
      return HttpResponse.json(PERSON_MAP.get(pid));
    }
    else {
      return HttpResponse.text('Not found', {status: 404});
    }
  }),
  http.get(import.meta.env.VITE_API_ROOT + 'person', async ({request}) => { //override locally if local override exists. 
                                                                            //otherwise pass through to real server as a lastpost
                                                                            //call, then as a person call
    const pid = getNumericParam(request.url, 'personid');
    if(TRACE) console.log('GET /person', pid);
    if(pid === null)              return HttpResponse.json({message: 'Internal server error'}, {status: 502});
    if(PERSON_OVERRIDES.has(pid)) return HttpResponse.json(PERSON_OVERRIDES.get(pid));

    //no local override, pass through to server. Try lastpost first.
    const response = await fetch(bypass(import.meta.env.VITE_API_ROOT + 'person/lastpost?' + new URL(request.url).searchParams.toString()));
    if(response.status === 404)   return fetch(bypass(request)); //pass to real server's 'person'
    else                          return response;        //pass or fail, return what real server's 'lastpost' gave us

  }),
  http.post(import.meta.env.VITE_API_ROOT + 'person', async ({request}) => {
    if(TRACE) console.log('POST /person');
    const data = await request.json();
    PERSON_MAP.set(data.person.person_id, data);
    return HttpResponse.text('Hello, Lambda');
  }),
  http.get(import.meta.env.VITE_API_ROOT + 'status/piece_summary', async ({request}) => {
    if(TRACE) console.log('GET /status/piece_summary');
    const pieceNo = getNumericParam(request.url, 'piece_number');
    if(pieceNo === null) return HttpResponse.json({message: 'Internal server error'}, {status: 502});
    if(PIECE_OVERRIDES.has(pieceNo)) return HttpResponse.json(PIECE_OVERRIDES.get(pieceNo));
    else                             return await fetch(bypass(request));
  }),
];

export const worker = setupWorker(...handlers);

/* Something like this could be needed if I wanted to synthesise a legit piece
  const json = structuredClone(piece_summary_unknown);
  json.piece_ranges.this_piece.start_item = (piece - 1) * json.count + 1;
  json.piece_ranges.this_piece.end_item   =  piece      * json.count;
  json.piece_ranges.this_piece.next_piece = piece + 1;
  json.piece_ranges.this_piece.prev_piece = piece - 1;

  if(json.piece_ranges.prev_piece) {
    json.piece_ranges.prev_piece.start_item = (piece - 2) * json.count + 1;
    json.piece_ranges.prev_piece.end_item   = (piece - 1) * json.count;
    json.piece_ranges.prev_piece.prev_piece = piece - 2;
    json.piece_ranges.prev_piece.next_piece = piece;
  }

  if(json.piece_ranges.next_piece) {
    json.piece_ranges.next_piece.start_item =  piece      * json.count + 1;
    json.piece_ranges.next_piece.end_item   = (piece + 1) * json.count;
    json.piece_ranges.next_piece.prev_piece = piece;
    json.piece_ranges.next_piece.next_piece = piece + 2;
  }
*/
