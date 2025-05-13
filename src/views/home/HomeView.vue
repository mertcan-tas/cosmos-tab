<template>
  <BaseLayput>
    <v-container fluid class="pa-0 ma-0" style="height: 100vh">
      <v-row no-gutters class="fill-height">
        <v-col cols="12" class="fill-height position-relative">
          <v-carousel
            v-model="currentArea"
            hide-delimiters
            height="100%"
            show-arrows="false"
            class="h-100"
          >
            <v-carousel-item
              v-for="(area, index) in areas"
              :key="index"
              :src="area.background"
              cover
            >
              <div v-if="currentArea === index">
                <v-container class="mt-10 w-50">
                  <v-row>
                    <!-- Uygulama Kartları -->
                    <v-col
                      v-for="app in area.apps"
                      :key="app.name"
                      cols="12"
                      sm="4"
                      md="4"
                      lg="2"
                      xl="1"
                      class="d-flex justify-center pa-1"
                    >
                      <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                          <v-card
                            link
                            :href="app.url"
                            v-bind="props"
                            :color="isHovering ? 'surface' : 'transparent'"
                            elevation="0"
                            height="120"
                            width="87"
                            class="d-flex flex-column align-center justify-center bd-1 no-select cursor-pointer"
                          >
                            <v-avatar
                              class="pa-2 bd-1"
                              color="white"
                              size="56"
                              :image="app.icon"
                            ></v-avatar>

                            <div class="mt-2 text-caption font-weight-bold">
                              {{
                                app.name.length > 8
                                  ? app.name.slice(0, 8) + "."
                                  : app.name
                              }}
                            </div>
                          </v-card>
                        </template>
                      </v-hover>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      lg="2"
                      xl="1"
                      class="d-flex justify-center pa-1"
                    >
                      <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                          <v-card
                            @click="openAddAppDialog"
                            v-bind="props"
                            :color="isHovering ? 'surface' : 'transparent'"
                            elevation="0"
                            height="120"
                            width="87"
                            class="d-flex flex-column align-center justify-center bd-1 no-select cursor-pointer"
                          >
                            <v-avatar
                              class="pa-2 bd-1"
                              color="white"
                              size="56"
                              icon="mdi-plus"
                            ></v-avatar>

                            <div
                              class="mt-2 text-center text-caption font-weight-bold"
                            >
                              Ekle
                            </div>
                          </v-card>
                        </template>
                      </v-hover>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-carousel-item>
          </v-carousel>

          <div
            class="custom-dots position-absolute bottom-0 left-0 right-0 d-flex justify-center pb-4"
          >
            <v-chip-group
              v-model="currentArea"
              mandatory
              selected-class="bg-primary"
              class="transparent"
            >
              <v-chip
                v-for="(area, i) in areas"
                :key="i"
                :value="i"
                class="mx-1 font-weight-bold"
                color="white"
                variant="outlined"
              >
                {{ area.label }}
              </v-chip>
            </v-chip-group>

            <v-chip-group>
              <v-chip
                class="mx-1"
                color="white"
                variant="outlined"
                @click="openAddDialog"
              >
                <v-icon icon="mdi-plus-circle"></v-icon>
                <div class="mx-1 font-weight-bold">Alan Ekle</div>
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Alan Ekle Dialog -->
          <v-dialog v-model="dialogVisible" max-width="500">
            <v-card class="pa-4">
              <v-card-title class="text-h6">Yeni Alan Ekle</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="newArea.label"
                  label="Alan Etiketi"
                  variant="outlined"
                  dense
                  class="mb-3"
                />
                <v-text-field
                  v-model="newArea.background"
                  label="Arka Plan Resmi URL"
                  variant="outlined"
                  dense
                />
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  color="grey"
                  variant="text"
                  @click="dialogVisible = false"
                >
                  İptal
                </v-btn>
                <v-btn color="primary" @click="saveNewArea">Kaydet</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Uygulama Ekle Dialog -->
          <v-dialog v-model="appDialogVisible" max-width="500">
            <v-card class="pa-4">
              <v-card-title class="text-h6">Yeni Uygulama Ekle</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="newApp.title"
                  label="Başlık"
                  variant="outlined"
                  dense
                  class="mb-3"
                />
                <v-text-field
                  v-model="newApp.url"
                  label="URL"
                  placeholder="https://örnek.com"
                  variant="outlined"
                  dense
                />
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  color="grey"
                  variant="text"
                  @click="appDialogVisible = false"
                >
                  İptal
                </v-btn>
                <v-btn color="primary" @click="saveNewApp">Kaydet</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </BaseLayput>
</template>

<script>
import { useAreaStore } from "@/plugins/stores/area-store.js";

export default {
  name: "CustomCarousel",
  data() {
    return {
      currentArea: 0,
      dialogVisible: false,
      appDialogVisible: false,
      newArea: {
        label: "",
        background: "",
      },
      newApp: {
        title: "",
        url: "",
      },
    };
  },
  setup() {
    const areaStore = useAreaStore();

    areaStore.loadFromLocalStorage();

    return {
      areaStore,
    };
  },
  computed: {
    areas() {
      return this.areaStore.areas;
    },
  },
  methods: {
    openAddDialog() {
      this.newArea = {
        label: "",
        background: "",
      };
      this.dialogVisible = true;
    },
    saveNewArea() {
      if (!this.newArea.label) {
        alert("Lütfen alan adını girin.");
        return;
      }

      this.areaStore.addArea({
        label: this.newArea.label,
        background: this.newArea.background || "",
        apps: [],
      });

      this.currentArea = this.areas.length - 1;
      this.dialogVisible = false;
    },
    openAddAppDialog() {
      this.newApp = {
        title: "",
        url: "",
      };
      this.appDialogVisible = true;
    },
    saveNewApp() {
      if (!this.newApp.title || !this.newApp.url) {
        alert("Lütfen tüm alanları doldurun.");
        return;
      }

      this.areaStore.addAppToArea(
        this.currentArea,
        this.newApp.title,
        this.newApp.url
      );
      this.appDialogVisible = false;
    },
  },
};
</script>
