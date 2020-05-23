import { selectNextToken, selectPost } from ".";
import { RootState, Post } from "../reducers";

const mockState: Partial<RootState> = {
  listPosts: {
    items: [],
    nextToken: 'next.token',
    startedAt: null,
    __typename: 'ModelPostConnection',
  }
};

const copy = Object.assign;

describe('selectors', () => {
  it('should select the next list posts token from state', () => {
    expect(selectNextToken(mockState as RootState)).toEqual(mockState.listPosts?.nextToken);
  });

  it('should select the post in the state by id', () => {
    const expectedId = 'expectedId';

    const expectedPost: Post = {
      __typename: 'Post',
      _lastChangedAt: 1234,
      _version: 1,
      content: 'content',
      id: expectedId,
      owner: 'author',
      title: 'the great tale of sharky the goldfish',
      _deleted: false
    };

    const wrongPost = { ...copy(expectedPost), id: 'wrong' };
    const anotherWrongPost = { ...copy(expectedPost), id: 'alsoWrong' };

    const stateWithPosts = copy({
      ...mockState,
      listPosts: {
        ...mockState.listPosts,
        items: [wrongPost, expectedPost, anotherWrongPost]
      }
    });

    expect(selectPost(stateWithPosts, expectedId)).toEqual(expectedPost);
  });


  it('should return undefined or null if it cannot find the post by id', () => {
    const firstWrongPost: Post = {
      __typename: 'Post',
      _lastChangedAt: 1234,
      _version: 1,
      content: 'content',
      id: 'wrongun',
      owner: 'author',
      title: 'the great tale of sharky the goldfish',
      _deleted: false
    };

    const wrongPost = { ...copy(firstWrongPost), id: 'wrong' };
    const anotherWrongPost = { ...copy(firstWrongPost), id: 'alsoWrong' };

    const stateWithPosts = copy({
      ...mockState,
      listPosts: {
        ...mockState.listPosts,
        items: [wrongPost, firstWrongPost, anotherWrongPost]
      }
    });

    expect(selectPost(stateWithPosts, 'can haz post')).toEqual(undefined);
  });
});