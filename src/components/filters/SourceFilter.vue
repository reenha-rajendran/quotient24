<template>
  <div class="filter-wrapper">
    <!-- Dropdown for sources -->
    <select
      v-model="selectedSource"
      @change="addSource"
      class="dropdown"
      :disabled="selectedRegion !== ''"
    >
      <option value="" disabled>Select source...</option>
      <option v-for="source in sources" :key="source.id" :value="source">
        {{ source.name }}
      </option>
    </select>

    <!-- Display selected sources -->
    <div
      v-for="source in selectedSources"
      :key="source.id"
      class="added-source"
    >
      {{ source.name }}
      <button @click="removeSource(source.id)" class="remove-button">
        Remove
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      selectedSource: "",
      selectedSources: [],
    };
  },
  computed: {
    ...mapGetters(["getSources", "getFilters"]),
    sources() {
      return this.getSources;
    },
    selectedRegion() {
      return this.getFilters.region || "";
    },
  },
  watch: {
    "getFilters.sources": {
      immediate: true,
      handler(newSources) {
        if (Array.isArray(newSources)) {
          this.selectedSources = this.sources.filter((source) =>
            newSources.includes(source.id)
          );
        } else {
          this.selectedSources = [];
        }
      },
    },
  },
  methods: {
    ...mapActions(["updateFilter", "clearFilters"]),
    addSource() {
      if (
        this.selectedSource &&
        !this.selectedSources.some(
          (source) => source.id === this.selectedSource.id
        )
      ) {
        this.selectedSources.push(this.selectedSource);
        this.updateSources();
      }
      this.selectedSource = "";
    },
    removeSource(sourceId) {
      this.selectedSources = this.selectedSources.filter(
        (source) => source.id !== sourceId
      );
      this.updateSources();
    },
    updateSources() {
      this.updateFilter({
        filter: "sources",
        value: this.selectedSources.map((source) => source.id),
      });

      // Clear region filter when sources are selected to prevent conflicts
      this.updateFilter({
        filter: "region",
        value: "",
      });
    },
    clearLocalFilters() {
      this.clearFilters();

      // Clear local sources
      this.selectedSources = [];
      this.selectedSource = "";
    },
  },
};
</script>

<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dropdown {
  padding: 5px;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.added-source {
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
  color: red;
  cursor: pointer;
}

.remove-button:hover {
  color: darkred;
}
</style>
