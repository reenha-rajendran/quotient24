<template>
  <div class="sort-by-wrapper">
    <label class="sort-by-option">
      <input
        type="radio"
        value="relevancy"
        v-model="localSort"
        @change="updateSort"
      />
      Relevancy
    </label>
    <label class="sort-by-option">
      <input
        type="radio"
        value="popularity"
        v-model="localSort"
        @change="updateSort"
      />
      Popularity
    </label>
    <label class="sort-by-option">
      <input
        type="radio"
        value="publishedAt"
        v-model="localSort"
        @change="updateSort"
      />
      Publish date
    </label>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["getFilters"]),
    localSort: {
      get() {
        return this.getFilters.sortBy || "relevancy";
      },
      set(value) {
        this.updateFilter({ filter: "sortBy", value });
      },
    },
  },
  methods: {
    ...mapActions(["updateFilter"]),
    updateSort() {
      this.updateFilter({ filter: "sortBy", value: this.localSort });
    },
  },
};
</script>

<style scoped>
.sort-by-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.sort-by-option {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  padding: 4px 0;
}
input[type="radio"] {
  accent-color: black;
  cursor: pointer;
}
</style>
