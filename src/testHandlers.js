import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { readFile} from 'fs/promises';
 
export const handlers = [
  http.get(import.meta.env.VITE_API_ROOT + 'status/piece_summary', ({request}) => {
    const search_params = new URL(request.url).searchParams;
    if(search_params.has('piece_number')) {
      if(search_params.getAll('piece_number').length === 1) {
        const piece = search_params.get('piece_number');
        if(piece.match(/^\d+$/)) {
          try {
            return readFile('src/testdata/responses/piece_summary_' + piece + '.json').then(
              (jsonStr) => { return HttpResponse.json(JSON.parse(jsonStr)); }
            );
          }
          catch(e) {
            return readFile('src/testdata/responses/piece_summary_unknown_number.json').then(
              (jsonStr) => {
                const json = JSON.parse(jsonStr);
                json.piece_ranges.this_piece.start_item = (piece - 1) * json.count + 1;
                json.piece_ranges.this_piece.end_item   =  piece      * json.count;
                json.piece_ranges.this_piece.next_piece = piece + 1;
                json.piece_ranges.this_piece.prev_piece = piece - 1;

                json.piece_ranges.prev_piece.start_item = (piece - 2) * json.count + 1;
                json.piece_ranges.prev_piece.end_item   = (piece - 1) * json.count;
                json.piece_ranges.prev_piece.prev_piece = piece - 2;
                json.piece_ranges.prev_piece.next_piece = piece;

                json.piece_ranges.next_piece.start_item =  piece      * json.count + 1;
                json.piece_ranges.next_piece.end_item   = (piece + 1) * json.count;
                json.piece_ranges.next_piece.prev_piece = piece;
                json.piece_ranges.next_piece.next_piece = piece + 2;
                return HttpResponse.json(json);
              }
            );
          }
        }
        //else piece_number present but not a number -- do I need to test this case?
      }
      //else multiple piece_numbers -- do I actually need to test this case?
    }//else no piece number -- do I need to test this case?
    return HttpResponse.json({message: 'Internal server error'}, {status: 502});
    throw Error();
  }),
];
