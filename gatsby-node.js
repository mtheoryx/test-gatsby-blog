/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);

  return graphql(`{
    allMarkdownRemark {
      edges {
        node {
          html
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
  }`)
  .then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const allPosts = result.data.allMarkdownRemark.edges;

    const allowedPosts = allPosts.filter(edge => 
      (process.env.NODE_ENV === 'development' 
      || edge.node.frontmatter.published));

    allowedPosts.forEach(({node}) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate
      });
    });
  });
};