<template>
    <div style="width: 100%;">
        <div style="display: flex;justify-items: flex-start">
            <div class="map" ref="map">
                <v-graph id="test" :gData="graphData" :pos="rootId" :onActive.sync="activeNode"/>
            </div>
            <div class="slice" ref="slice">
                <div>
                    <div class="title">{{title}}</div>
                    <div class="content">
                        <!--<vue-markdown id="md" :source="text"></vue-markdown>-->
                        <mavon-editor v-model="text" :subfield="false" defaultOpen="preview" :toolbarsFlag="false"
                                      :boxShadow="false" :editable="false"/>
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
        <div class="write" @click="goWrite">
            <div style="width:100%">书写我的故事</div>
        </div>
        <div>
            <el-button @click="goOut">回去</el-button>
            <el-button @click="goIn">出来</el-button>
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
                activeNode: 6,
                fictionId: null,
                title: "",
                text: "",
                rootId: null,
                choose: [],
                edges: [],
                graphData: ""

            }
        },
        mounted: function () {
            let route = this.$route;
            this.refreshData(route)
        },
        methods: {
            goWrite: function () {
                let id = this.fictionId;
                this.$router.push({name: "Write", params: {fictionId: id}})
            },
            refreshContent: function (fictionId, sliceId) {
                let url2 = this.apiDomain + "/fiction/" + fictionId + "/" + sliceId;
                this.$http.get(url2).then((resp) => {
                    this.title = resp.body.data.title;
                    this.text = resp.body.data.text;
                })
                this.sortChoose(this.edges, sliceId);
                sessionStorage.setItem("readFictionId", fictionId);
                sessionStorage.setItem("readSliceId", sliceId);
                this.activeNode = sliceId;
                this.sliceId = sliceId;
            },
            refreshData: function (val) {

                let id = val.params.id;
                let slice = val.params.slice;
                let readFictionId = sessionStorage.getItem("readFictionId");
                let readSliceId = sessionStorage.getItem("readSliceId");

                let book = JSON.parse(sessionStorage.getItem("book" + id));


                //没graph数据的情况下 应该是用户刷新了页面 从新渲染图和当前数据
                if (this.graphData === "") {
                    this.newFiction(val);

                } else {
                    //有graph数据

                    // 小说id一样 并没有换小说
                    if (id === this.fictionId) {
                        if (slice === undefined) {
                            this.activeNode = this.rootId;
                        } else {
                            this.activeNode = slice;
                        }
                    } else {
                        this.newFiction(val);
                    }
                    // console.log(slice)
                    // this.activeNode = slice;
                }

            },
            newFiction: function (val) {
                let id = val.params.id;
                let slice = val.params.slice;

                let book = JSON.parse(sessionStorage.getItem("book" + id));


                this.fictionId = id;
                this.rootId = book.prologurId;

                //小说id不一样 换了小说 重新渲染map
                let url = this.apiDomain + "/fiction/" + book.id;

                let cnt = 0;
                this.$http.get(url).then((resp) => {
                    let tmp = JSON.parse(JSON.stringify(resp.body.data));

                    this.edges = JSON.parse(JSON.stringify(tmp));

                    //传节点名字
                    let tmpTitle = [];
                    let url = this.apiDomain + "/fiction/" + id + "/nodes";


                    if (slice === undefined) {
                        this.sortChoose(JSON.parse(JSON.stringify(resp.body.data)), this.rootId);
                    } else {
                        //不为空 就渲染当前章
                        this.sortChoose(JSON.parse(JSON.stringify(resp.body.data)), slice);
                    }
                    for (let i = 0; i < tmp.length; i++) {
                        tmp[i].choose = undefined;
                    }
                    let testData = {graph: tmp, nodeTitle: tmpTitle};
                    this.graphData = testData;
                    //如果slice为空 就去渲染序章
                    if (slice === undefined) {
                        this.activeNode = this.rootId;
                    } else {
                        //不为空 就渲染当前章
                        this.activeNode = slice;
                    }


                })
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
            // sortMap: function (arr, pos) {
            //     let nodeTmp = [];
            //     for (let i = 0; i < arr.length; i++) {
            //         nodeTmp[arr[i].fromId] = {x: 200, y: 0, sliceId: arr[i].fromId};
            //         nodeTmp[arr[i].toId] = {x: 200, y: 0, sliceId: arr[i].toId};
            //     }
            //     let step = 200;
            //
            //     //从pos开始bfs
            //     nodeTmp[pos].x = 100;
            //     nodeTmp[pos].name = "序章";
            //     let nodeCnt = 1;
            //     for (let z = pos; z <= nodeTmp.length; z++) {
            //         if (nodeTmp[z] !== undefined) {
            //             if (z !== pos) {
            //                 nodeTmp[z].name = "支线" + nodeCnt;
            //                 nodeCnt++;
            //             }
            //             for (let i = 0; i < arr.length; i++) {
            //                 let fromId = arr[i].fromId;
            //                 let toId = arr[i].toId;
            //
            //                 if (fromId === z) {
            //                     nodeTmp[toId].x = nodeTmp[fromId].x + step;
            //                 }
            //             }
            //
            //         }
            //     }
            //
            //     //找到同一x的节点有多少个
            //     let flag = [];
            //     for (let i = pos; i < nodeTmp.length; i++) {
            //         if (nodeTmp[i] !== undefined) {
            //
            //             let x = nodeTmp[i].x;
            //             if (flag[x / 100] === undefined) {
            //                 let cnt = 0;
            //                 for (let j = pos; j < nodeTmp.length; j++) {
            //                     if (nodeTmp[j].x === x) {
            //                         cnt++;
            //                     }
            //                 }
            //                 flag[x / 100] = {total: cnt, now: cnt};
            //             }
            //
            //         }
            //     }
            //     //给每个节点赋y值
            //     for (let i = 0; i < flag.length; i++) {
            //         if (flag[i] !== undefined) {
            //             let single = 1;
            //             for (let j = pos; j < nodeTmp.length; j++) {
            //                 if (nodeTmp[j].x === i * 100) {
            //                     nodeTmp[j].y = (flag[i].total - flag[i].now) * 200 + 100;
            //                     flag[i].now--;
            //                 }
            //             }
            //         }
            //     }
            //
            //     let edges = []
            //     //开始算边
            //     for (let i = 0; i < arr.length; i++) {
            //         // arr[i]
            //         let fromId = arr[i].fromId;
            //         let toId = arr[i].toId;
            //         let edge = {
            //             source: nodeTmp[fromId].name,
            //             target: nodeTmp[toId].name
            //         }
            //         edges.push(edge);
            //     }
            //
            //     let nodes = [];
            //     for (let i = pos; i < nodeTmp.length; i++) {
            //         if (nodeTmp[i] !== undefined) {
            //             nodes.push(nodeTmp[i])
            //         }
            //     }
            //
            //
            //     let data = {node: nodes, links: edges};
            //     this.graphData = data;
            //     // this.graphData.node = nodes;
            //     // this.graphData.links = edges;
            //     // console.log(this.graphData)
            //     return nodeTmp;
            //
            // },
            goOut: function () {
                this.$refs.map.style.marginLeft = "-50%";
                // this.$refs.echart.style.display="none";
                this.$refs.slice.style.width = "100%"
            },
            goIn: function () {
                this.$refs.map.style.marginLeft = "0";
                // this.$refs.echart.style.display=null;
                this.$refs.slice.style.width = "50%";
            },
            pushRoute(r) {
                this.$router.push(r)
            }
        },
        watch: {
            '$route': ["refreshData"],
            activeNode: {
                handler(val) {
                    let fictionId = this.$route.params.id;
                    let sliceId = this.$route.params.slice;
                    if (val === sliceId) {
                        //章节没变 不push route
                    } else if (val === this.rootId) {
                        //章节和序章一样但是和route不一样
                        if (sliceId !== undefined && val !== sliceId) {
                            let r = {name: 'BookSlice', params: {id: fictionId, slice: val}}
                            this.pushRoute(r)
                        }
                    } else {
                        //新章节
                        let r = {name: 'BookSlice', params: {id: fictionId, slice: val}}
                        this.pushRoute(r);
                    }
                    this.refreshContent(fictionId, val)

                    // this.refreshContent(fictionId,val);

                }
            }
        }

    }
</script>

<style scoped>

    .write {
        position: fixed;
        right: 0;
        margin-bottom: 3rem;
        margin-right: 3rem;
        bottom: 0;
        border-style: solid;
        border-radius: 15rem 15rem 15rem 15rem;
        width: 150px;
        height: 150px;
        display: flex;
        justify-items: center;
        text-align: center;
        align-items: center;
        font-size: 20px;
    }

    .map {
        width: 50%;
        margin-left: 0;
        height: 500px;
        -webkit-transition: all 1s;
    }

    .slice {
        -webkit-transition: all 1s;
        padding-top: 2rem;
        padding-left: 4rem;
        padding-right: 2rem;
        width: 50%;
        height: 500px;
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
