import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

const Template = ({data, location}) => {
  const { markdownRemark: post } = data;
  const { frontmatter, html, published } = post;
  const { title, date } = frontmatter;

  return (
    <div>
      <Helmet title={`${title} - My Blog`} />

      <div>
        <h1>{title}</h1>
        <span>Status: {published ? 'published' : 'draft'}</span>
        <h3>{date}</h3>
        <div dangerouslySetInnerHTML={{__html: html}} />
      </div>
    </div>
  )
};
export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
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
`;
export default Template;