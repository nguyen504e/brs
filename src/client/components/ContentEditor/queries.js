import { gql } from '@apollo/client'

export const parseMarkdown = gql`
  query parseMarkdown($content: String!) {
    parseDocument(content: $content)
  }
`
