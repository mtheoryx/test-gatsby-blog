import React from 'react'
import Link from 'gatsby-link'

const IndexPage = ({data}) => {
  const { edges: posts } = data.allMarkdownRemark;
  
  return (
    <div>
      {posts.map(({node: post}) => {
        const { frontmatter } = post;
        return (process.env.NODE_ENV === 'development' || frontmatter.published) ? (
          <div>
            <h2>
              <Link to={frontmatter.path}>
                {frontmatter.title}
              </Link>
              <p>{frontmatter.date}</p>
              <p>{frontmatter.excerpt}</p>
            </h2>
          </div>
        ) : null
      })}
    </div>
  )
}

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD YYYY")
            path
            tags
            excerpt
            published
          }
        }
      }
    }
}
`

export default IndexPage
