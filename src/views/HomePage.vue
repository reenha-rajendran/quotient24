<template>
  <div class="container mx-auto p-4 pt-0">
    <!-- Sticky Header with Branding and Date/Time -->
    <header class="sticky-header">
      <button class="hamburger" @click="toggleMenu">
        <!-- Hamburger Icon -->
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      <div class="branding">
        <img
          src="../assets/quotient24.png"
          alt="News Portal Logo"
          class="logo"
        />
      </div>
      <nav :class="{ open: isMenuOpen }">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/category/politics">Politics</router-link></li>
          <li><router-link to="/category/business">Business</router-link></li>
          <li>
            <router-link to="/category/technology">Technology</router-link>
          </li>
          <li>
            <router-link to="/category/entertainment"
              >Entertainment</router-link
            >
          </li>
        </ul>
      </nav>
      <div class="date-time">
        {{ currentDate }}
      </div>
    </header>

    <!-- Filters Section -->
    <div class="header-controls">
      <SearchFilterView @apply-filters="applyFilters" class="filter-button" />
    </div>

    <!-- Transition Wrapper -->
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>

    <!-- Loading Indicator -->
    <div v-if="isFetching" class="loading-spinner">Loading...</div>

    <!-- Breaking News Section -->
    <section class="breaking-news enhanced-breaking-news mb-8 pt-0">
      <div class="breaking-news-header">
        <span class="live-icon">🔴</span>
        <h2 class="breaking-news-title">BREAKING NEWS</h2>
      </div>

      <div class="ticker-container">
        <div class="ticker">
          <div
            v-for="(news, index) in visibleBreakingNews"
            :key="index"
            class="ticker-item"
            @click="openArticle(news.url)"
          >
            {{ news.title }}
          </div>
        </div>
      </div>
    </section>

    <!-- Hero Section (Top News) -->
    <section class="hero mb-8" v-if="heroNews && heroNews.urlToImage">
      <div class="hero-content">
        <img :src="heroNews.urlToImage" alt="Hero Image" class="hero-image" />
        <div class="hero-text">
          <h2>{{ heroNews.title }}</h2>
          <p>{{ heroNews.description }}</p>
        </div>
      </div>
    </section>

    <!-- Featured News Section -->
    <section class="featured-news mb-8">
      <h2 class="font-bold">TOP STORIES</h2>
      <div class="featured-grid">
        <div
          v-for="(news, index) in filteredTopStories"
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
            <h3>{{ news.title }}</h3>
            <p class="article-description">{{ news.description }}</p>
            <p class="article-info">
              <span class="article-source">{{
                news.source?.name || "Unknown Source"
              }}</span>
              |
              <span class="article-date">{{
                formatDate(news.publishedAt)
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- International News Section with Load More -->
    <section class="international-news mb-8">
      <h2 class="font-bold">INTERNATIONAL NEWS</h2>
      <div class="news-grid">
        <div
          v-for="(news, index) in filteredInternationalNews"
          :key="index"
          class="news-item"
          @click="openArticle(news.url)"
        >
          <img
            :src="news.urlToImage"
            alt="News Image"
            class="news-image"
            loading="lazy"
          />
          <div class="article-content">
            <h3>{{ news.title }}</h3>
            <p class="article-description">{{ news.description }}</p>
            <p class="article-info">
              <span class="article-source">{{
                news.source?.name || "Unknown Source"
              }}</span>
              |
              <span class="article-date">{{
                formatDate(news.publishedAt)
              }}</span>
            </p>
          </div>
        </div>
      </div>
      <button
        v-if="!endOfArticles"
        class="load-more-btn"
        @click="loadMore('international')"
      >
        More International News
      </button>
      <p v-else class="end-of-articles">End of Articles</p>
    </section>

    <!-- Infinite Scroll Trigger -->
    <div class="infinite-scroll-trigger" ref="infiniteScrollTrigger"></div>
  </div>
</template>
<script>
import axios from "axios";
import throttle from "lodash/throttle";
import SearchFilterView from "../views/SearchFilterView.vue";

export default {
  components: {
    SearchFilterView,
  },
  data() {
    return {
      breakingNews: [],
      visibleBreakingNews: [],
      topStories: [],
      heroNews: {},
      breakingNewsIndex: 0,
      internationalNews: [],
      currentDate: "",
      pageInternational: 1,
      isFetching: false,
      endOfArticles: false,
      isMenuOpen: false,
    };
  },
  computed: {
    filteredTopStories() {
      return this.topStories.filter(
        (news) => news.urlToImage && news.url && news.url !== this.heroNews.url
      );
    },
    filteredInternationalNews() {
      return this.internationalNews.filter(
        (news) => news.urlToImage && news.url
      );
    },
  },
  mounted() {
    this.fetchBreakingNews();
    this.fetchTopStories();
    this.fetchHeroNews();
    this.fetchInternationalNews();
    this.startBreakingNewsTicker();
    this.updateTime();

    this.$nextTick(() => {
      if (this.$refs.infiniteScrollTrigger) {
        window.addEventListener("scroll", this.handleInfiniteScroll);
      }
    });

    setInterval(this.updateTime, 60000);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleInfiniteScroll);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    applyFilters(filters) {
      console.log("Applying filters:", filters);
      this.fetchFilteredArticles(filters);
    },
    async fetchFilteredArticles(filters) {
      console.log("Fetching articles with filters:", filters);
    },
    async fetchBreakingNews() {
      this.isFetching = true;
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.VUE_APP_NEWS_API_KEY}`
        );
        this.breakingNews = response.data.articles;
        this.visibleBreakingNews = this.breakingNews.slice(0, 5);
      } catch (error) {
        console.error("Error fetching breaking news:", error);
      } finally {
        this.isFetching = false;
      }
    },
    async fetchTopStories() {
      this.isFetching = true;
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.VUE_APP_NEWS_API_KEY}`
        );
        this.topStories = response.data.articles.slice(1, 7);
      } catch (error) {
        console.error("Error fetching top stories:", error);
      } finally {
        this.isFetching = false;
      }
    },
    async fetchHeroNews() {
      this.isFetching = true;
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.VUE_APP_NEWS_API_KEY}`
        );
        this.heroNews = response.data.articles[0];
      } catch (error) {
        console.error("Error fetching hero news:", error);
      } finally {
        this.isFetching = false;
      }
    },
    async fetchInternationalNews() {
      this.isFetching = true;
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=general&page=${this.pageInternational}&apiKey=${process.env.VUE_APP_NEWS_API_KEY}`
        );

        const newArticles = response.data.articles;

        if (newArticles.length === 0) {
          this.endOfArticles = true;
        } else {
          this.internationalNews = [...this.internationalNews, ...newArticles];
        }
      } catch (error) {
        console.error("Error fetching international news:", error);
      } finally {
        this.isFetching = false;
      }
    },
    openArticle(url) {
      window.open(url, "_blank");
    },
    loadMore(section) {
      if (section === "international") {
        this.pageInternational++;
        this.fetchInternationalNews();
      }
    },
    startBreakingNewsTicker() {
      setInterval(() => {
        this.breakingNewsIndex =
          (this.breakingNewsIndex + 1) % this.breakingNews.length;
        this.visibleBreakingNews = this.breakingNews.slice(
          this.breakingNewsIndex,
          this.breakingNewsIndex + 5
        );
      }, 5000);
    },
    updateTime() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      this.currentDate = new Date().toLocaleDateString("en-US", options);
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
    handleInfiniteScroll: throttle(function () {
      const trigger = this.$refs.infiniteScrollTrigger;

      if (!trigger || typeof trigger.getBoundingClientRect !== "function") {
        return;
      }

      const triggerPosition = trigger.getBoundingClientRect().top;

      if (triggerPosition < window.innerHeight && !this.isFetching) {
        this.isFetching = true;
        this.loadMore("international");
        setTimeout(() => {
          this.isFetching = false;
        }, 1000);
      }
    }, 200),
  },
};
</script>

