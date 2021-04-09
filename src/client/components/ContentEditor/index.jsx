import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { useAsyncEffect } from '@react-hook/async';

import { ReactCodeJar } from 'react-codejar';

import Prism from 'prismjs';

import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrism from 'rehype-prism';

window.Prism = { manual: true };

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypePrism, { preLangClass: true })
  .use(rehypeStringify);

const MODE = {
  EDIT: 'EDIT',
  VIEW: 'VIEW',
};

const MODE_BTN = [
  { value: MODE.VIEW, label: 'View' },
  { value: MODE.EDIT, label: 'Edit' },
];

const compileMd = async md => {
  if (!md) {
    return <></>;
  }
  const data = await processor.process(md);
  return (
    <div classNames="line-numbers"
      dangerouslySetInnerHTML={{
        __html: data.contents,
      }}
    ></div>
  );
};

const highlight = editor => {
  let code = editor.textContent;
  code = Prism.highlight(code, Prism.languages.markdown, 'markdown');
  editor.innerHTML = code;
};

const ContentEditor = ({ className }) => {
  const [mode, setMode] = useState(MODE.EDIT);
  const [markdownText, setMarkdownText] = useState('\n');
  const { status, value } = useAsyncEffect(() => {
    if (mode === MODE.EDIT) {
      return Promise.resolve(<></>);
    }
    return compileMd(markdownText);
  }, [mode]);

  const isEdit = mode === MODE.EDIT;
  return (
    <Card className={classNames(ContentEditor.name, className)} data-component-name={ContentEditor.name}>
      <Card.Header>
        <ButtonGroup toggle>
          {MODE_BTN.map(({ value, label }, idx) => (
            <ToggleButton
              key={idx}
              value={value}
              checked={value === mode}
              onChange={e => setMode(e.currentTarget.value)}
              type="radio"
              name="contentMode"
            >
              {label}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Card.Header>
      <Card.Body>
        {isEdit && (
          <ReactCodeJar
            code={markdownText} // Initial code value
            onUpdate={setMarkdownText} // Update the text
            highlight={highlight} // Highlight function, receive the editor
          />
        )}
        {!isEdit && status === 'success' && <div>{value}</div>}
      </Card.Body>
    </Card>
  );
};

ContentEditor.propTypes = {
  className: PropTypes.string,
};

export default ContentEditor;
