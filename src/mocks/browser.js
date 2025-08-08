import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';
//import { readFile } from 'node:fs/promises';
//import { server } from '@vitest/browser/context';

//const { readFile } = server.commands;

import piece_summary_5 from './piece_summary_5.js';
import piece_summary_unknown from './piece_summary_unknown_number.js';
//const piece_summary_5 = require('./piece_summary_5.json');
 
export const handlers = [
  http.get(import.meta.env.VITE_API_ROOT + 'status/piece_summary', ({request}) => {
console.log('MKOCKING: ' + request.url);
    //return HttpResponse.json(piece_summary_5);
    const search_params = new URL(request.url).searchParams;
    if(search_params.has('piece_number')) {
      if(search_params.getAll('piece_number').length >= 1) {
        const piece = search_params.getAll('piece_number').at(-1); //if multiple piece numbers are given then we just get the last one
        if(piece.match(/^5$/)) {
          console.log(piece_summary_5);
          return HttpResponse.json(piece_summary_5);
        }
        else {
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
          console.log(json);
          return HttpResponse.json(json);
        }
        //else piece_number present but not a legal piece number, or perhaps we returned an empty list
        //     Either way, can fall through to the internal server error
      }
    }//else no piece number, fall through to the internal server error
    //This is what I get from curl. Depending on server configuration, we might get a CORS error instead.
    return HttpResponse.json({message: 'Internal server error'}, {status: 502});
  }),
];

export const worker = setupWorker(...handlers);