<style scoped>
/* Logo Image */
.logo {
  height: 70px;
  width: auto;
}

/* Hide logo on small screens */
@media (max-width: 768px) {
  .logo {
    display: none;
  }
}

/* Loading Spinner */
.loading-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  color: black;
  font-family: "Times New Roman", serif;
}

/* Date and Time */
.date-time {
  text-align: right;
  font-size: 0.9rem;
  font-weight: light;
  font-style: italic;
}

/* Header Controls */
.header-controls {
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
}

/* Hero Section */
.hero {
  background-color: #f5f5f5;
  display: block;
}

.hero-content {
  position: relative;
  display: flex;
  align-items: center;
}

.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

/* Hero Image smaller on small screens */
@media (max-width: 768px) {
  .hero-image {
    height: auto;
  }
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 1rem;
  max-width: 50%;
}

.hero-text h2 {
  font-size: 2rem;
}

.hero-text p {
  font-size: 1.2rem;
}

/* Responsive Hero Text for Smaller Screens */
@media (max-width: 768px) {
  .hero-text {
    max-width: 90%;
    padding: 0.5rem;
    left: 10px;
    transform: translateY(-50%);
  }

  .hero-text h2 {
    font-size: 1.5rem;
  }

  .hero-text p {
    font-size: 1rem;
  }
}

/* Sticky Header */

.sticky-header {
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 1000;
  box-shadow: 0 4px 2px -2px gray;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
}

nav ul li a {
  color: black;
  font-weight: bold;
  text-decoration: none;
  font-size: large;
}

nav ul li a:hover {
  text-decoration: underline;
}
/* Hamburger Button */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  height: 24px;
  width: 30px;
  cursor: pointer;
  border: none;
  background: none;
}

