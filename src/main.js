import Vue from 'vue'

import App from './App'
import router from './router'

import VueRouter from "vue-router";
import VueResource from "vue-resource";

import VueMarkdown from 'vue-markdown'

import ElementUI from 'element-ui'
import './plugins/element.js'

import ECharts from 'echarts'
import 'echarts-gl'
import Graph from "./components/Graph";

import './assets/global.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.component("mdtest",mavonEditor);

Vue.use(mavonEditor)

Vue.config.productionTip = false;

Vue.component("vue-markdown",VueMarkdown);

// Vue.component('v-chart', ECharts);
Vue.component("v-graph",Graph);

Vue.prototype.$Echarts = ECharts;

// Vue.prototype.apiDomain = "/api";
Vue.prototype.apiDomain = "http://localhost:8080"
// Vue.use(VueFreemde);

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI);


new Vue({
    el: '#app',
    router,
    render: h => h(App),
    components: {
        VueMarkdown
    },
    data: {msg: 'hello world', color: 'color:aqua'},
    methods: {}, watch: {
        //监听
    }
});
