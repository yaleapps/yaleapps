<template>
  <q-page :class="$q.screen.gt.sm ? 'q-pa-md' : ''">
    <q-pull-to-refresh
      @refresh="pullRefresh"
      icon="breakfast_dining"
      color="white"
      bg-color="primary"
    >
      <q-card flat>
        <q-input
          class="q-mb-md"
          filled
          dense
          debounce="300"
          @click="$router.push('/menus')"
          placeholder="I Feel Like Eating..."
          style="width: 100%"
          model-value=""
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card>

      <q-banner
        inline-actions
        dense
        rounded
        class="q-mb-md bg-accent text-white"
        v-if="storeBanner && !$q.platform.is.capacitor"
      >
        <template #avatar v-if="$q.screen.gt.sm">
          <q-icon name="shopping_bag" />
        </template>
        <div class="text-subtitle2 text-center">
          Yale Buttery Book is now available on the App Store!
        </div>
        <template #action>
          <q-btn
            flat
            :icon="$q.screen.lt.sm ? 'get_app' : undefined"
            :label="$q.screen.gt.sm ? 'Install' : undefined"
            @click="openInstallDialog"
          />
          <q-btn flat icon="close" @click="storeBanner = false" />
        </template>
      </q-banner>

      <!-- <q-banner
        inline-actions
        dense
        rounded
        class="q-mb-md bg-accent text-white"
        v-if="contributeBanner && !$q.platform.is.capacitor"
      >
        <template #avatar v-if="$q.screen.gt.sm">
          <q-icon name="edit_note" />
        </template>
        <div class="text-subtitle2 text-center">
          Want to Contribute? Visit the Notion Dashboard
        </div>
        <template #action>
          <q-btn
            flat
            :icon="$q.screen.lt.sm ? 'edit_note' : undefined"
            :label="$q.screen.gt.sm ? 'Go to Dashboard' : undefined"
            href="https://bradenwong.notion.site/Contribute-to-Yale-Buttery-Book-8aadc600938c47609dd5b2c84d5935f2"
            target="_blank"
          />
          <q-btn flat icon="close" @click="contributeBanner = false" />
        </template>
      </q-banner> -->

      <q-card flat class="q-mb-md">
        <q-card-section class="text-h5">Currently Open</q-card-section>
        <q-separator inset />
        <q-card-section v-if="openButteryCardList.length !== 0">
          <ButteryCardList :butteries="openButteryCardList" />
        </q-card-section>
        <q-card-section v-else>
          <q-item>
            <q-item-section avatar>
              <q-avatar font-size="30px" icon="schedule" size="40px" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline> Oops! </q-item-label>
              <q-item-label>No Butteries Open</q-item-label>
              <q-item-label caption> Maybe try snackpass :( </q-item-label>
            </q-item-section>
          </q-item>
          <q-space />
        </q-card-section>
      </q-card>
      <q-card flat>
        <q-card-section class="text-h5">Currently Closed</q-card-section>
        <q-separator inset />
        <q-card-section v-if="closedButteryCardList.length !== 0">
          <ButteryCardList :butteries="closedButteryCardList" />
        </q-card-section>
        <q-card-section v-else>
          <q-item>
            <q-item-section avatar>
              <q-avatar font-size="30px" icon="schedule" size="40px" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>Yay!</q-item-label>
              <q-item-label>No Butteries Closed</q-item-label>
              <q-item-label caption> Today is a good day! </q-item-label>
            </q-item-section>
          </q-item>
          <q-space />
        </q-card-section>
      </q-card>
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import InstallDialog from 'src/components/InstallDialog.vue';
import ButteryCardList from 'src/components/ButteryCardList.vue';
import { useQuasar } from 'quasar';
import { refreshGcalButterySchedule } from 'src/shared/syncButteries';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { defaultButteries, loadButteriesFromSheet } from 'src/shared/butteries';
import { Buttery } from 'src/shared/butteries';
import { formatDistance } from 'date-fns';

const openInstallDialog = () => {
  $q.dialog({
    component: InstallDialog,
  });
};

const { data: butteries } = useQuery({
  queryKey: ['butteries'],
  queryFn: loadButteriesFromSheet,
  initialData: defaultButteries,
  refetchInterval: 1000 * 60 * 60 * 24,
});

const enabled = computed(() => {
  return !!butteries.value;
});

const { data: gcalButterySchedule } = useQuery({
  queryKey: ['gcalButterySchedule', butteries.value] as [string, Buttery[]],
  queryFn: ({ queryKey }) => refreshGcalButterySchedule(queryKey[1]),
  initialData: null,
  refetchInterval: 1000 * 60,
  enabled,
});

const queryClient = useQueryClient();
async function pullRefresh(done: () => void): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: ['butteries'] });
  await queryClient.invalidateQueries({ queryKey: ['gcalButterySchedule'] });
  done();
}

/*** List of butteries */
const butteryCardList = computed(() => {
  const now = new Date();
  return butteries.value.map((buttery) => {
    const currentEvent = gcalButterySchedule.value?.[buttery.calendarID].busy
      .map((event) => {
        const eventRange = {
          start: new Date(event.start),
          end: new Date(event.end),
        };
        if (eventRange.start <= now && eventRange.end >= now) return eventRange;
      })
      .filter(Boolean)
      .shift();
    const nextEvent = gcalButterySchedule.value?.[buttery.calendarID].busy
      .map((event) => {
        const eventRange = {
          start: new Date(event.start),
          end: new Date(event.end),
        };
        if (eventRange.start > now) return eventRange;
      })
      .filter(Boolean)
      .shift();
    const timeToClose = formatDistance(
      currentEvent ? currentEvent.end.getTime() - now.getTime() : 0,
      0,
      {
        addSuffix: true,
        includeSeconds: true,
      }
    );
    const timeToOpen = formatDistance(
      nextEvent ? nextEvent.start.getTime() - now.getTime() : 0,
      0,
      {
        addSuffix: true,
        includeSeconds: true,
      }
    );
    return {
      isOpen: currentEvent ? true : false,
      opensIn: currentEvent ? `Closes ${timeToClose}` : `Opens ${timeToOpen}`,
      ...buttery,
    };
  });
});

/*** List of butteries that are currently open */
const openButteryCardList = computed(() => {
  return butteryCardList.value.filter(
    (buttery) => buttery.isOpen && buttery.verified !== 'CLOSED'
  );
});
/*** List of butteries that are currently closed */
const closedButteryCardList = computed(() => {
  return butteryCardList.value.filter(
    (buttery) => !buttery.isOpen || buttery.verified === 'CLOSED'
  );
});

const storeBanner = ref(true);
const contributeBanner = ref(true);

// --- App Visibility Toggles Sync ---
const $q = useQuasar();
watch(
  () => $q.appVisible,
  (isVisible) => {
    console.log(
      isVisible ? 'App became visible' : 'App went in the background'
    );
    if (isVisible) {
      queryClient.invalidateQueries({
        queryKey: ['butteries'],
      });
      queryClient.invalidateQueries({
        queryKey: ['gcalButterySchedule'],
      });
    }
  }
);
</script>
