<template>
  <div class="container mx-auto p-4">
    <!-- Back to Home Button -->
    <router-link to="/" class="back-button"> ← Back to Home </router-link>

    <!-- Filters Section -->
    <div class="header-controls">
      <SearchFilterView @apply-filters="applyFilters" class="filter-button" />
    </div>

    <h1 class="category-title">Search Results</h1>

    <!-- Display error message if any error occurs -->
    <div v-if="error">
      <p class="error-message">{{ error }}</p>
    </div>

    <!-- Show articles if no error -->
    <div v-else-if="articles.length">
      <div class="featured-grid">
        <div
          v-for="(article, index) in articles"
          :key="article.url || index"
          class="featured-news-item"
          @click="openArticle(article.url)"
        >
          <img
            :src="article.urlToImage || 'https://via.placeholder.com/150'"
            alt="Article Image"
            class="featured-image"
            loading="lazy"
          />
          <div class="article-content">
            <h3 class="article-title">{{ article.title || "Untitled" }}</h3>
            <p class="article-description">
              {{
                article.description
                  ? article.description.substring(0, 100)
                  : "No description available"
              }}...
            </p>
            <p class="article-info">
              <span class="article-source">
                {{ article.source.name || "Unknown Source" }}
              </span>
              |
              <span class="article-date">
                {{ formatDate(article.publishedAt) }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="loading-spinner">Loading...</div>
    </div>

    <div v-else>
      <p>No results found.</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SearchFilterView from "../views/SearchFilterView.vue";

export default {
  components: {
    SearchFilterView,
  },
  computed: {
    ...mapState({
      articles: (state) => state.articles,
      error: (state) => state.error,
      currentPage: (state) => state.filters.page,
      totalResults: (state) => state.totalResults,
      isLoading: (state) => state.isFetching,
    }),
    hasMorePages() {
      return this.articles.length < this.totalResults;
    },
  },
  mounted() {
    if (this.articles.length === 0) {
      this.fetchArticles();
    }

    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapActions(["fetchArticles", "updateFilter"]),
    applyFilters(filters) {
      this.updateFilter(filters);
    },
    openArticle(url) {
      window.open(url, "_blank");
    },
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(date).toLocaleDateString("en-US", options);
    },
    handleScroll() {
      const bottomOfWindow =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      if (bottomOfWindow && !this.isLoading && this.hasMorePages) {
        this.$store.commit("SET_PAGE", this.currentPage + 1);
        this.fetchArticles(true);
      }
    },
  },
};
</script>

<style scoped>
/* General Page Styling */

.category-title {
  font-weight: bolder;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

body {
  background-color: #f5f5f5;
  color: #333;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

/* Back to Home Button */
.back-to-home {
  margin-bottom: 1.5rem;
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
  color: #007acc;
  font-size: 1.2rem;
  text-decoration: none;
}

.back-button:hover {
  text-decoration: underline;
}

/* Media query for smaller screens */
@media (max-width: 768px) {
  .back-button {
    font-size: 1rem;
  }
}

/* Filters Section */
.header-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .header-controls {
    justify-content: center;
    margin-bottom: 1rem;
  }
}

/* Featured News Grid */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .featured-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .featured-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Featured News Item */
.featured-news-item {
  background-color: #fff;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: transform 0.3s;
  cursor: pointer;
}

.featured-news-item:hover {
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .featured-news-item {
    padding: 1rem;
  }
}

/* Featured Image */
.featured-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .featured-image {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .featured-image {
    height: 150px;
  }
}

/* Article Content */

.article-title {
  font-size: 1.5rem;
  margin: 10px 0;
  font-weight: 600;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .article-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .article-title {
    font-size: 1.1rem;
  }
}

.article-description {
  font-size: 1rem;
  color: #555;
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .article-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .article-description {
    font-size: 0.85rem;
  }
}

.article-info {
  font-size: 0.875rem;
  color: #777;
  display: flex;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .article-info {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .article-info {
    font-size: 0.7rem;
  }
}

.article-source {
  font-weight: bold;
}

.article-date {
  font-style: italic;
}

/* Loading Spinner */
.loading-spinner {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  color: #3498db;
}

/* Error message */
.error-message {
  color: red;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .category-title {
    font-size: 2rem;
  }

  .loading-spinner {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .category-title {
    font-size: 1.5rem;
  }

  .loading-spinner {
    font-size: 0.9rem;
  }
}
</style>
