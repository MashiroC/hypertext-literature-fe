<template>
    <div style="width:100%">
        <div style="width:100%" class="flex-left">
            <div style="width:50%;height:500px">
                <v-graph id="test" :gData="graphData" :onActive.sync="activeNode"/>
            </div>
            <div class="slice" ref="slice">
                <mavon-editor v-model="text" />

            </div>
        </div>
        <div>{{activeNode}}</div>
        <el-button @click="testFun1">test1</el-button>
        <el-button @click="testFun2">test2</el-button>

    </div>
</template>

<script>
    import MarkDown from 'vue-meditor'

    export default {
        name: "App",
        data() {
            return {
                activeNode: 6,
                choose:"",
                fictionId: null,
                title: "",
                text: "",
                graphData: {
                    links: [{"source": "支线1", "target": "支线3"}, {"source": "序章", "target": "支线2"}, {
                        "source": "序章",
                        "target": "支线1"
                    }, {"source": "支线2", "target": "支线3"}],
                    node: [{"x": 100, "y": 100, "sliceId": 5, "name": "序章", "itemStyle": {"color": "red"}}, {
                        "x": 300,
                        "y": 100,
                        "sliceId": 6,
                        "name": "支线1",
                        "itemStyle": {"color": "blue"}
                    }, {"x": 300, "y": 300, "sliceId": 7, "name": "支线2", "itemStyle": {"color": "blue"}}, {
                        "x": 500,
                        "y": 100,
                        "sliceId": 8,
                        "name": "支线3",
                        "itemStyle": {"color": "blue"}
                    }]
                }
            }
        },
        computed: {

        },
        mounted:function(){
            // let route = this.$route
            // this.refreshData(route)
        },
        methods: {
        },
        components: {
            MarkDown
        },
        watch: {
            activeNode: {
                handler(val) {
                    //点了导航地图 刷新数据
                    console.log(val)
                }
            }
        }
    }
</script>