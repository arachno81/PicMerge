import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Edit from '../pages/Edit.vue'
import Result from '../pages/Result.vue'

const routes = [
	{path: '/', component: Home},
	{path: '/edit', component: Edit},
	{path: '/result', component: Result},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
