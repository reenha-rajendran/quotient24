<template>
  <div class="filter-wrapper">
    <select
      v-model="localRegion"
      @change="validateCountry"
      class="dropdown"
      :disabled="localSources.length > 0"
    >
      <option value="" disabled>Select country...</option>
      <option v-for="region in regions" :key="region.code" :value="region.code">
        {{ region.name }}
      </option>
    </select>

    <!-- Show flag and X icon when a region is selected -->
    <div v-if="localRegion" class="flag-container">
      <img
        :src="getFlagUrl(localRegion)"
        alt="Region Flag"
        class="flag-image"
      />
      <!-- X icon to clear the selected country -->
      <span @click="clearSelectedCountry" class="clear-x-icon">&times;</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      regions: [
        { code: "ae", name: "United Arab Emirates" },
        { code: "ar", name: "Argentina" },
        { code: "at", name: "Austria" },
        { code: "au", name: "Australia" },
        { code: "be", name: "Belgium" },
        { code: "bg", name: "Bulgaria" },
        { code: "br", name: "Brazil" },
        { code: "ca", name: "Canada" },
        { code: "ch", name: "Switzerland" },
        { code: "cn", name: "China" },
        { code: "co", name: "Colombia" },
        { code: "cu", name: "Cuba" },
        { code: "cz", name: "Czech Republic" },
        { code: "de", name: "Germany" },
        { code: "dk", name: "Denmark" },
        { code: "eg", name: "Egypt" },
        { code: "es", name: "Spain" },
        { code: "fi", name: "Finland" },
        { code: "fr", name: "France" },
        { code: "gb", name: "United Kingdom" },
        { code: "gr", name: "Greece" },
        { code: "hk", name: "Hong Kong" },
        { code: "hu", name: "Hungary" },
        { code: "id", name: "Indonesia" },
        { code: "ie", name: "Ireland" },
        { code: "in", name: "India" },
        { code: "it", name: "Italy" },
        { code: "jp", name: "Japan" },
        { code: "kr", name: "South Korea" },
        { code: "lt", name: "Lithuania" },
        { code: "lv", name: "Latvia" },
        { code: "ma", name: "Morocco" },
        { code: "mx", name: "Mexico" },
        { code: "my", name: "Malaysia" },
        { code: "ng", name: "Nigeria" },
        { code: "nl", name: "Netherlands" },
        { code: "no", name: "Norway" },
        { code: "nz", name: "New Zealand" },
        { code: "ph", name: "Philippines" },
        { code: "pl", name: "Poland" },
        { code: "pt", name: "Portugal" },
        { code: "ro", name: "Romania" },
        { code: "rs", name: "Serbia" },
        { code: "ru", name: "Russia" },
        { code: "sa", name: "Saudi Arabia" },
        { code: "se", name: "Sweden" },
        { code: "sg", name: "Singapore" },
        { code: "si", name: "Slovenia" },
        { code: "sk", name: "Slovakia" },
        { code: "th", name: "Thailand" },
        { code: "tr", name: "Turkey" },
        { code: "tw", name: "Taiwan" },
        { code: "ua", name: "Ukraine" },
        { code: "us", name: "United States" },
        { code: "ve", name: "Venezuela" },
        { code: "za", name: "South Africa" },
      ],
    };
  },
  computed: {
    ...mapGetters(["getFilters"]),
    localSources() {
      return this.getFilters.sources || [];
    },
    localRegion: {
      get() {
        return this.getFilters.region || "";
      },
      set(value) {
        this.updateFilter({ filter: "region", value });
      },
    },
  },
  methods: {
    ...mapActions(["updateFilter"]),
    validateCountry() {
      this.updateFilter({ filter: "region", value: this.localRegion });
      this.updateFilter({ filter: "sources", value: [] });
    },
    clearSelectedCountry() {
      this.localRegion = "";
    },
    getFlagUrl(regionCode) {
      const flagMappings = {
        ae: "https://flagcdn.com/w20/ae.png",
        ar: "https://flagcdn.com/w20/ar.png",
        at: "https://flagcdn.com/w20/at.png",
        au: "https://flagcdn.com/w20/au.png",
        be: "https://flagcdn.com/w20/be.png",
        bg: "https://flagcdn.com/w20/bg.png",
        br: "https://flagcdn.com/w20/br.png",
        ca: "https://flagcdn.com/w20/ca.png",
        ch: "https://flagcdn.com/w20/ch.png",
        cn: "https://flagcdn.com/w20/cn.png",
        co: "https://flagcdn.com/w20/co.png",
        cu: "https://flagcdn.com/w20/cu.png",
        cz: "https://flagcdn.com/w20/cz.png",
        de: "https://flagcdn.com/w20/de.png",
        dk: "https://flagcdn.com/w20/dk.png",
        eg: "https://flagcdn.com/w20/eg.png",
        es: "https://flagcdn.com/w20/es.png",
        fi: "https://flagcdn.com/w20/fi.png",
        fr: "https://flagcdn.com/w20/fr.png",
        gb: "https://flagcdn.com/w20/gb.png",
        gr: "https://flagcdn.com/w20/gr.png",
        hk: "https://flagcdn.com/w20/hk.png",
        hu: "https://flagcdn.com/w20/hu.png",
        id: "https://flagcdn.com/w20/id.png",
        ie: "https://flagcdn.com/w20/ie.png",
        in: "https://flagcdn.com/w20/in.png",
        it: "https://flagcdn.com/w20/it.png",
        jp: "https://flagcdn.com/w20/jp.png",
        kr: "https://flagcdn.com/w20/kr.png",
        lt: "https://flagcdn.com/w20/lt.png",
        lv: "https://flagcdn.com/w20/lv.png",
        ma: "https://flagcdn.com/w20/ma.png",
        mx: "https://flagcdn.com/w20/mx.png",
        my: "https://flagcdn.com/w20/my.png",
        ng: "https://flagcdn.com/w20/ng.png",
        nl: "https://flagcdn.com/w20/nl.png",
        no: "https://flagcdn.com/w20/no.png",
        nz: "https://flagcdn.com/w20/nz.png",
        ph: "https://flagcdn.com/w20/ph.png",
        pl: "https://flagcdn.com/w20/pl.png",
        pt: "https://flagcdn.com/w20/pt.png",
        ro: "https://flagcdn.com/w20/ro.png",
        rs: "https://flagcdn.com/w20/rs.png",
        ru: "https://flagcdn.com/w20/ru.png",
        sa: "https://flagcdn.com/w20/sa.png",
        se: "https://flagcdn.com/w20/se.png",
        sg: "https://flagcdn.com/w20/sg.png",
        si: "https://flagcdn.com/w20/si.png",
        sk: "https://flagcdn.com/w20/sk.png",
        th: "https://flagcdn.com/w20/th.png",
        tr: "https://flagcdn.com/w20/tr.png",
        tw: "https://flagcdn.com/w20/tw.png",
        ua: "https://flagcdn.com/w20/ua.png",
        us: "https://flagcdn.com/w20/us.png",
        ve: "https://flagcdn.com/w20/ve.png",
        za: "https://flagcdn.com/w20/za.png",
      };
      return flagMappings[regionCode] || "https://flagcdn.com/w20/un.png";
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

.flag-container {
  display: flex;
  align-items: center;
}

.flag-image {
  width: 36px;
  height: 22px;
  object-fit: cover;
  border-radius: 5px;
}

.clear-x-icon {
  font-size: 24px;
  color: #ff0000;
  cursor: pointer;
  margin-left: 10px;
}

.clear-x-icon:hover {
  color: #cc0000;
}
</style>
