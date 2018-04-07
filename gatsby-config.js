module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-transofrmer-remark',
    {
      resolve: 'gatsby-source-file-system',
      options: {
        name: `src`,
        path: `${__dirname}/src`
      }
    }
  ],
};
