import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from "axios";

function handleApiError(error) {
  if (error.response) {
    return `Error ${error.response.status}: ${error.response.data.message}`;
  } else if (error.request) {
    return "No response received from the server.";
  } else {
    return `Request Error: ${error.message}`;
  }
}

export default createStore({
  plugins: [createPersistedState()],
  state: {
    filters: {
      page: 1,
      pageSize: 10,
      q: "",
      domains: "",
      excludeDomains: false,
      dateRange: { from: "", to: "" },
      region: "",
      searchIn: [],
      sortBy: "relevancy",
      sources: [],
    },
    articles: [],
    totalResults: 0,
    error: null,
    sources: [],
  },
  getters: {
    getArticles(state) {
      return state.articles;
    },
    getError(state) {
      return state.error;
    },
    getFilters(state) {
      return state.filters;
    },
    getSources(state) {
      return state.sources;
    },
    getTotalResults(state) {
      return state.totalResults;
    },
    filtersApplied(state) {
      return (
        state.filters.q ||
        state.filters.domains.length > 0 ||
        state.filters.region ||
        (state.filters.dateRange.from && state.filters.dateRange.to) ||
        state.filters.sources.length > 0 ||
        state.filters.searchIn.length > 0 ||
        state.filters.excludeDomains
      );
    },
    activeFilterCount(state) {
      let count = 0;
      if (state.filters.q) count++;
      if (state.filters.domains.length > 0) count++;
      if (state.filters.excludeDomains) count++;
      if (state.filters.region) count++;
      if (state.filters.dateRange.from && state.filters.dateRange.to) count++;
      if (state.filters.sources.length > 0) count++;
      if (state.filters.searchIn.length > 0) count++;
      return count;
    },
  },
  mutations: {
    SET_ARTICLES(state, articles) {
      state.articles = articles;
    },
    SET_TOTAL_RESULTS(state, totalResults) {
      state.totalResults = totalResults;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_PAGE(state, page) {
      state.filters.page = page;
    },
    SET_PAGE_SIZE(state, pageSize) {
      state.filters.pageSize = pageSize;
    },
    SET_SOURCES(state, sources) {
      state.sources = sources;
    },
    UPDATE_FILTER(state, { filter, value }) {
      if (filter === "dateRange") {
        state.filters.dateRange = { ...value };
      } else {
        state.filters[filter] = value;
      }

      if (filter === "region" && value !== "") {
        state.filters.sources = [];
        state.filters.domains = "";
      }
      if (filter === "sources" && value.length > 0) {
        state.filters.region = "";
      }
    },
    CLEAR_FILTERS(state) {
      state.filters.q = "";
      state.filters.domains = "";
      state.filters.excludeDomains = false;
      state.filters.region = "";
      state.filters.dateRange = { from: "", to: "" };
      state.filters.sources = [];
      state.filters.searchIn = [];
      state.filters.sortBy = "relevancy";
      state.filters.page = 1;
      state.filters.pageSize = 10;
    },
  },
  actions: {
    async fetchArticles({ state, commit }) {
      const params = {
        pageSize: state.filters.pageSize,
        page: state.filters.page,
      };

      if (state.filters.q) params.q = state.filters.q;
      if (state.filters.domains) params.domains = state.filters.domains;
      if (state.filters.excludeDomains) params.excludeDomains = true;
      if (state.filters.dateRange.from && state.filters.dateRange.to) {
        params.from = state.filters.dateRange.from;
        params.to = state.filters.dateRange.to;
      }

      let endpoint = "everything";
      if (state.filters.region) {
        params.country = state.filters.region;
        delete params.sources;
        endpoint = "top-headlines";
      } else if (state.filters.sources.length > 0) {
        params.sources = state.filters.sources.join(",");
        delete params.country;
      }

      if (state.filters.sortBy) params.sortBy = state.filters.sortBy;
      if (state.filters.searchIn.length > 0) {
        params.searchIn = state.filters.searchIn.join(",");
      }

      try {
        const response = await axios.get(
          `https://newsapi.org/v2/${endpoint}?apiKey=${process.env.VUE_APP_NEWS_API_KEY}`,
          { params }
        );
        commit("SET_ARTICLES", response.data.articles);
        commit("SET_TOTAL_RESULTS", response.data.totalResults || 0);
        commit("SET_ERROR", null);
      } catch (error) {
        commit("SET_ERROR", handleApiError(error));
      }
    },

    async fetchSources({ commit }) {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/sources?apiKey=${process.env.VUE_APP_NEWS_API_KEY}`
        );
        commit("SET_SOURCES", response.data.sources);
      } catch (error) {
        commit("SET_ERROR", handleApiError(error));
      }
    },

    updateFilter({ commit }, payload) {
      commit("UPDATE_FILTER", payload);
    },

    clearFilters({ commit }) {
      commit("CLEAR_FILTERS");
    },
  },
});
