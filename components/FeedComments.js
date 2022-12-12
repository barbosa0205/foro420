import { comment } from 'postcss'
import React, { useEffect, useState } from 'react'
import Comment from './Comment'

export const FeedComments = ({
  postId,
  postedById,
  feedComments,
  setFeedComments,
}) => {
  const getComments = async ({ qty }) => {
    try {
      const resp = await fetch(
        `/api/comments?qty=${qty}&postedById=${postedById}&postId=${postId}`
      )
      const data = await resp.json()
      console.log(
        'comments',
        data.map((dta) => dta.commentType)
      )
      setFeedComments(data)
    } catch (error) {
      console.log('error al obtener comentarios', error)
    }
  }

  useEffect(() => {
    console.log(feedComments)
    getComments({
      qty: 4,
    })
  }, [])

  return (
    <div>
      {feedComments && feedComments.length ? (
        feedComments.map((comment) => (
          <Comment
            key={comment._id}
            commentId={comment._id}
            userImage={comment.postedBy.image}
            username={comment.postedBy.username}
            comment={comment.content}
            postId={postId}
            responses={comment.responses}
            postedbyId={comment.postedBy._id}
            comments={feedComments}
            setComments={setFeedComments}
            userId={comment.postedBy._id}
            commentType={comment.commentType}
          />
        ))
      ) : (
        <p className='text-2xl font-slate-600 text-center'>
          Se el primero en comentar este post
        </p>
      )}
    </div>
  )
}
