/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

const createTagPages = (createPage, posts) => {
  const tagPageTemplate = path.resolve(`src/templates/tags.js`);
  const allTagsTemplate = path.resolve(`src/templates/all-tags.js`);

  let postsByTags = {};

  //Build up a collection of tags for All Tags Page
  // @TODO, number of posts using that tag?
  posts.forEach(({ node }) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        if (!postsByTags[tag]) {
          postsByTags[tag] = [];
        }

        postsByTags[tag].push(node);
      });
    }
  });

  const tags = Object.keys(postsByTags);

  createPage({
    path: `/tags`,
    component: allTagsTemplate,
    context: {
      tags: tags.sort()
    }
  });

  //Create the page for an individual tag
  //With links to each post using the tag
  // @TODO, number of posts using that tag?
  tags.forEach(tagName => {
    const posts = postsByTags[tagName];

    createPage({
      path: `/tags/${tagName}`,
      component: tagPageTemplate,
      context: {
        posts,
        tagName
      }
    });
  });

};

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

    //Filter draft posts out on production build
    const allowedPosts = allPosts.filter(post => {
      return (process.env.NODE_ENV === 'development' || post.node.frontmatter.published) ? true : false;
    });
    
    createTagPages(createPage, allowedPosts);

    allowedPosts.forEach(({node}, index) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {
          prev: index === 0 ? null : allowedPosts[index - 1].node,
          next: index === (allowedPosts.length - 1) ? null : allowedPosts[index + 1].node
        }
      });
    });
  });
};