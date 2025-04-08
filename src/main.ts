import { createApp } from 'vue';
import './plugins/assets';
import { useAuthStore } from '@/store/modules/auth';
import { setupAppVersionNotification, setupDayjs, setupIconifyOffline, setupLoading, setupNProgress } from './plugins';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupI18n } from './locales';
import App from './App.vue';

async function setupApp() {
  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = createApp(App);

  setupStore(app);

  await setupRouter(app);

  setupI18n(app);

  setupAppVersionNotification();

  app.directive('permission', {
    mounted(el, binding) {
      const admin = useAuthStore().userInfo.isAdmin;
      if (admin) {
        return;
      }
      const permissions: string[] = useAuthStore().userInfo.permissions;
      const str = binding.value as string;
      const expectPermissions: string[] = str.split('||');
      const hasPermission = expectPermissions.some(permission => permissions.includes(permission.trim()));
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  });

  app.mount('#app');
}

setupApp();
