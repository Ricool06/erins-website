import React, { FC, useState } from 'react';
import ReactMde from 'react-mde';
import { Button, Input, Form, PageHeader, Spin } from 'antd';
import 'react-mde/lib/styles/css/react-mde-all.css';
import showdown from 'showdown';
import { CreatePostInput } from 'src/API';

interface IWritePostProps {
  onSubmit: (post: CreatePostInput) => void;
  canPost?: boolean;
}

const markdownConverter = new showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

const WritePost: FC<IWritePostProps> = ({ onSubmit, canPost = true }) => {
  const [post, queuePostUpdate] = useState<CreatePostInput>({
    title: '',
    content: ''
  });

  const [selectedTab, setSelectedTab] =
    useState<'write' | 'preview'>('write');

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
    <>
      <PageHeader title='Let your creativity flow...'></PageHeader>
      <Form>
        <Form.Item label='Post title'>
          <Input onChange={event => onTitleChange(event.target.value)} />
        </Form.Item>
        <Form.Item>
          <ReactMde
            value={post.content!}
            onChange={onContentChange}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={generateMarkdownPreview}>
          </ReactMde>
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            disabled={!canPost}
            onClick={submit}>
              {canPost ? 'Submit Post' : (<Spin />)}
            </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default WritePost;
