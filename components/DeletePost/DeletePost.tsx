import { withRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import {
  DELETE_POST_MUTATION,
  SINGLE_USER_QUERY,
  LIKED_POSTS_QUERY,
  CURRENT_USER_QUERY,
} from "../../apollo/queries";

const DeletePost = ({ post, router }) => {
  const {
    loading: currentuserLoading,
    error: currentUserError,
    data: { currentUser } = {}, // setting default value when destructing as data is undefined when loading - https://github.com/apollographql/react-apollo/issues/3323#issuecomment-523430331
  } = useQuery(CURRENT_USER_QUERY);

  if (!currentUser && currentUser.id !== post.author.id) return null;

  const [
    deletePost,
    { data, loading: deletePostLoading, error: deletePostError },
  ] = useMutation(DELETE_POST_MUTATION, {
    variables: { id: post.id, publicId: post.content.publicId },
    onCompleted() {
      router.push("/[username]", `/${currentUser.username}`);
    },
    refetchQueries: [
      {
        query: LIKED_POSTS_QUERY,
        variables: {
          id: currentUser.id,
        },
      },
      {
        query: SINGLE_USER_QUERY,
        variables: {
          id: currentUser.id,
        },
      },
    ],
  });

  return (
    <button type="button" onClick={deletePost}>
      Delete
    </button>
  );
};

export default withRouter(DeletePost);
