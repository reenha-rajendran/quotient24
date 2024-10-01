<template>
  <div class="single-date-picker-wrapper">
    <!-- Calendar Icon -->
    <div class="icon-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-calendar"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </div>

    <!-- Date Picker -->
    <flat-pickr
      v-model="dateRange"
      @change="onDateChange"
      :config="config"
      placeholder="Select Date Range"
      class="single-date-range-input"
    />

    <!-- Clear Icon (optional, only visible if date range is selected) -->
    <div
      v-if="dateRange && dateRange.length"
      class="clear-icon"
      @click="clearDateRange"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-x"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { flatPickr },
  data() {
    return {
      dateRange: [],
      config: {
        mode: "range",
        dateFormat: "Y-m-d",
        minDate: this.getDateThirtyDaysAgo(),
        maxDate: new Date(),
      },
    };
  },
  computed: {
    ...mapGetters(["getFilters"]),
    localDateRange: {
      get() {
        return this.getFilters.dateRange || { from: "", to: "" };
      },
      set(value) {
        if (
          value.from !== this.localDateRange.from ||
          value.to !== this.localDateRange.to
        ) {
          this.updateFilter({ filter: "dateRange", value });
        }
      },
    },
  },
  watch: {
    // Watch and sync Vuex with local date range
    localDateRange: {
      immediate: true,
      handler(newRange) {
        if (newRange.from && newRange.to) {
          const from = newRange.from.split("T")[0];
          const to = newRange.to.split("T")[0];
          if (
            !this.dateRange.length ||
            this.dateRange[0] !== from ||
            this.dateRange[1] !== to
          ) {
            this.dateRange = [from, to];
          }
        } else {
          this.dateRange = [];
        }
      },
    },
  },
  methods: {
    ...mapActions(["updateFilter"]),

    // Get the date 30 days ago
    getDateThirtyDaysAgo() {
      const today = new Date();
      today.setDate(today.getDate() - 30);
      return today;
    },

    // Emit selected date range when both dates are selected
    onDateChange(selectedDates) {
      if (selectedDates.length === 2) {
        const from = selectedDates[0].toISOString().split("T")[0];
        const to = selectedDates[1].toISOString().split("T")[0];
        if (
          this.localDateRange.from !== from ||
          this.localDateRange.to !== to
        ) {
          this.localDateRange = { from, to };
        }
      } else {
        this.localDateRange = { from: "", to: "" };
      }
    },

    // Clear the date range selection
    clearDateRange() {
      this.dateRange = [];
      this.localDateRange = { from: "", to: "" };
    },
  },
};
</script>

<style scoped>
.single-date-picker-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  background-color: white;
  height: 40px;
  width: 100%;
  max-width: 250px;
  box-sizing: border-box;
}

.icon-wrapper {
  cursor: pointer;
  margin-right: 8px;
}

.icon-wrapper svg {
  width: 20px;
  height: 20px;
  color: #3b3b3b;
}

.single-date-range-input {
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0;
}

.clear-icon {
  cursor: pointer;
  margin-left: 8px;
}

.clear-icon svg {
  width: 20px;
  height: 20px;
  stroke: #888;
}

.clear-icon:hover svg {
  stroke: #f00;
}

.single-date-range-input::placeholder {
  font-size: 14px;
  color: #888;
}
</style>
