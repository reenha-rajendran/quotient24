<template>
  <div>
    <!-- Filters Button with icon placed at the right end and active filter badge -->
    <div class="filters-button-wrapper">
      <button class="filters-button" @click.stop="toggleFilters">
        <span>Filters</span>
        <span v-if="filtersApplied" class="filter-badge">
          {{ activeFilterCount }}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="filter-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 12.414V19a1 1 0 01-.553.894l-3 1.5A1 1 0 018 20.5V12.414L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
      </button>
    </div>

    <!-- Filters Section with smooth toggle -->
    <transition name="fade">
      <div v-if="showFilters" ref="filterPopup" class="filters-container show">
        <!-- Query Filter -->
        <div>
          <label>Search Query:</label>
          <QueryFilter v-model="filters.q" @filter-query="updateSearchQuery" />
          <span v-if="showQueryError" class="error-text">
            Please enter a valid search query.
          </span>
        </div>

        <!-- Domains Filter -->
        <div>
          <label>Domains:</label>
          <DomainFilter
            v-model="filters.domains"
            @filter-domains="updateDomains"
          />
        </div>

        <!-- Search In and Sort By filters placed side by side -->
        <div class="filter-row">
          <div class="filter-item">
            <label>Sort by:</label>
            <SortFilter v-model="filters.sortBy" @filter-sort="updateSort" />
          </div>

          <div class="filter-item">
            <label>Search In:</label>
            <SearchInFilter
              v-model="filters.searchIn"
              @filter-search-in="updateSearchIn"
            />
          </div>
        </div>

        <!-- Sources Filter -->
        <div :class="{ faded: filters.region !== '' }" class="tooltip">
          <label>Sources:</label>
          <SourceFilter
            v-model="filters.sources"
            @filter-source="updateSource"
            :disabled="filters.region !== ''"
          />
          <span v-if="filters.region !== ''" class="tooltip-text">
            Selecting a region disables sources.
          </span>
        </div>

        <!-- Region Filter -->
        <div :class="{ faded: filters.sources.length > 0 }" class="tooltip">
          <label>Country:</label>
          <RegionFilter
            v-model="filters.region"
            @filter-region="updateRegion"
            :disabled="filters.sources.length > 0"
          />
          <span v-if="filters.sources.length > 0" class="tooltip-text">
            Selecting a source disables region.
          </span>
        </div>

        <!-- Date Range Picker -->
        <div>
          <label>Date Range:</label>
          <DateFilter v-model="filters.dateRange" @filter-date="updateDate" />
          <span v-if="dateError" class="error-text">
            Date range must be within the last 30 days.
          </span>
        </div>

        <!-- Clear and Apply Filters Buttons -->
        <div class="filters-action-buttons">
          <button
            class="clear-filters-button"
            :disabled="!filtersApplied"
            @click="clearLocalFilters"
          >
            Clear Filters
          </button>
          <button class="advanced-search-button" @click="applyFilters">
            Apply Filters
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DateFilter from "@/components/filters/DateFilter.vue";
import RegionFilter from "@/components/filters/RegionFilter.vue";
import SourceFilter from "@/components/filters/SourceFilter.vue";
import SortFilter from "@/components/filters/SortFilter.vue";
import QueryFilter from "@/components/filters/QueryFilter.vue";
import DomainFilter from "@/components/filters/DomainFilter.vue";
import SearchInFilter from "@/components/filters/SearchInFilter.vue";

