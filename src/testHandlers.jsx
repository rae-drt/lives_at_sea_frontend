import { http, HttpResponse } from 'msw';
import { readFile } from "fs/promises";

/*
const load = async (fileName: string) => {
    try {
      const yamlString = await readFile(`${__dirname}/${fileName}`, "utf8")
      */

 //`https://ofktct1tij.execute-api.eu-west-2.amazonaws.com/development/status/piece_summary?piece_number=5 
export const handlers = [
  http.get(process.env.REACT_APP_API_ROOT + 'status/piece_summary', ({request}) => {
    const url = new URL(request.url);
    const piece = url.searchParams.get('piece_number');
    import('./testdata/responses/piece_summary_' + piece + '.json', {with: {type: 'json'}}).then(
      (response)=>{
        console.warn('response: ', piece, response, response.piece_ranges);
        return HttpResponse.json(response);
      },
      (error) => {
        return HttpResponse.json({message: 'Internal server error'}, {status: 502});
      }
    );
  }),
  /*
  http.get(process.env.REACT_APP_API_ROOT + '/status/piece_summary?piece_number=6', () => {
    console.log('/ratings/6');
  }),
  http.get(process.env.REACT_APP_API_ROOT + '/status/piece_summary?piece_number=7', () => {
    console.log('/ratings/7');
  }),
  */
];
