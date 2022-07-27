import { info } from 'autoprefixer'
import { CategoryOptions } from 'components/CategoryOptions'
import Container from 'components/Container'
import { OptionsContainer } from 'components/OptionsContainer'
import { SubCategories } from 'components/SubCategories'
import { useRouter } from 'next/router'
import Post from 'components/Post'
import React, { useEffect, useState } from 'react'

const Category = () => {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState(null)
  const [subCategories, setSubCategories] = useState(null)
  const [subCategorySelected, setSubCategorySelected] = useState('')
  const [loading, setLoading] = useState(false)

  const getCategoryData = async () => {
    try {
      const resp = await fetch(
        `/api/category?category=${router.query.category}`
      )
      const data = await resp.json()
      if (data.success) {
        setCategory(data.data)
        setSubCategories(['todos', ...data.data.subcategories])
      }
    } catch (error) {}
  }

  const getPosts = async ({ category, subcategory }) => {
    setLoading(true)
    const resp = await fetch(
      `/api/getPosts-by-subcategory?category=${category}&subcategory=${subcategory}`,
      {
        'content-Type': 'application/json',
      }
    )
    const data = await resp.json()
    setPosts(data.posts)
    setLoading(false)
  }

  useEffect(() => {
    if (router.query.category) {
      getCategoryData()
    }
  }, [router])

  useEffect(() => {
    if (!subCategorySelected) {
      return
    }

    getPosts({
      category: router.query.category,
      subcategory: subCategorySelected,
    })
  }, [subCategorySelected])

  return (
    <main className='w-full min-h-screen flex flex-col items-center'>
      <Container>
        {category && (
          <>
            <h1 className='text-7xl text-emerald-600 text-center font-semibold my-5'>
              {category.name}
            </h1>
            <OptionsContainer>
              <SubCategories
                sub={subCategories}
                subCategorySelected={subCategorySelected}
                setSubCategorySelected={setSubCategorySelected}
              />
              {/* <CategoryOptions /> */}
            </OptionsContainer>
            <section>
              {!posts.length && <h2>No hay posts para mostrar</h2>}
              {!loading && posts.length
                ? posts.map((post) => <Post key={post._id} data={post} />)
                : ''}
            </section>
          </>
        )}
      </Container>
    </main>
  )
}

export default Category
