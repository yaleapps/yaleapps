import { uid } from 'quasar';
import ga from './analytics';
import { Router } from 'vue-router';

export default ({ router }: { router: Router }) => {
  router.afterEach((to) => {
    ga.logPage(to.path, to.name, uid());
  });
};
