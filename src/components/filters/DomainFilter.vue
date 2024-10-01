<template>
  <div class="filter-wrapper">
    <select v-model="selectedDomain" @change="addDomain" class="dropdown">
      <!-- Smaller font for the placeholder -->
      <option value="" disabled class="placeholder-option">
        Select domain...
      </option>
      <option v-for="domain in availableDomains" :key="domain" :value="domain">
        {{ domain }}
      </option>
    </select>

    <!-- Display selected domains -->
    <div v-for="domain in localDomains" :key="domain" class="added-domain">
      {{ domain }}
      <button @click="removeDomain(domain)" class="remove-button">
        Remove
      </button>
    </div>

    <!-- Checkbox for include/exclude domains -->
    <label>
      <input
        type="checkbox"
        v-model="localExcludeDomains"
        @change="updateDomains"
      />
      Exclude selected domains
    </label>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      availableDomains: [
        "techcrunch.com",
        "bbc.co.uk",
        "cnn.com",
        "nytimes.com",
        "news.ycombinator.com",
        "reuters.com",
        "forbes.com",
        "theverge.com",
        "bloomberg.com",
        "aljazeera.com",
        "wsj.com",
        "ft.com",
        "wired.com",
        "cnbc.com",
        "engadget.com",
        "huffpost.com",
        "npr.org",
        "axios.com",
        "politico.com",
        "theguardian.com",
        "latimes.com",
        "abcnews.go.com",
        "nbcnews.com",
        "foxnews.com",
        "vox.com",
        "usatoday.com",
        "cbc.ca",
        "cbsnews.com",
        "independent.co.uk",
        "sky.com",
        "buzzfeed.com",
        "msnbc.com",
        "mirror.co.uk",
        "thehill.com",
        "dailymail.co.uk",
        "telegraph.co.uk",
        "economist.com",
        "metro.co.uk",
        "vice.com",
        "businessinsider.com",
      ],
      selectedDomain: "",
    };
  },
  computed: {
    ...mapGetters(["getFilters"]),
    localDomains: {
      get() {
        return this.getFilters.domains || [];
      },
      set(value) {
        this.updateFilter({ filter: "domains", value });
      },
    },
    localExcludeDomains: {
      get() {
        return this.getFilters.excludeDomains || false;
      },
      set(value) {
        this.updateFilter({ filter: "excludeDomains", value });
      },
    },
  },
  methods: {
    ...mapActions(["updateFilter"]),
    addDomain() {
      if (
        this.selectedDomain &&
        !this.localDomains.includes(this.selectedDomain)
      ) {
        const updatedDomains = [...this.localDomains, this.selectedDomain];
        this.localDomains = updatedDomains;
      }
      this.selectedDomain = "";
    },
    removeDomain(domain) {
      const updatedDomains = this.localDomains.filter((d) => d !== domain);
      this.localDomains = updatedDomains;
    },
    updateDomains() {
      this.updateFilter({ filter: "domains", value: this.localDomains });
    },
  },
};
</script>

<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.dropdown {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 8px;
}

.added-domain {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f9f9f9;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
.remove-button {
  background-color: transparent;
  border: none;
  color: #ff0000;
  cursor: pointer;
  font-size: 14px;
}
.remove-button:hover {
  color: #cc0000;
}
</style>
