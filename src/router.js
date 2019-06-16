import VueRouter from 'vue-router'


import Home from './page/Home'
import Book from './page/Book'
import test from './page/test'
import markdown from './page/markdown'
import Write from "./page/Write";


const router = new VueRouter({
        routes: [{
            path: '',
            name: 'Home',
            component: Home
        },{
            path:'/book/:id/:slice',
            name:'BookSlice',
            component:Book,
        },{
            path:'/book/:id',
            name:'BookHome',
            component:Book,
        },{
            path:'test',
            name:'test',
            component:test,
        },{
            path:'md',
            name:'md',
            component:markdown,
        },{
            path:'/Write/:fictionId',
            name:'Write',
            component:Write,
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
