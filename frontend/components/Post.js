import Link from "next/link";
import { Component } from 'react';
import { Query } from 'react-apollo';
import styled from "styled-components";
import { SINGLE_POST_QUERY } from '../apollo/queries';
import LikeButton from './LikeButton';
import PostComment from './PostComment';
import CommentList from './styles/CommentList';
import Comment from './Comment';
import DeletePost from './DeletePost';
import formatDistance from 'date-fns/formatDistance';

const Wrapper = styled.article`
  display: grid;
  grid-template-rows: 60px auto;
  grid-row-gap: var(--spacing-medium);
  border-radius: 3px;
  border: 1px solid #e6e6e6;
  background-color: #fff;
`;

const PostHeader = styled.header`
  display: grid;
  grid-template-columns: 30px 1fr;
  grid-template-rows: 30px;
  grid-column-gap: var(--spacing-small);
  padding: var(--spacing-medium);
  border-bottom: 1px solid #efefef;
  border-bottom-width: 0.5px;
`;

const Photo = styled.div`
  display: grid;
`;

const Details = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 2px;
  line-height: 1;
`;

const Username = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const Location = styled.span`
  font-size: 1.2rem;
`;

const PostContent = styled.div`
  display: grid;
`;

const PostInteraction = styled.div`
  display: grid;
  grid-template-rows: repeat(5, auto);
  grid-row-gap: var(--spacing-small);
  padding: 0 var(--spacing-medium);
`;

const Buttons = styled.section`
  display: grid;
`;

const Likes = styled.div`
  display: grid;
  font-size: 1.4rem;
  line-height: 1.8rem;
`;

const Caption = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: var(--spacing-small);
  font-size: 1.4rem;
  line-height: 1.8rem;
  a {
    font-weight: bold;
  }
`;

const PostTime = styled.div`
  display: grid;
  font-size: 1.2rem;
  letter-spacing: 0.2px;
  line-height: 18px;
  color: #999;
  text-transform: uppercase;
`;

const AddComment = styled.section`
  display: grid;
  border-top: 1px solid #efefef;
  min-height: 56px;
`;

class Post extends Component {
  render() {
    return (
      <Query query={SINGLE_POST_QUERY} variables={{ id: this.props.id }}>
        {({ data: { post }, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;

          return (
            <Wrapper>
              <PostHeader>
                <Photo>
                  <img src={post.author.profilePicture} />
                </Photo>
                <Details>
                  <Username>{post.author.username}</Username>
                  <Location>Random post location</Location>
                </Details>
              </PostHeader>
              <PostContent>
                <img src={post.content.url.replace('/upload', '/upload/w_614,ar_4:5,c_mpad,dpr_2.0')} />
              </PostContent>
              <PostInteraction>
                <Buttons>
                  <LikeButton postId={this.props.id} postLikes={post.likes} />
                </Buttons>
                {post.likes.length ? <Likes>{post.likes.length} like{post.likes.length > 1 ? 's' : null}</Likes> : null }
                <Caption>
                  <Link href={`/user?id=${post.author.id}`}>
                    <a>{post.author.username}</a>
                  </Link>
                  {post.caption}
                </Caption>
                <CommentList>
                  {post.comments.map(comment => (
                    <Comment key={comment.id} comment={comment} post={post} />
                  ))}
                </CommentList>
                <PostTime>
                  {formatDistance(post.createdAt, new Date(), {
                    includeSeconds: true
                  })} ago
                </PostTime>
                <AddComment>
                  <PostComment postId={post.id} />
                </AddComment>
                {/* <DeletePost post={post} /> */}
              </PostInteraction>
            </Wrapper>
          );
        }}
      </Query>
    );
  }
}

export default Post;