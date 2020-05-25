import React, { FC, useState } from 'react';
import ReactMde from 'react-mde';
import { Button, Input, Form, PageHeader, Spin, Upload, Typography } from 'antd';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { markdownConverter } from 'src/services';
import { CreatePostActionPayload } from 'src/redux/actions/types';
import { InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload/interface';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from 'src/graphql/mutations';
import awsconfig from '../aws-exports';
import { CreatePostInput } from 'src/API';

API.configure(awsconfig);


interface IWritePostProps {
  onSubmit: (post: CreatePostActionPayload) => void;
  canPost?: boolean;
}

const WritePost: FC<IWritePostProps> = ({ onSubmit, canPost = true }) => {
  const [post, queuePostUpdate] = useState<CreatePostActionPayload>({
    title: '',
    content: '',
  });

  const [selectedTab, setSelectedTab] =
    useState<'write' | 'preview'>('write');

  const onRemoveCoverPhoto = () => {
    queuePostUpdate(oldPost => ({
      ...oldPost,
      coverPhotoFile: undefined
    }));
    return false;
  }

  const submit = () => {
    queuePostUpdate(newPost => {
      onSubmit(newPost);
      return newPost;
    });
  };

  const onContentChange = (content: string) => {
    queuePostUpdate(oldPost => ({
      ...oldPost,
      content
    }));
  };

  const onTitleChange = (title: string) => {
    queuePostUpdate(oldPost => ({
      ...oldPost,
      title
    }));
  };

  const onCoverPhotoChange = (coverPhotoFile: RcFile) => {
    queuePostUpdate(oldPost => ({
      ...oldPost,
      coverPhotoFile
    }));
    return false;
  }

  const generateMarkdownPreview = (markdown: string) => {
    return Promise.resolve(markdownConverter.makeHtml(markdown));
  }

  return (
    <>
      <PageHeader title='Let your creativity flow...'></PageHeader>
      <Form>
        <Form.Item>
          <Upload.Dragger
            multiple={false}
            accept='image/png,image/jpg,image/jpeg'
            beforeUpload={onCoverPhotoChange}
            fileList={!post.coverPhotoFile ? [] : [post.coverPhotoFile]}
            onRemove={onRemoveCoverPhoto}
          >
            <Typography.Title><InboxOutlined  /></Typography.Title>
            <Typography.Paragraph>Upload a cover photo for your post.</Typography.Paragraph>
          </Upload.Dragger>
        </Form.Item>

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
