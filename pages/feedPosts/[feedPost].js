import React from 'react'
import FeedPostSchema from 'models/FeedPost'
import FeedPost from 'components/FeedPost'
const FeedPostPage = ({ feedPost }) => {
  return (
    <div>
      <FeedPost postData={feedPost} />
    </div>
  )
}

export default FeedPostPage

export const getServerSideProps = async (context) => {
  try {
    const feedPostId = context.query.feedPost
    let feedPost = await FeedPostSchema.findOne({
      _id: feedPostId,
    }).populate([
      {
        path: 'postedBy',
        model: 'F420User',
      },
      {
        path: 'comments',
        moddel: 'Comment',
        populate: {
          path: 'postedBy',
          model: 'F420User',
        },
      },
    ])
    feedPost = JSON.parse(JSON.stringify(feedPost))
    return {
      props: {
        feedPost,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      props: {},
    }
  }
}
