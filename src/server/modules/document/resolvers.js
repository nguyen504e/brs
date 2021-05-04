import { markdownProcess } from './adaptor';

export default {
  Query: {
    parseDocument: (src, { content = '' }) => markdownProcess(content),
  },
};
