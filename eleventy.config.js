/**
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 * @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("categories", function (collection) {
    const _getAllCategories = eleventyConfig.getFilter("getAllCategories");
    // Get all pages from our `posts` collection.
    const posts = collection.getFilteredByTag("posts");
    // Get all unique categories from our `posts[]` array.
    const categories = _getAllCategories(posts);
    const categoryMap = new Map();
    for (const category of categories) {
      // Get all pages from our `posts` collection wwith the specified `category`.
      const categoryPosts = posts.filter(post => post.data.categories?.includes(category));
      categoryMap.set(category, categoryPosts);
    }
    // Convert the Map to an object of `{category: categoryPosts[]}` like format.
    return Object.fromEntries(categoryMap);
  });

  eleventyConfig.addFilter("getAllCategories", (collection) => {
    let categorySet = new Set();
    for (let item of collection) {
      (item.data.categories || []).forEach((category) =>
        categorySet.add(category)
      );
    }
    const _filterCategoryList = eleventyConfig.getFilter("filterCategoryList");
    return _filterCategoryList(Array.from(categorySet));
  });

  eleventyConfig.addFilter(
    "filterCategoryList",
    function filterCategoryList(categories) {
      return (categories || []).filter(
        (category) => !["all", "nav", "post", "posts"].includes(category)
      );
    }
  );

  return {
    dir: {
      input: "src",
      output: "www",
    },
  };
};
