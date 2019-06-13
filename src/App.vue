<template>
    <div>
        <el-menu
                mode="horizontal"
                default-active="/"
                :router="true"
                :collapse-transition="false"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <el-menu-item v-for="item in pages" :key='item.value' :index="item.path">{{item.name}}
            </el-menu-item>
           <el-menu-item style="float: right" index="/login">
                Login
            </el-menu-item>
            <el-menu-item style="float: right" index="/signup">
                Signup
            </el-menu-item>
        </el-menu>
        <el-container>
            <router-view></router-view>
        </el-container>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                pages: [
                    {name: "Home",path:"/", active: false},
                    // {name: "Shop", active: false}
                ],
                username: undefined,
            }
        },
        mounted: function () {
            this.username = sessionStorage.getItem("username");
        }, methods: {
            checkLogin: function () {
                console.log(sessionStorage.getItem("jwt"));
                this.username = sessionStorage.getItem("username");
                return sessionStorage.getItem('jwt') === null || sessionStorage.getItem('jwt') === ''
            },
            updatePageName: function (name) {
                console.log("1");
                this.pageName = name;
            },

            logout: function () {
                sessionStorage.clear();
                location.reload();
            }
        },
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
