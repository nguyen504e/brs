import * as React from 'react'
import { CodeJar } from 'codejar'
import { getCaretOffset, setCurrentCursorPosition } from './caret'

export const useCodeJar = props => {
  const editorRef = React.useRef(null)
  const jar = React.useRef(null)
  const [cursorOffset, setCursorOffset] = React.useState(0)

  React.useEffect(() => {
    if (!editorRef.current) return

    jar.current = CodeJar(editorRef.current, props.highlight, props.options)

    jar.current.updateCode(props.code)

    jar.current.onUpdate(txt => {
      if (!editorRef.current) return

      setCursorOffset(getCaretOffset(editorRef.current))
      props.onUpdate(txt)
    })

    return () => jar.current.destroy()
  }, [])

  React.useEffect(() => {
    if (!jar.current || !editorRef.current) return
    jar.current.updateCode(props.code)
    setCurrentCursorPosition(editorRef.current, cursorOffset)
  }, [props.code])

  React.useEffect(() => {
    if (!jar.current || !props.options) return

    jar.current.updateOptions(props.options)
  }, [props.options])

  return editorRef
}

export const ReactCodeJar = props => {
  const editorRef = useCodeJar(props)

  return <div style={props.style} ref={editorRef}></div>
}