.hamburger .bar {
  width: 100%;
  height: 3px;
  background-color: black;
  transition: all 0.3s ease;
}

/* Hide menu on small screens */
nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
}

nav {
  display: flex;
}

nav.open ul {
  display: block;
}

@media (max-width: 768px) {
  nav ul {
    display: none;
    flex-direction: column;
    gap: 1rem;
  }

  nav.open ul {
    display: flex;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    width: 100%;
    padding: 1rem;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  }

  /* Show hamburger icon on smaller screens */
  .hamburger {
    display: flex;
  }

  .branding {
    flex: 1;
  }

  nav {
    position: relative;
  }
}

/*  Breaking News Section */
.enhanced-breaking-news {
  position: relative;
}

/* Breaking News Header */
.breaking-news-header {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.breaking-news-title {
  margin-left: 10px;
}

.live-icon {
  font-size: 1.2rem;
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}

/* Ticker Container */
.ticker-container {
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  height: 40px;
  background-color: #e00d2a;
  color: white;
  padding: 5px 0;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.ticker {
  display: flex;
  animation: scroll 40s linear infinite;
}

.ticker-item {
  white-space: nowrap;
  padding: 0 30px;
  font-size: 1rem;
  cursor: pointer;
}

/* Scroll animation */
@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .breaking-news-header {
    font-size: 1.2rem;
  }
  .ticker-item {
    font-size: 0.9rem;
  }
}

/* Featured News */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

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

.featured-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.article-content {
  font-size: 1.3rem;
  font-weight: 600;
}

.article-description {
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #555;
  font-weight: 100;
}

.article-info {
  font-size: 0.875rem;
  color: #777;
}

.article-source {
  font-weight: bold;
}

.article-date {
  font-style: italic;
}

/* News Grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.news-item {
  background-color: #fff;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: transform 0.3s;
  cursor: pointer;
}

.news-item:hover {
  transform: translateY(-5px);
}

.news-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* Buttons */
.load-more-btn {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: black;
  color: white;
  text-align: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.load-more-btn:hover {
  background-color: black;
}

/* End of Articles */
.end-of-articles {
  text-align: center;
  font-family: "Times New Roman", serif;
  color: #555;
  margin-top: 1rem;
}

/* Infinite Scroll Trigger */
.infinite-scroll-trigger {
  height: 50px;
  visibility: hidden;
}

/* Transition Styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .logo {
    height: 50px;
  }
}

/* Media Queries for Sticky Header (Small Screens) */
@media (max-width: 768px) {
  .sticky-header {
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
  }

  /* Center the logo */
  .branding {
    flex-grow: 1;
    text-align: center;
  }

  /* Hamburger button on the left */
  .hamburger {
    display: flex;
    order: -1;
  }

  /* Smaller logo on mobile */
  .logo {
    height: 50px;
  }

  /* Hide the default menu on small screens */
  nav ul {
    display: none;
  }

  /* Show the nav when the menu is toggled */
  nav.open ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    width: 100%;
    padding: 1rem;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  }
}

/* Media Queries for Sticky Header (Medium Screens) */
@media (min-width: 769px) and (max-width: 992px) {
  .sticky-header {
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
  }

  /* Center the logo */
  .branding {
    flex-grow: 1;
    text-align: center;
  }

  /* Display the hamburger button but larger */
  .hamburger {
    display: flex;
    order: -1;
    width: 35px;
    height: 28px;
  }

  .hamburger .bar {
    height: 4px;
  }

  /* Resize the logo slightly for medium screens */
  .logo {
    height: 60px;
  }

  nav ul {
    display: none;
  }

  nav.open ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    width: 80%;
    padding: 1rem;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  }
}

/* General Hero Section Styles */
.hero {
  background-color: #f5f5f5;
  display: block;
  margin-bottom: 2rem;
}

.hero-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 1rem;
  max-width: 50%;
}

.hero-text h2 {
  font-size: 2rem;
}

.hero-text p {
  font-size: 1.2rem;
}

/* Hero Section for Small Screens */
@media (max-width: 768px) {
  .hero-image {
    height: auto;
  }

  .hero-text {
    max-width: 90%;
    padding: 0.5rem;
    left: 10px;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.7);
  }

  .hero-text h2 {
    font-size: 1.5rem;
  }

  .hero-text p {
    font-size: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 992px) {
  .hero-content {
    flex-direction: column;
    padding: 1rem;
  }

  .hero-image {
    height: 350px;
    object-fit: cover;
  }

  .hero-text {
    max-width: 80%;
    padding: 1.5rem;
    left: 0;
    text-align: center;
    top: auto;
    bottom: 20px;
    transform: none;
  }

  .hero-text h2 {
    font-size: 1.8rem;
  }

  .hero-text p {
    font-size: 1.1rem;
  }
}
</style>
