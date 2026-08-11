import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import ExperiencesView from '@/views/ExperiencesView.vue'
import SkillsView from '@/views/SkillsView.vue'
import ContactView from '@/views/ContactView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/about',
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/experiences',
      name: 'experiences',
      component: ExperiencesView
    },
    {
      path: '/skills',
      name: 'skills',
      component: SkillsView
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetailView,
    },
  ],
})

export default router
