import Image from 'next/image'
import React, { memo } from 'react'
import CreateComment from './CreateComment'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { es } from 'date-fns/locale'
import useUser from 'contexts/useUser'
import IconButton from './CloseButton'
import { useState } from 'react'
import { useMenu } from 'hooks/useMenu'
import { MenuPopup } from './MenuPopup'
import { useFetch } from 'hooks/useFetch'
import { useEffect } from 'react'
import usePost from 'contexts/posts/usePost'
import Notification from './Notification'
import { FeedComments } from './FeedComments'

const FeedPost = memo(({ postData }) => {
  const { userF420, setNotify } = useUser()
  const { feedPosts, setFeedPosts } = usePost()
  const [editData, handleEditFetch] = useFetch('')
  const [deleteData, loadingDelete, handleDeleteFetch] = useFetch(
    'api/feedPosts/feedPost',
    {
      method: 'DELETE',
      body: JSON.stringify({
        data: postData,
      }),
    }
  )

  const { openMenu, toggleMenu } = useMenu()

  const [feedComments, setFeedComments] = useState([])

  const editPost = async () => {
    try {
    } catch (error) {}
  }
  const deletePost = async () => {
    try {
      await handleDeleteFetch()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (deleteData) {
      // remove post from feedPosts Array
      const newFeedPostsArray = feedPosts.filter(
        (post) => post._id !== postData._id
      )
      setFeedPosts(newFeedPostsArray)
    }
  }, [deleteData])

  return (
    <>
      {loadingDelete ? (
        <div className='w-full'>
          <p className='max-w-xl mx-auto text-center font-bold py-2 rounded-xl bg-red-500 text-white'>
            eliminando tu publicación...
          </p>
        </div>
      ) : (
        ''
      )}
      <div className='my-6'>
        <article className='container bg-white rounded-xl pt-2 shadow-sm mx-auto'>
          {/* header */}
          <header className='flex items-center justify-betweenp-3 border-b border-zinc-100'>
            {/* user section */}
            <div className='flex items-center '>
              <div className='w-16'>
                <Image
                  className='w-full object-cover rounded-full cursor-pointer'
                  src={postData.postedBy.image}
                  alt='profile'
                  width={50}
                  height={50}
                />
              </div>
              <div className='flex flex-col w-full'>
                <h4 className='m-0 mx-1 p-0'>{postData.postedBy.username}</h4>
                <div className='flex items-center justify-end w-full'>
                  <span className='ri-time-line mx-1 text-xl'></span>
                  <small className='text-base font-semibold'>
                    {formatDistanceStrict(
                      new Date(),
                      new Date(postData.updatedAt),
                      {
                        locale: es,
                      }
                    )}
                  </small>
                </div>
              </div>
            </div>
            {/* option Button section */}
            <div className='flex w-full items-center justify-end'>
              <div className='relative mx-3'>
                {userF420._id === postData.postedBy._id && (
                  <IconButton
                    icon='ri-more-2-line'
                    onClick={toggleMenu}
                    padding='p-1'
                  />
                )}
                {openMenu && (
                  <MenuPopup top={'-top-4'} right='right-14'>
                    <p
                      onClick={editPost}
                      className='text-xl px-5 cursor-pointer'
                    >
                      Editar
                    </p>
                    <p
                      onClick={deletePost}
                      className='text-xl px-5 cursor-pointer'
                    >
                      Eliminar
                    </p>
                  </MenuPopup>
                )}
              </div>
            </div>
          </header>

          {/* main content */}
          <main className='container'>
            <p className='py-3 px-6'>{postData.content}</p>
            {postData.image.length ? (
              <section
                className={`grid gap-1.2 ${
                  postData.image.length === 1
                    ? 'grid-cols-1'
                    : postData.image.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-2 grid-rows-2'
                }`}
              >
                {postData.image.length > 3 ? (
                  <>
                    {postData.image.slice(0, 3).map((img, index) => (
                      <Image
                        key={img}
                        className={`
                      } object-cover object-top cursor-pointer`}
                        src={img}
                        alt={img}
                        width={'500'}
                        height={'500'}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    {postData.image.map((img, index) => (
                      <Image
                        key={`${index}`}
                        className={`${
                          postData.image.length === 1 ? '' : 'rounded-md'
                        } object-cover object-top cursor-pointer`}
                        src={img}
                        alt={img}
                        width={'500'}
                        height={'500'}
                      />
                    ))}
                  </>
                )}

                {postData.image.length > 3 ? (
                  <div className='relative h-full'>
                    <Image
                      src={postData.image[3]}
                      alt={'watch all'}
                      width={'500'}
                      height={'500'}
                      className={` blur-xs object-cover object-top`}
                    />
                    {/* cover */}
                    <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center  cursor-pointer'>
                      <p className='font-bold text-white text-3xl px-2 text-center'>
                        Ver todas las fotos
                      </p>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </section>
            ) : (
              ''
            )}
          </main>

          {/* footer */}
          <footer>
            {/* buttons section (like, comment, share) */}
            <section className='flex items-center justify-around mx-5'>
              {/* button like */}
              <button className='w-36 sm:w-72 py-2 my-2 rounded-xl  hover:bg-zinc-200 flex items-center justify-center'>
                <i className='ri-heart-line text-3xl text-slate-700'></i>
                <small className='text-2xl mb-[.5px] mx-1 text-slate-700'>
                  {postData.likes}
                </small>
              </button>

              {/* button comment */}
              <button className='w-36 sm:w-72 py-2 my-2 rounded-xl  hover:bg-zinc-200 flex items-center justify-center'>
                <i className='ri-chat-1-line text-3xl text-slate-700'></i>
                <small className='text-2xl mb-[.5px] mx-1 text-slate-700'>
                  {postData.comments.length}
                </small>
              </button>

              {/* button share */}
              <button className='w-36 sm:w-72 py-2 my-2 rounded-xl hover:bg-zinc-200 flex items-center justify-center'>
                <i className='ri-share-box-line text-3xl text-slate-700'></i>
              </button>
            </section>

            {/* comment section */}
            <section>
              {userF420?._id ? (
                <CreateComment
                  user={userF420}
                  postId={postData._id}
                  type='feedComment'
                  setComments={setFeedComments}
                  comments={feedComments}
                />
              ) : (
                <p></p>
              )}
              <FeedComments
                postedById={postData.postedBy._id}
                postId={postData._id}
                feedComments={feedComments}
                setFeedComments={setFeedComments}
              />
            </section>
          </footer>
        </article>
      </div>
    </>
  )
})
FeedPost.displayName = 'FeedPost'
export default FeedPost
