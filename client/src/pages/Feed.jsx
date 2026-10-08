import {
  Heart,
  MessageCircle,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import {
  getStorage,
  setStorage,
} from "../utils/storage";

const starterPosts = [
  {
    id: "starter-post-1",
    userId: "campus-connect",
    authorName: "Campus Connect",
    content:
      "Welcome to Campus Connect! Share ideas, discover opportunities, and connect with students across campus.",
    createdAt:
      new Date().toISOString(),
    likes: [],
    comments: [],
  },
];

function Feed() {
  const { currentUser } = useAuth();

  const { addNotification } =
    useNotifications();

  const [posts, setPosts] = useState(
    () => {
      const savedPosts =
        getStorage("posts", []);

      if (savedPosts.length > 0) {
        return savedPosts;
      }

      setStorage(
        "posts",
        starterPosts
      );

      return starterPosts;
    }
  );

  const [postText, setPostText] =
    useState("");

  const [commentInputs, setCommentInputs] =
    useState({});

  const [search, setSearch] =
    useState("");

  /*
    Search posts
  */

  const filteredPosts = useMemo(() => {
    const currentSearch = search
      .trim()
      .toLowerCase();

    if (!currentSearch) {
      return posts;
    }

    return posts.filter((post) => {
      const content =
        post.content?.toLowerCase() ||
        "";

      const author =
        post.authorName?.toLowerCase() ||
        "";

      return (
        content.includes(
          currentSearch
        ) ||
        author.includes(
          currentSearch
        )
      );
    });
  }, [posts, search]);

  /*
    Save posts
  */

  const savePosts = (
    updatedPosts
  ) => {
    setPosts(updatedPosts);

    setStorage(
      "posts",
      updatedPosts
    );
  };

  /*
    Create post
  */

  const handleCreatePost = (
    event
  ) => {
    event.preventDefault();

    if (!currentUser) {
      return;
    }

    const content =
      postText.trim();

    if (!content) {
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      userId: currentUser.id,
      authorName: currentUser.name,
      content,
      createdAt:
        new Date().toISOString(),
      likes: [],
      comments: [],
    };

    const updatedPosts = [
      newPost,
      ...posts,
    ];

    savePosts(updatedPosts);

    setPostText("");
  };

  /*
    Like / Unlike
  */

  const handleLike = (
    postId
  ) => {
    if (!currentUser) {
      return;
    }

    const post = posts.find(
      (item) =>
        item.id === postId
    );

    if (!post) {
      return;
    }

    const likes = post.likes || [];

    const alreadyLiked =
      likes.includes(
        currentUser.id
      );

    const updatedPosts =
      posts.map((item) => {
        if (item.id !== postId) {
          return item;
        }

        return {
          ...item,

          likes: alreadyLiked
            ? likes.filter(
                (userId) =>
                  userId !==
                  currentUser.id
              )
            : [
                ...likes,
                currentUser.id,
              ],
        };
      });

    savePosts(updatedPosts);

    /*
      Only notify the owner
      when a NEW like happens.

      Do not notify when
      someone unlikes.
    */

    if (
      !alreadyLiked &&
      post.userId !==
        currentUser.id &&
      post.userId !==
        "campus-connect"
    ) {
      addNotification({
        userId: post.userId,
        type: "like",
        title:
          "Someone liked your post",
        message: `${currentUser.name} liked your post.`,
        link: "/feed",
        actorId:
          currentUser.id,
        actorName:
          currentUser.name,
      });
    }
  };

  /*
    Comment input
  */

  const handleCommentInput = (
    postId,
    value
  ) => {
    setCommentInputs(
      (previous) => ({
        ...previous,
        [postId]: value,
      })
    );
  };

  /*
    Add comment
  */

  const handleAddComment = (
    event,
    postId
  ) => {
    event.preventDefault();

    if (!currentUser) {
      return;
    }

    const commentText =
      commentInputs[
        postId
      ]?.trim();

    if (!commentText) {
      return;
    }

    const post = posts.find(
      (item) =>
        item.id === postId
    );

    if (!post) {
      return;
    }

    const comments =
      post.comments || [];

    const newComment = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,
      userId:
        currentUser.id,
      authorName:
        currentUser.name,
      text: commentText,
      createdAt:
        new Date().toISOString(),
    };

    const updatedPosts =
      posts.map((item) => {
        if (item.id !== postId) {
          return item;
        }

        return {
          ...item,

          comments: [
            ...comments,
            newComment,
          ],
        };
      });

    savePosts(updatedPosts);

    setCommentInputs(
      (previous) => ({
        ...previous,
        [postId]: "",
      })
    );

    /*
      Notify post owner
      about the comment.
    */

    if (
      post.userId !==
        currentUser.id &&
      post.userId !==
        "campus-connect"
    ) {
      addNotification({
        userId: post.userId,
        type: "comment",
        title: "New comment",
        message: `${currentUser.name} commented on your post.`,
        link: "/feed",
        actorId:
          currentUser.id,
        actorName:
          currentUser.name,
      });
    }
  };

  /*
    Delete own post
  */

  const handleDeletePost = (
    postId
  ) => {
    if (!currentUser) {
      return;
    }

    const post = posts.find(
      (item) =>
        item.id === postId
    );

    if (!post) {
      return;
    }

    if (
      post.userId !==
      currentUser.id
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmed) {
      return;
    }

    const updatedPosts =
      posts.filter(
        (item) =>
          item.id !== postId
      );

    savePosts(updatedPosts);
  };

  /*
    Format date
  */

  const formatDate = (
    date
  ) => {
    const postDate =
      new Date(date);

    return postDate.toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  /*
    Check if current user
    liked a post
  */

  const isLiked = (
    post
  ) => {
    if (!currentUser) {
      return false;
    }

    return (
      post.likes || []
    ).includes(
      currentUser.id
    );
  };

  return (
    <main className="feed-page">
      <div className="feed-container">

        {/* Header */}

        <div className="feed-heading">
          <div>
            <span className="section-label">
              Campus community
            </span>

            <h1>
              Campus Feed
            </h1>

            <p>
              Share ideas, updates,
              questions, and
              opportunities with your
              campus community.
            </p>
          </div>
        </div>

        {/* Login Message */}

        {!currentUser && (
          <div className="feed-login-message">
            <div>
              <strong>
                Join the conversation
              </strong>

              <p>
                Sign in to create posts,
                like posts, and leave
                comments.
              </p>
            </div>

            <Link to="/login">
              Sign in
            </Link>
          </div>
        )}

        {/* Create Post */}

        {currentUser && (
          <section className="create-post-card">

            <div className="create-post-header">
              <div className="feed-avatar">
                <UserRound size={21} />
              </div>

              <div>
                <strong>
                  {currentUser.name}
                </strong>

                <span>
                  Share something with
                  your campus
                </span>
              </div>
            </div>

            <form
              className="create-post-form"
              onSubmit={
                handleCreatePost
              }
            >
              <textarea
                value={postText}
                onChange={(event) =>
                  setPostText(
                    event.target.value
                  )
                }
                placeholder="What's happening on campus?"
                rows="4"
                maxLength="500"
              />

              <div className="create-post-footer">
                <span>
                  {postText.length}/500
                </span>

                <button
                  type="submit"
                  disabled={
                    !postText.trim()
                  }
                >
                  <Send size={16} />
                  Post
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Search */}

        <div className="feed-search">
          <MessageCircle
            size={18}
          />

          <input
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        {/* Posts */}

        <div className="feed-list">
          {filteredPosts.length ===
          0 ? (
            <div className="feed-empty">
              <div className="feed-empty-icon">
                <MessageCircle
                  size={28}
                />
              </div>

              <h2>
                No posts found
              </h2>

              <p>
                Try a different search
                or be the first to
                create a post.
              </p>
            </div>
          ) : (
            filteredPosts.map(
              (post) => {
                const liked =
                  isLiked(post);

                const comments =
                  post.comments ||
                  [];

                const likes =
                  post.likes || [];

                const isOwner =
                  currentUser?.id ===
                  post.userId;

                return (
                  <article
                    className="feed-post-card"
                    key={post.id}
                  >

                    {/* Post Header */}

                    <div className="feed-post-header">

                      <div className="feed-post-user">
                        <div className="feed-avatar">
                          <UserRound
                            size={20}
                          />
                        </div>

                        <div>
                          <strong>
                            {
                              post.authorName
                            }
                          </strong>

                          <span>
                            {formatDate(
                              post.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      {isOwner && (
                        <button
                          type="button"
                          className="feed-delete-button"
                          onClick={() =>
                            handleDeletePost(
                              post.id
                            )
                          }
                          aria-label="Delete post"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      )}
                    </div>

                    {/* Content */}

                    <div className="feed-post-content">
                      <p>
                        {post.content}
                      </p>
                    </div>

                    {/* Stats */}

                    <div className="feed-post-stats">
                      <span>
                        {likes.length}{" "}
                        {likes.length ===
                        1
                          ? "like"
                          : "likes"}
                      </span>

                      <span>
                        {comments.length}{" "}
                        {comments.length ===
                        1
                          ? "comment"
                          : "comments"}
                      </span>
                    </div>

                    {/* Actions */}

                    <div className="feed-post-actions">

                      <button
                        type="button"
                        className={
                          liked
                            ? "feed-action feed-action-liked"
                            : "feed-action"
                        }
                        onClick={() =>
                          handleLike(
                            post.id
                          )
                        }
                        disabled={
                          !currentUser
                        }
                      >
                        <Heart
                          size={18}
                          fill={
                            liked
                              ? "currentColor"
                              : "none"
                          }
                        />

                        {liked
                          ? "Liked"
                          : "Like"}
                      </button>

                      <button
                        type="button"
                        className="feed-action"
                        onClick={() => {
                          const input =
                            document.getElementById(
                              `comment-${post.id}`
                            );

                          input?.focus();
                        }}
                      >
                        <MessageCircle
                          size={18}
                        />

                        Comment
                      </button>
                    </div>

                    {/* Comments */}

                    {comments.length >
                      0 && (
                      <div className="feed-comments">
                        {comments.map(
                          (
                            comment
                          ) => (
                            <div
                              className="feed-comment"
                              key={
                                comment.id
                              }
                            >
                              <div className="feed-comment-avatar">
                                <UserRound
                                  size={15}
                                />
                              </div>

                              <div className="feed-comment-content">
                                <strong>
                                  {
                                    comment.authorName
                                  }
                                </strong>

                                <p>
                                  {
                                    comment.text
                                  }
                                </p>

                                <span>
                                  {formatDate(
                                    comment.createdAt
                                  )}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Comment Form */}

                    {currentUser && (
                      <form
                        className="feed-comment-form"
                        onSubmit={(
                          event
                        ) =>
                          handleAddComment(
                            event,
                            post.id
                          )
                        }
                      >
                        <div className="feed-comment-avatar">
                          <UserRound
                            size={15}
                          />
                        </div>

                        <input
                          id={`comment-${post.id}`}
                          type="text"
                          placeholder="Write a comment..."
                          value={
                            commentInputs[
                              post.id
                            ] || ""
                          }
                          onChange={(
                            event
                          ) =>
                            handleCommentInput(
                              post.id,
                              event
                                .target
                                .value
                            )
                          }
                          maxLength="250"
                        />

                        <button
                          type="submit"
                          disabled={
                            !commentInputs[
                              post.id
                            ]?.trim()
                          }
                          aria-label="Add comment"
                        >
                          <Send
                            size={16}
                          />
                        </button>
                      </form>
                    )}
                  </article>
                );
              }
            )
          )}
        </div>
      </div>
    </main>
  );
}

export default Feed;