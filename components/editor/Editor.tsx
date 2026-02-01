'use client';

import '@mdxeditor/editor/style.css';
import type { ForwardedRef } from 'react';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  ConditionalContents,
  toolbarPlugin,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  ListsToggle,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  linkDialogPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
} from '@mdxeditor/editor';
import { basicDark } from 'cm6-theme-basic-dark';
import { useTheme } from 'next-themes';

interface EditorProps {
  //   value: string;
  fieldChange: (value: string) => void;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
}

const Editor = ({ fieldChange, editorRef, ...props }: EditorProps & MDXEditorProps) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? [basicDark] : [];
  return (
    <MDXEditor
      key={resolvedTheme}
      className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full border"
      onChange={fieldChange}
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
        // codeBlockPlugin({
        //     defaultCodeBlockLanguage: 'txt',
        //     codeBlockEditorDescriptors: [
        //       {
        //         match: () => true,
        //         priority: 0,
        //         Editor: CodeMirrorEditor,
        //       },
        //     ],
        //   }),
        codeBlockPlugin({
          defaultCodeBlockLanguage: 'txt', // must be setup default value because it couldn't be empty
        }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: 'css',
            txt: 'txt',
            sql: 'sql',
            js: 'Javascript',
            typescript: 'typescript',
            python: 'python',
            java: 'java',
            cpp: 'cpp',
            csharp: 'csharp',
            php: 'php',
            html: 'html',
            bash: 'bash',
            json: 'json',
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        quotePlugin(),
        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === 'codeblock',
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <ListsToggle />
                      <CreateLink />
                      <InsertImage />
                      <InsertTable />
                      <InsertThematicBreak />
                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
};

export default Editor;
