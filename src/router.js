import VueRouter from 'vue-router'

import Vue from 'vue'

import Home from './components/Home'
import Book from './components/Book'

const router = new VueRouter({
        routes: [{
            path: '/',
            name: 'Home',
            component: Home
        },{
            path:'/book/:id',
            name:'Book',
            component:Book,
        }
        ]
    })
;


// router.beforeEach((to, from, next) => {
//
//     let arr = ["Teams","Challenges","Match","Community","OneTeam"];
//
//     let pageName = to.meta.pageName;
//     if (pageName == undefined) {
//         pageName = to.name;
//     }
//     let jwt = sessionStorage.getItem("jwt");
//     console.log("??? "+jwt)
//     if(jwt===null||jwt===''){
//         for(let i =0;i<arr.length;i++){
//             if(to.name===arr[i]){
//                 location.href="/#/Login";
//                 console.log(Vue.prototype.ro)
//                 Vue.prototype.$router.push({name:"Login"});
                // return;
            // }
        // }
    // }
    // Vue.prototype.GLOBAL.pageName = pageName;
    // Vue.prototype.GLOBAL.pageImg = '/' + pageName + '.png';
    // next();
// });

export default router
