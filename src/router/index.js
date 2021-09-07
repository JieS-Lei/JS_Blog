import Vue from 'vue'
import VueRouter from 'vue-router'
import routeList from "./routeList";

Vue.use(VueRouter)

const routes = routeList.map(item => {
    item.component = () => import('../views/' + item.name);
    return item;
})

const router = new VueRouter({
    routes
})

export default router
