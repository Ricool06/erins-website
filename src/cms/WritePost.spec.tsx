import React from 'react';
import WritePost from "./WritePost";
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button, Input } from 'antd';
import ReactMde from 'react-mde';
import { Converter, ConverterStatic } from 'showdown';
import { CreatePostInput } from 'src/API';

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

    const expected: CreatePostInput = {
      title: 'Wow, a blog.',
      content: 'Hello! I am a blog post.'
    };

    act(() => {
      editor.props().onChange(expected.content!);
      titleInput.simulate('change', { target: { value: expected.title }});
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
});