/**
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 * @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
module.exports = function (eleventyConfig) {
  // Create a custom collection of unique categories and related posts.
  eleventyConfig.addCollection("categories", function (collection) {
    const _getAllCategories = eleventyConfig.getFilter("getAllCategories");
    const posts = collection.getFilteredByGlob("src/blog/*.njk");
    // Get all unique categories from our `posts[]` array.
    const categories = _getAllCategories(posts);
    const categoryMap = categories.reduce((map, category) => {
      // Get all pages from our `posts` collection wwith the specified `category`.
      const categoryPosts = posts.filter(post => post.data.category === category);
      return map.set(category, categoryPosts);
    }, new Map());
    // Convert category Map to Object.
    return Object.fromEntries(categoryMap);
  });

  eleventyConfig.addFilter("getAllCategories", function (collection) {
    const categorySet = collection.reduce((set, { data }) => {
      if (data.category && !set.has(data.category)) {
        console.log(`Adding ${data.category}`);
        set.add(data.category);
      }
      return set;
    }, new Set());
    return Array.from(categorySet).sort();
  });

  return {
    dir: {
      input: "src",
      output: "www",
    },
  };
};
