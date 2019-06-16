<template>
    <div :id="id" style="width:100%;height:100%"></div>
</template>
<script>
    export default {
        name: "Chart",
        data() {
            return {
                myChart: "",
                activeNode: 0,
                graphData: {node: "", links: ""},
                option: {
                    title: {
                        text: '章节地图'
                    },

                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            // clickable: this.enableClick,
                            type: 'graph',
                            layout: 'none',
                            symbolSize: 50,
                            roam: true,
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
                            data: "",
                            // links: [],
                            links: "",
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
        props: ["id", "gData", "onActive", "pos","enableClick"]
        ,
        mounted() {
            this.init();
        }
        ,
        methods: {
            init() {
                // this.option={
                //     title: {
                //         text: '章节地图'
                //     },
                //
                //     tooltip: {},
                //     animationDurationUpdate: 1500,
                //     animationEasingUpdate: 'quinticInOut',
                //     series: [
                //         {
                //             clickable: true,
                //             type: 'graph',
                //             layout: 'none',
                //             symbolSize: 50,
                //             roam: true,
                //             label: {
                //                 normal: {
                //                     show: true,
                //                 }
                //             },
                //             edgeSymbol: ['circle', 'arrow'],
                //             edgeSymbolSize: [4, 10],
                //             edgeLabel: {
                //                 normal: {
                //                     textStyle: {
                //                         fontSize: 20
                //                     }
                //                 }
                //             },
                //             data: "",
                //             // links: [],
                //             links: "",
                //             itemStyle: {
                //                 normal: {
                //                     color: "green"
                //                 }
                //             },
                //             lineStyle: {
                //                 normal: {
                //                     opacity: 0.9,
                //                     width: 2,
                //                     curveness: 0
                //                 }
                //             }
                //         }
                //     ]
                // }

                this.myChart = this.$Echarts.init(document.getElementById(this.id));
                this.activeNode = this.onActive;
                if (this.gData !== undefined && this.gData !== "") {
                    this.sortMap(this.gData, this.pos);
                }
                this.option.series[0].data = this.graphData.node;
                this.option.series[0].links = this.graphData.links;
                this.myChart.setOption(this.option, true);
                this.myChart.on("click", this.clickNode)
            },
            //刷新节点数据
            refreshContent(data) {
                this.edges = data;
                if (this.gData !== undefined && this.gData !== "") {
                    // console.log("refre");
                    // console.log(this.gData);
                    // console.log(data);
                    this.sortMap(this.gData, this.pos)
                }
                this.option.series[0].data = this.graphData.node;
                this.option.series[0].links = this.graphData.links;
                this.myChart.setOption(this.option, true);
            },
            //刷新状态
            refreshActive(sliceId) {
                let node = this.graphData.node;
                if (node !== undefined) {
                    for (let i = 0; i < node.length; i++) {
                        if (node[i].sliceId == sliceId) {
                            node[i].itemStyle = {color: "blue"};
                        } else {
                            node[i].itemStyle = {color: "red"};
                        }
                    }
                    this.graphData.node = node;
                    this.myChart.setOption(this.option, true);
                }
            },
            clickNode(params) {
                //点击了一个节点
                let id = params.data.sliceId;
                this.$emit("update:onActive", id)
            },
            sortMap: function (tmpData, pos) {
                let arr = tmpData.graph;
                // console.log("aee")
                // console.log(arr);
                let nodeTitle = tmpData.nodeTitle;
                let nodeTmp = [];
                // let pos = 0;
                for (let i = 0; i < arr.length; i++) {
                    nodeTmp[arr[i].fromId] = {x: 200, y: 0, sliceId: arr[i].fromId, title: arr[i].title};
                    nodeTmp[arr[i].toId] = {x: 200, y: 0, sliceId: arr[i].toId, title: arr[i].title};
                }
                let step = 200;
                //从pos开始bfs
                nodeTmp[pos].x = 100;

                if (nodeTitle[pos] === undefined) {
                    nodeTmp[pos].name = "序章";
                } else {
                    // console.log(nodeTmp[pos].title);
                    nodeTmp[pos].name = nodeTitle[pos].title;
                    // nodeTmp[pos].name = nodeTitle[]
                }
                let nodeCnt = 1;
                for (let z = pos; z <= nodeTmp.length; z++) {
                    if (nodeTmp[z] !== undefined) {
                        if (z !== pos) {
                            if (nodeTitle[z] === undefined) {
                                nodeTmp[z].name = "支线" + nodeCnt;
                                nodeCnt++;
                            } else {
                                // console.log(nodeTmp[z].title);
                                nodeTmp[z].name = nodeTitle[z].title;
                            }
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
                // console.log("fuck")
                // console.log(nodeTmp);

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
                        // let single = 1;
                        for (let j = pos; j < nodeTmp.length; j++) {
                            if (nodeTmp[j].x === i * 100) {
                                nodeTmp[j].y = (flag[i].total - flag[i].now) * 200 + 100;
                                flag[i].now--;
                            }
                        }
                    }
                }

                let edges = [];
                //开始算边
                for (let i = 0; i < arr.length; i++) {
                    // arr[i]
                    let fromId = arr[i].fromId;
                    let toId = arr[i].toId;
                    let edge = {
                        source: nodeTmp[fromId].name,
                        target: nodeTmp[toId].name,
                    };
                    if (arr[i].choose !== undefined) {
                        // console.log("调图的边")
                        edge.label = {
                            normal: {
                                show: true,
                                formatter: arr[i].choose,
                            }
                        }
                    }
                    edges.push(edge);
                }

                let nodes = [];
                for (let i = pos; i < nodeTmp.length; i++) {
                    if (nodeTmp[i] !== undefined) {
                        nodes.push(nodeTmp[i])
                    }
                }


                let data = {node: nodes, links: edges};
                // console.log(data);

                this.graphData = data;
                // this.graphData.node = nodes;
                // this.graphData.links = edges;
                // console.log(this.graphData)
                return nodeTmp;

            }
        },
        watch: {
            gData: {
                handler(val) {
                    this.refreshContent();
                    // this.refreshActive();
                }
            },
            //当父组件active改变的时候改变自身的active
            onActive: {
                handler(val) {
                    //向父组件传点击的sliceId
                    this.activeNode = val;
                }
            },
            //当子组件active改变的时候渲染数据
            activeNode: {
                handler(val) {
                    // console.log("actibve" + val);
                    this.refreshActive(val);
                }
            }
        }
    }
    ;
</script>
