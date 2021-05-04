import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkPrism from 'remark-prism'
import remarkRehype from 'remark-rehype'
import unified from 'unified'

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkPrism, {
    transformInlineCode: true,
    plugins: ['command-line', 'data-uri-highlight', 'line-numbers'],
  })
  .use(remarkRehype)
  .use(rehypeStringify)

export const markdownProcess = v => markdownProcessor.process(v)
