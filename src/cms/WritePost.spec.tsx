import '../../__mocks__/match-media.spec';
import React from 'react';
import WritePost from "./WritePost";
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button, Input, Spin, Upload } from 'antd';
import ReactMde from 'react-mde';
import { Converter, ConverterStatic } from 'showdown';
import { CreatePostActionPayload } from 'src/redux/actions/types';
import { RcFile } from 'antd/lib/upload/interface';

jest.mock('showdown');

describe('WritePost', () => {
  it('should contain a markdown editor', () => {
    const wrapper = shallow(<WritePost onSubmit={jest.fn()} />);

    const editor = wrapper.find(ReactMde);

    expect(editor.exists()).toBe(true);
  });

  it('should call the onSubmit function when a user presses the submit button', () => {
    const onSubmit = jest.fn();
    const wrapper = mount(<WritePost onSubmit={onSubmit} />);
    const editor = wrapper.find(ReactMde);
    const titleInput = wrapper.find(Input);
    const submitButton = wrapper.find(Button);
    const coverPhotoUploader = wrapper.find(Upload);

    const coverPhotoFile: Partial<RcFile> = {
      name: 'photo.jpg',
      size: 1234,
      type: 'image/jpg',
      uid: 'fileUid'
    };

    const expected: CreatePostActionPayload = {
      title: 'Wow, a blog.',
      content: 'Hello! I am a blog post.',
      coverPhotoFile: coverPhotoFile as RcFile
    };

    act(() => {
      editor.props().onChange(expected.content!);
      titleInput.simulate('change', { target: { value: expected.title }});
      coverPhotoUploader.props().beforeUpload!(coverPhotoFile as RcFile, []);
      submitButton.simulate('click');
    });

    expect(onSubmit).toHaveBeenCalledWith(expected);
  });

  it('should generate a markdown -> html preview using showdown', async () => {
    const mockConverterClass = Converter as jest.MockedClass<ConverterStatic>;
    const expectedMarkdown = '*This is markdown!*';
    const expectedHtml = '<p>This is HTML!</p>';

    const wrapper = mount(<WritePost onSubmit={jest.fn()} />);
    const editor = wrapper.find(ReactMde);

    expect(mockConverterClass.mock.instances).toHaveLength(1);

    const mockConverter = mockConverterClass.mock.instances[0];
    mockConverter.makeHtml = jest.fn(() => expectedHtml);

    const node = await editor.props().generateMarkdownPreview(expectedMarkdown);

    expect(mockConverter.makeHtml).toHaveBeenCalledWith(expectedMarkdown);
    expect(node?.toString()).toEqual(expectedHtml);
  });

  it('should store the tab type', () => {
    const wrapper = shallow(<WritePost onSubmit={jest.fn()} />);
    const getEditor = () => wrapper.find(ReactMde);

    expect(getEditor().props().selectedTab).toEqual('write');

    act(() => {
      getEditor().props().onTabChange('preview');
    });

    expect(getEditor().props().selectedTab).toEqual('preview');
  });

  it('should enable the submit button when canPost is true', () => {
    const wrapper = shallow(<WritePost canPost={true} onSubmit={jest.fn()} />);
    const button = wrapper.find(Button);

    expect(button.props().disabled).toEqual(false);
    expect(button.text()).toEqual('Submit Post');
  });

  it('should disable the submit button when canPost is false', () => {
    const wrapper = shallow(<WritePost canPost={false} onSubmit={jest.fn()} />);
    const button = wrapper.find(Button);

    expect(button.props().disabled).toEqual(true);
    expect(button.find(Spin).exists()).toBeTruthy()
  });
});