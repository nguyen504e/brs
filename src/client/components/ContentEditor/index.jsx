import { useLazyQuery } from '@apollo/client'
import clsx from 'clsx'
import Prism from 'prismjs'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import ToggleButton from 'react-bootstrap/ToggleButton'
import { ReactCodeJar } from 'react-codejar'

import { parseMarkdown } from './queries'

window.Prism = { manual: true }

const MODE = {
  EDIT: 'EDIT',
  VIEW: 'VIEW',
}

const highlight = editor => {
  let code = editor.textContent
  code = Prism.highlight(code, Prism.languages.markdown, 'markdown')
  editor.innerHTML = code
}

const ContentEditor = ({ className, labels }) => {
  const [mode, setMode] = useState(MODE.EDIT)
  const [markdownText, setMarkdownText] = useState('\n')
  const [parsedMd, { data: documentContent, error, loading }] = useLazyQuery(parseMarkdown)

  const isEdit = mode === MODE.EDIT
  return (
    <Card className={clsx(ContentEditor.name, className)} data-component-name={ContentEditor.name}>
      <Card.Header>
        <ButtonGroup toggle>
          <ToggleButton
            key="edit-btn"
            value={MODE.EDIT}
            checked={mode === MODE.EDIT}
            onChange={e => setMode(e.currentTarget.value)}
            type="radio"
            name="contentMode"
          >
            {labels.editBtn}
          </ToggleButton>
          <ToggleButton
            key="edit-btn"
            value={MODE.VIEW}
            checked={mode === MODE.VIEW}
            onChange={e => {
              setMode(e.currentTarget.value)
              parsedMd({
                variables: {
                  content: markdownText,
                },
              })
            }}
            type="radio"
            name="contentMode"
          >
            {labels.viewBtn}
          </ToggleButton>
        </ButtonGroup>
      </Card.Header>
      <Card.Body>
        {isEdit && <ReactCodeJar code={markdownText} onUpdate={setMarkdownText} highlight={highlight} />}
        {!isEdit && !error && !loading && (
          <div
            dangerouslySetInnerHTMLL={{
              __html: documentContent,
            }}
          ></div>
        )}
      </Card.Body>
    </Card>
  )
}

ContentEditor.propTypes = {
  className: PropTypes.string,
  labels: PropTypes.objectOf({
    editBtn: PropTypes.string,
    viewBtn: PropTypes.string,
  }),
}

ContentEditor.defaultProps = {
  labels: {
    editBtn: 'Edit',
    viewBtn: 'View',
  },
}

export default ContentEditor
