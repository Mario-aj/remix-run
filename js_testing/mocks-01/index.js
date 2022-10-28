const { rejects, deepStrictEqual } = require('assert');

const File = require('./src/file');
const { error } = require('./src/constants');

(async () => {
  {
    const filePath = './mocks/emptyFile-invalid.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);

    await rejects(result, rejection);
  }
  {
    const filePath = './mocks/fourItems-invalid.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);

    await rejects(result, rejection);
  }
  {
    const filePath = './mocks/threeItems-valid.csv';
    const result = await File.csvToJson(filePath);

    const expected = [
      {
        id: 1,
        name: 'Mario Jorge',
        profession: 'Javascript developer',
        age: 24,
      },
      {
        id: 2,
        name: 'Elineth Tavares',
        profession: 'Advogada',
        age: 26,
      },
      {
        id: 3,
        name: 'Fernando Maria',
        profession: 'Design',
        age: 21,
      },
    ];

    deepStrictEqual(result, expected);
  }
})();
