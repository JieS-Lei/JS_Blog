import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import nprogress from "nprogress"
import 'nprogress/nprogress.css'
import VueQuillEditor from 'vue-quill-editor'    // 调用富文本编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

Vue.use(VueQuillEditor)
router.beforeEach((to, from, next) => {
    nprogress.start();
    next();
})
router.afterEach(() => {
    nprogress.done();
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
