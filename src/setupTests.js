// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// from https://remarkablemark.org/blog/2025/02/02/fix-jest-errors-in-react-router-7-upgrade/
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
