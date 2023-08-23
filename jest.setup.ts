import 'reflect-metadata';

// TODO: implements self log service to remove console.error from production code
jest.spyOn(console, 'error').mockImplementation(jest.fn);
