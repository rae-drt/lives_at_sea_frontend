self.BroadcastChannel = require('worker_threads').BroadcastChannel;
import { BroadcastChannel } from 'node:worker_threads';
global.BroadcastChannel = BroadcastChannel;

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
//import '@testing-library/jest-dom';

//re https://github.com/socketio/socket.io/issues/5064#issuecomment-2217149231
//import { TransformStream } from 'node:stream/web';
//global.TransformStream = TransformStream;

/*
//const { ReadableStream } = require('node:util');
//global.ReadableStream = ReadableStream;
const { TextDecoder, TextEncoder } = require('node:util');
const { ReadableStream } = require('node:stream/web');
global.ReadableStream = ReadableStream;

//from https://remarkablemark.org/blog/2025/02/02/fix-jest-errors-in-react-router-7-upgrade/
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
*/
/*
module.exports = {
  testEnvironment: 'jest-fixed-jsdom',
}*/
//import { AbortSignal } from 'undici';
//global.AbortSignal = AbortSignal;
/*
// FixedHappyDomEnvironment.js
import HappyDomEnvironment from '@happy-dom/jest-environment';

// same as https://github.com/mswjs/jest-fixed-jsdom package does, but for happy-dom
export default class FixedHappyDomEnvironment extends HappyDomEnvironment {
  constructor(...args) {
    super(...args);

    this.global.TextDecoder = TextDecoder;
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoderStream = TextDecoderStream;
    this.global.TextEncoderStream = TextEncoderStream;
    this.global.ReadableStream = ReadableStream;

    this.global.Blob = Blob;
    this.global.Headers = Headers;
    this.global.FormData = FormData;
    this.global.Request = Request;
    this.global.Response = Response;
    this.global.fetch = fetch;
    this.global.structuredClone = structuredClone;
    this.global.URL = URL;
    this.global.URLSearchParams = URLSearchParams;

    this.global.BroadcastChannel = BroadcastChannel;
    this.global.TransformStream = TransformStream;
  }
}

module.exports = {
  testEnvironment: FixedHappyDomEnvironment
}
*/
