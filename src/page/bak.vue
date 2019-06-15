<template>
    <div style="width: 100%;">
        <div style="display: flex;justify-items: flex-start">
            <div class="map" ref="map">
                <div ref="echart" style="width:100%">
                    <!--<div id="chart" style="width:100%;height:1000px" @click="mouseTest" :options="mapOptions" :notMerge="true" auto-resize-->
                    <!--:style="{width: '100%'}"></div>-->
                    <div id="chart" style="width:100%;height:500px"></div>
                </div>
            </div>
            <div class="slice" ref="slice">
                <div>
                    <div class="title">{{title}}</div>
                    <div class="content">
                        <vue-markdown id="md" :source="text"></vue-markdown>
                    </div>
                    <div class="choose">
                        <div v-for="ch in firstChoose" :key="ch.value" class="choose_item">
                            <router-link :to="{name:'BookSlice',params:{id:fictionId,slice:ch.to}}">{{ch.name}}
                            </router-link>
                        </div>
                        <el-dropdown v-if="choose.length>2">
                        <span class="el-dropdown-link">
    其他选项<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="ch in secondChoose" :key="ch.value">
                                    <router-link :to="{name:'BookSlice',params:{id:fictionId,slice:ch.to}}">
                                        {{ch.name}}
                                    </router-link>
                                </el-dropdown-item>

                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <el-button @click="test1">回去</el-button>
            <el-button @click="test2">出来</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Read",
        computed: {
            firstChoose: function () {
                if (this.choose.length > 2) {
                    return this.choose.slice(0, 2)
                } else {
                    return this.choose;
                }
            },
            secondChoose: function () {
                return this.choose.slice(2, this.choose.length);
            }
        },
        data() {
            return {
                chart: "",
                fictionId: null,
                title: "",
                text: "",
                rootId: null,
                choose: [],
                edges: [],
                mapOptions: {
                    title: {
                        text: '章节地图'
                    },
                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            clickable:true,

                            type: 'graph',
                            layout: 'none',
                            symbolSize: 50,
                            // roam: true,
                            color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
                            label: {

                                normal: {
                                    show: true,

                                }
                            },
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [4, 10],
                            edgeLabel: {
                                normal: {

                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            itemLabel:{
                                clickable:true,

                            },
                            data: [],
                            links: [],
                            // links: [],
                            itemStyle: {
                                normal: {
                                    color: "green"
                                }
                            },
                            lineStyle: {
                                normal: {
                                    opacity: 0.9,
                                    width: 2,
                                    curveness: 0
                                }
                            }
                        }
                    ]
                }
            }
        },
        mounted: function () {
            this.initCharts();
            let route = this.$route
            this.refreshData(route)
            // this.echarts.on("click",this.mouseTest)
        },
        methods: {
            initCharts: function () {
                this.chart = this.$Echarts.init(document.getElementById("chart"));
                this.chart.setOption(this.mapOptions, true);
                this.chart.on("click", this.mouseTest);
                this.chart.on("hover",(param) => function(){
                    console.log(param);
                    console.log("on")
                    let sliceId = param.data.sliceId;
                    if (sliceId !== undefined) {
                        let fictionId = this.$route.params.id
                        this.$router.push({name: "BookSlice", params: {id: fictionId, slice: sliceId}})
                    }
                });
            },
            mouseTest: function (param) {

                //TODO
                console.log(param);
                let sliceId = param.data.sliceId;
                if (sliceId !== undefined) {
                    let fictionId = this.$route.params.id;
                    this.$router.push({name: "BookSlice", params: {id: fictionId, slice: sliceId}})
                }

            },
            refreshContent: function (fictionId, sliceId) {
                let url2 = this.apiDomain + "/fiction/" + fictionId + "/" + sliceId;
                this.$http.get(url2).then((resp) => {
                    this.title = resp.body.data.title;
                    this.text = resp.body.data.text;
                })
                this.sortChoose(this.edges, sliceId);
                sessionStorage.setItem("readFictionId", fictionId)
                sessionStorage.setItem("readSliceId", sliceId);

                let node = this.mapOptions.series[0].data;
                let tmp = this.mapOptions.series[0];
                for (let i = 0; i < node.length; i++) {
                    // console.log(node[i].sliceId)
                    if (node[i].sliceId === sliceId) {
                        tmp.data[i].itemStyle={color:"red"}
                    } else {
                        tmp.data[i].itemStyle={color:"blue"};
                    }
                }
                this.mapOptions.series[0] = tmp;

                this.chart.setOption(this.mapOptions, true);
                console.log(JSON.stringify(this.mapOptions.series[0].data));
                console.log(JSON.stringify(this.mapOptions.series[0].links));

            },
            refreshData: function (val) {
                let id = val.params.id;
                let slice = val.params.slice;
                this.fictionId = id;
                let readFictionId = sessionStorage.getItem("readFictionId");
                let readSliceId = sessionStorage.getItem("readSliceId");

                if (slice === undefined) {
                    //打开序章
                    let book = JSON.parse(sessionStorage.getItem("book" + id));

                    this.rootId = book.prologurId;

                    let url = this.apiDomain + "/fiction/" + book.id;

                    this.$http.get(url).then((resp) => {
                        let tmp = resp.body.data;
                        this.edges = tmp;
                        this.sortMap(tmp, book.prologurId);
                        // sessionStorage.setItem("mapNode",JSON.stringify(this.mapOptions.series[0].data))
                        // sessionStorage.setItem("mapEdge",JSON.stringify(this.mapOptions.series[0].links))

                        //拿到序章
                        this.refreshContent(id, book.prologurId);
                    })
                } else {
                    // this.mapOptions.series[0].data=JSON.parse(sessionStorage.getItem("mapNode"));
                    if (readFictionId == id) {
                        //读的是一本书，只换content
                        let url = this.apiDomain + "/fiction/" + id + "/" + slice;
                        this.$http.get(url).then((resp) => {
                            let data = resp.body.data;
                            this.refreshContent(id, slice);
                        })
                    } else {
                        //换书了
                    }
                }
                let url = this.apiDomain + "/fictions/" + id;

            },
            sortChoose: function (arr, id) {
                this.choose = [];
                for (let i = 0; i < arr.length; i++) {
                    let fromId = arr[i].fromId;
                    let toId = arr[i].toId;
                    if (fromId == id) {
                        this.choose.push({name: arr[i].choose, to: toId})
                    }
                }

            },
            sortMap: function (arr, pos) {
                let nodeTmp = [];
                for (let i = 0; i < arr.length; i++) {
                    nodeTmp[arr[i].fromId] = {x: 200, y: 0, sliceId: arr[i].fromId};
                    nodeTmp[arr[i].toId] = {x: 200, y: 0, sliceId: arr[i].toId};
                }
                let step = 200;

                //从pos开始bfs
                nodeTmp[pos].x = 100;
                nodeTmp[pos].name = "序章";
                let nodeCnt = 1;
                for (let z = pos; z <= nodeTmp.length; z++) {
                    if (nodeTmp[z] !== undefined) {
                        if (z !== pos) {
                            nodeTmp[z].name = "支线" + nodeCnt;
                            nodeCnt++;
                        }
                        for (let i = 0; i < arr.length; i++) {
                            let fromId = arr[i].fromId;
                            let toId = arr[i].toId;

                            if (fromId === z) {
                                nodeTmp[toId].x = nodeTmp[fromId].x + step;
                            }
                        }

                    }
                }

                //找到同一x的节点有多少个
                let flag = [];
                for (let i = pos; i < nodeTmp.length; i++) {
                    if (nodeTmp[i] !== undefined) {

                        let x = nodeTmp[i].x;
                        if (flag[x / 100] === undefined) {
                            let cnt = 0;
                            for (let j = pos; j < nodeTmp.length; j++) {
                                if (nodeTmp[j].x === x) {
                                    cnt++;
                                }
                            }
                            flag[x / 100] = {total: cnt, now: cnt};
                        }

                    }
                }
                //给每个节点赋y值
                for (let i = 0; i < flag.length; i++) {
                    if (flag[i] !== undefined) {
                        let single = 1;
                        for (let j = pos; j < nodeTmp.length; j++) {
                            if (nodeTmp[j].x === i * 100) {
                                nodeTmp[j].y = (flag[i].total - flag[i].now) * 200 + 100;
                                flag[i].now--;
                            }
                        }
                    }
                }

                let edges = []
                //开始算边
                for (let i = 0; i < arr.length; i++) {
                    // arr[i]
                    let fromId = arr[i].fromId;
                    let toId = arr[i].toId;
                    let edge = {
                        source: nodeTmp[fromId].name,
                        target: nodeTmp[toId].name
                    }
                    edges.push(edge);
                }

                let nodes = [];

                for (let i = pos; i < nodeTmp.length; i++) {
                    if (nodeTmp[i] !== undefined) {
                        nodes.push(nodeTmp[i])
                    }
                }

                this.mapOptions.series[0].data = nodes;
                this.mapOptions.series[0].links = edges;
                return nodeTmp;

            },
            goOut: function () {
                this.$refs.map.style.marginLeft = "-50%";
                // this.$refs.echart.style.display="none";
                this.$refs.slice.style.width = "100%"
            },
            goIn: function () {
                this.$refs.map.style.marginLeft = "0";
                // this.$refs.echart.style.display=null;
                this.$refs.slice.style.width = "50%";
            }
        },
        watch: {
            '$route': ["refresh"]
        }

    }
</script>

<style>
    .map {
        width: 50%;
        margin-left: 0;
        height: 1000px;
        -webkit-transition: all 1s;
    }

    .slice {
        -webkit-transition: all 1s;
        padding-top: 2rem;
        padding-left: 4rem;
        padding-right: 2rem;
        width: 50%;
    }

    .title {
        padding-bottom: 1rem;
        text-align: center;
        width: 100%;
        font-size: 25px;
    }

    .content {

        -ms-word-break: break-all;
        word-break: break-all;
        width: 100%;
        font-family: Microsoft YaHei, serif !important;
    }

    #md p {
        padding-bottom: 10px !important;
    }

    .choose {
        padding-top: 30px;
    }

    .choose_item {
        padding-bottom: 10px;
    }

</style>
