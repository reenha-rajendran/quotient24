<template>
  <div class="container mx-auto p-4">
    <!-- Back to Home Button -->
    <div class="back-to-home">
      <router-link to="/" class="back-button">← Back to Home</router-link>
    </div>

    <!-- Category Title -->
    <h1 class="category-title">{{ formatCategoryTitle(categoryName) }} News</h1>

    <!-- Featured News Section -->
    <section class="featured-news mb-8">
      <div class="featured-grid">
        <div
          v-for="(news, index) in newsArticles"
          :key="index"
          class="featured-news-item"
          @click="openArticle(news.url)"
        >
          <img
            :src="news.urlToImage"
            alt="News Image"
            class="featured-image"
            loading="lazy"
          />
          <div class="article-content">
            <h3 class="article-title">{{ news.title }}</h3>
            <p class="article-description">{{ news.description }}</p>
            <p class="article-info">
              <span class="article-source">
                {{ news.source?.name || "Unknown Source" }}
              </span>
              |
              <span class="article-date">{{
                formatDate(news.publishedAt)
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newsArticles: [],
      categoryName: "",
    };
  },
  mounted() {
    this.categoryName = this.$route.params.name || "world";
    this.fetchNews();
  },
  methods: {
    async fetchNews() {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=${this.categoryName}&apiKey=${process.env.VUE_APP_NEWS_API_KEY}`
        );
        this.newsArticles = response.data.articles;
      } catch (error) {
        console.error("Error fetching news:", error);
        this.newsArticles = [];
      }
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
    formatCategoryTitle(category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    },
  },
};
</script>

<style scoped>
/* General Styling */
.container {
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
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

@media (max-width: 600px) {
  .back-button {
    font-size: 1rem;
  }
}

/* Category Title */
.category-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  font-weight: 700;
  color: #2c3e50;
  text-transform: capitalize;
}

@media (max-width: 1024px) {
  .category-title {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .category-title {
    font-size: 1.5rem;
  }
}

/* Featured News Grid */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .featured-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .featured-grid {
    grid-template-columns: 1fr;
  }
}

/* Featured News Item */
.featured-news-item {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.featured-news-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .featured-news-item {
    padding: 1rem;
  }
}

/* Featured Image */
.featured-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .featured-image {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .featured-image {
    height: 120px;
  }
}

/* Article Content */
.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #34495e;
}

@media (max-width: 768px) {
  .article-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .article-title {
    font-size: 1rem;
  }
}

.article-description {
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 15px;
  line-height: 1.5;
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
  color: #95a5a6;
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
  color: #2980b9;
}

.article-date {
  font-style: italic;
  color: #7f8c8d;
}
</style>