export default {
  components: {
    DateFilter,
    RegionFilter,
    SourceFilter,
    SortFilter,
    QueryFilter,
    DomainFilter,
    SearchInFilter,
  },
  data() {
    return {
      showFilters: false,
      showQueryError: false,
      dateError: false,
      filtersApplied: false,
    };
  },
  computed: {
    ...mapGetters(["getFilters", "filtersApplied", "activeFilterCount"]),
    filters() {
      return this.getFilters;
    },
  },
  methods: {
    ...mapActions(["clearFilters", "fetchArticles", "updateFilter"]),

    toggleFilters() {
      this.showFilters = !this.showFilters;
    },

    closeFilter() {
      this.showFilters = false;
    },

    handleClickOutside(event) {
      if (
        this.showFilters &&
        this.$refs.filterPopup &&
        !this.$refs.filterPopup.contains(event.target)
      ) {
        this.closeFilter();
      }
    },

    clearLocalFilters() {
      this.clearFilters();
      this.filtersApplied = false;
    },

    applyFilters() {
      this.fetchArticles()
        .then(() => {
          this.$router.push({ name: "searchResult" }).catch((err) => {
            console.error("Navigation error:", err);
          });
        })
        .catch((error) => {
          console.error("Failed to fetch articles:", error);
          alert("There was an error fetching the articles. Please try again.");
        });

      this.showFilters = false;
    },

    updateSearchQuery() {
      if (this.filters.q.trim() === "") {
        this.showQueryError = true;
      } else {
        this.showQueryError = false;
        this.updateFilter({ filter: "q", value: this.filters.q });
        this.filtersApplied = true;
      }
    },

    updateDomains() {
      this.updateFilter({ filter: "domains", value: this.filters.domains });
      this.filtersApplied = true;
    },

    updateRegion(region) {
      this.updateFilter({ filter: "region", value: region });
      this.filtersApplied = true;
    },

    updateDate(dateRange) {
      this.updateFilter({ filter: "dateRange", value: dateRange });
      this.filtersApplied = true;
    },

    updateSource(source) {
      this.updateFilter({ filter: "sources", value: source });
      if (source) {
        this.updateFilter({ filter: "region", value: "" });
      }
      this.filtersApplied = true;
    },

    updateSort(sort) {
      this.updateFilter({ filter: "sortBy", value: sort });
      this.filtersApplied = true;
    },

    updateSearchIn(searchIn) {
      this.updateFilter({ filter: "searchIn", value: searchIn });
      this.filtersApplied = true;
    },
  },

  mounted() {
    // Add click listener to handle clicks outside of the filter container
    document.addEventListener("click", this.handleClickOutside);
    this.$store.dispatch("fetchSources");
  },

  beforeUnmount() {
    // Remove click listener when component is destroyed
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.filters-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.filters-button {
  background-color: black;
  color: white;
  padding: 8px 16px;
  border: 1px solid black;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.filters-button svg.filter-icon {
  width: 20px;
  height: 20px;
  margin-left: 8px;
}

.filter-badge {
  background-color: red;
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
  margin-left: 8px;
}

.filters-container {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 4px;
  background-color: #fff;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  align-items: start;
  transition: max-height 0.3s ease;
  overflow: hidden;
  max-height: 0;
}

.filters-container.show {
  max-height: 500px;
}

.filter-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
}

.filters-action-buttons {
  grid-column: span 6;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.clear-filters-button {
  color: red;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.advanced-search-button {
  background-color: black;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.error-text {
  color: red;
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Small and Medium screens (phones and tablets, max-width 1333px) */
@media (max-width: 1333px) {
  .filters-container {
    display: flex;
    flex-wrap: wrap; /* Allow wrapping if filters don't fit in one row */
    justify-content: flex-start; /* Align filters to the left */
    align-items: center;
    gap: 10px; /* Smaller gap for neater alignment */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: white;
    padding: 10px 15px; /* Add padding for inner spacing */
    max-height: 70vh;
    overflow-y: auto;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    margin: 10px;
  }

  .filter-row {
    display: flex;
    flex-direction: row; /* Align filters in one row */
    align-items: center;
    gap: 15px; /* Evenly spaced filters */
    width: 100%; /* Ensure the row takes full width */
  }

  .filters-button {
    font-size: 12px;
    padding: 8px 14px;
    border-radius: 20px;
  }

  .filter-badge {
    font-size: 10px;
    padding: 2px 4px;
  }

  .clear-filters-button,
  .advanced-search-button {
    font-size: 12px;
    padding: 8px 14px;
    margin: 5px;
  }

  /* Close button styling */
  .filters-container .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
}

/* Large screens (desktops, min-width 769px) */
@media (min-width: 1334px) {
  .filters-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 24px;
  }

  .filter-row {
    flex-direction: row;
    gap: 20px;
  }

  .filters-button {
    font-size: 16px;
    padding: 12px 16px;
    border-radius: 30px;
  }

  .filter-badge {
    font-size: 14px;
  }

  .clear-filters-button,
  .advanced-search-button {
    font-size: 16px;
    padding: 12px 16px;
    width: auto;
  }
}
</style>
