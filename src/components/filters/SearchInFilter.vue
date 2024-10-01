<template>
  <div class="search-in-wrapper">
    <label class="checkbox-label">
      <input
        type="checkbox"
        value="title"
        v-model="localSearchIn"
        @change="updateSearchIn"
      />
      Title
    </label>
    <label class="checkbox-label">
      <input
        type="checkbox"
        value="description"
        v-model="localSearchIn"
        @change="updateSearchIn"
      />
      Description
    </label>
    <label class="checkbox-label">
      <input
        type="checkbox"
        value="content"
        v-model="localSearchIn"
        @change="updateSearchIn"
      />
      Content
    </label>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["getFilters"]),
    localSearchIn: {
      get() {
        return this.getFilters.searchIn || [];
      },
      set(value) {
        this.updateFilter({ filter: "searchIn", value });
      },
    },
  },
  methods: {
    ...mapActions(["updateFilter"]),
    updateSearchIn() {
      this.updateFilter({ filter: "searchIn", value: this.localSearchIn });
    },
  },
};
</script>

<style scoped>
.search-in-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
input[type="checkbox"] {
  accent-color: #007bff;
  cursor: pointer;
}
</style>
