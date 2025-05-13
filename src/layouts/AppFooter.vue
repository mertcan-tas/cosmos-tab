<template>
  <v-layout>
    <v-bottom-navigation
      v-model="value"
      height="66"
      elevation="0"
      mode="shift"
      grow
    >
      <v-btn>
        <v-icon size="25">mdi-television-play</v-icon>
        <span class="text-center text-caption font-weight-bold">Video</span>
      </v-btn>

      <v-btn>
        <v-icon size="25">mdi-music-note</v-icon>
        <span class="text-center text-caption font-weight-bold">Music</span>
      </v-btn>

      <v-btn>
        <v-icon size="25">mdi-book</v-icon>
        <span class="text-center text-caption font-weight-bold">Book</span>
      </v-btn>

      <v-btn>
        <v-icon size="25">mdi-image</v-icon>
        <span class="text-center text-caption font-weight-bold">Image</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      value: 1,
    };
  },
};
</script>
