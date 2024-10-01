<template>
  <div class="filter-wrapper">
    <input
      type="text"
      id="searchQuery"
      v-model="localQuery"
      @input="validateQuery"
      class="filter-input"
      placeholder="Enter search query"
    />
    <span class="star-message"
      >* Please fill this field for more accurate search results.</span
    >
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["getFilters"]),
    localQuery: {
      get() {
        return this.getFilters.q || "";
      },
      set(value) {
        this.updateFilter({ filter: "q", value });
      },
    },
  },
  methods: {
    ...mapActions(["updateFilter"]),
    validateQuery() {
      if (this.localQuery.trim() !== "") {
        this.updateFilter({ filter: "q", value: this.localQuery });
      }
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
.filter-input {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
.star-message {
  font-size: 12px;
  color: #ff0000;
  margin-top: 4px;
}
</style>
