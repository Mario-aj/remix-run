const { readFile } = require('fs/promises');
const { join } = require('path');

const { error } = require('./constants');

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ['id', 'name', 'profession', 'age'],
};
class File {
  static async csvToJson(filePath) {
    const content = await this.getFileContent(filePath);

    const validate = this.isValid(content);

    if (!validate.valid) {
      throw Error(validate.error);
    }

    return content;
  }

  static async getFileContent(filePath) {
    const filename = join(__dirname, filePath);

    return (await readFile(filename)).toString('utf-8');
  }

  static isValid(csvString, options = DEFAULT_OPTIONS) {
    const [header, ...fileWithoutHeader] = csvString.split('\n');
    const isHeaderValid = header === options.fields.join(', ');

    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false,
      };
    }

    const isContentLengthAccepted =
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines;

    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false,
      };
    }

    return { valid: true };
  }
}

(async () => {
  const result = await File.csvToJson('../mocks/threeItems-valid.csv');
  // const result = await File.csvToJson('../mocks/invalid-header.csv');
  // const result = await File.csvToJson('../mocks/fourItems-invalid.csv');
  console.log(result);
})();
