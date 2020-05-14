import React, { FC, useState } from 'react';
import ReactMde from 'react-mde';
import { Button, Input } from 'antd';
import 'react-mde/lib/styles/css/react-mde-all.css';
import showdown from 'showdown';
import { CreatePostInput } from 'src/API';

interface IWritePostProps {
  onSubmit: (post: CreatePostInput) => void;
}

const markdownConverter = new showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

const WritePost: FC<IWritePostProps> = ({ onSubmit }) => {
  const [post, queuePostUpdate] = useState<CreatePostInput>({
    title: '',
    content: ''
  });

  const submit = () => {
    queuePostUpdate(newPost => {
      onSubmit(newPost);
      return newPost;
    });
  }

  const onContentChange = (content: string) => {
    queuePostUpdate(oldPost => ({
      ...oldPost,
      content
    }));
  }

  const onTitleChange = (title: string) => {
    queuePostUpdate(oldPost => ({
      ...oldPost,
      title
    }));
  }

  const generateMarkdownPreview = (markdown: string) => {
    return Promise.resolve(markdownConverter.makeHtml(markdown));
  }

  return (
    <div>
      <Input onChange={event => onTitleChange(event.target.value)} />

      <ReactMde
        value={post.content!}
        onChange={onContentChange}
        generateMarkdownPreview={generateMarkdownPreview}>
      </ReactMde>
      
      <Button onClick={submit}>Submit Post!</Button>
    </div>
  );
}

export default WritePost;
