import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import remark from 'remark';
import recommended from 'remark-preset-lint-recommended';
import html from 'remark-html';
import { useAsyncEffect } from '@react-hook/async';

import { ReactCodeJar } from 'react-codejar';

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
  const data = await remark().use(recommended).use(html).process(md);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: data.contents,
      }}
    ></div>
  );
};

const highlight = editor => {
  let code = editor.textContent;
  code = code.replace(/\((\w+?)(\b)/g, '(<font color="#8a2be2">$1</font>$2');
  editor.innerHTML = code;
};

const ContentEditor = ({ className }) => {
  const [mode, setMode] = useState(MODE.EDIT);
  const [markdownText, setMarkdownText] = useState('');
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
            code={setMarkdownText} // Initial code value
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
