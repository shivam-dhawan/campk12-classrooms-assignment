import Vue from 'vue';
import VueRouter from 'vue-router';
import StudentPanel from '../views/StudentPanel.vue';
import TeacherPanel from '../views/TeacherPanel.vue';
import AdminPanel from '../views/AdminPanel.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/student',
  },
  {
    path: '/student',
    name: 'StudentPanel',
    component: StudentPanel,
  },
  {
    path: '/teacher',
    name: 'TeacherPanel',
    component: TeacherPanel,
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
