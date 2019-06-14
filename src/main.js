import Vue from 'vue'

import App from './App'
import router from './router'

import VueRouter from "vue-router";
import VueResource from "vue-resource";

import VueMarkdown from 'vue-markdown'

import ElementUI from 'element-ui'
import './plugins/element.js'

import ECharts from 'vue-echarts'
import 'echarts-gl'


// import VueFreemde from 'vue-freemde';


Vue.config.productionTip = false;

Vue.component("vue-markdown",VueMarkdown);

Vue.component('v-chart', ECharts);

// Vue.prototype.apiDomain = "/api";
Vue.prototype.apiDomain = "http://"
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
