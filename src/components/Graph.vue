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
                option: {
                    title: {
                        text: '章节地图'
                    },

                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            clickable: true,
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
                            data: this.gData.node,
                            // links: [],
                            links: this.gData.links,
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
        props: ["id", "gData", "onActive"]
        ,
        mounted() {
            console.log(this.onActive)
            console.log(this.activeNode)
            this.init();
        }
        ,
        methods: {
            init() {
                this.myChart = this.$Echarts.init(document.getElementById(this.id));
                this.activeNode = this.onActive;

                this.myChart.setOption(this.option);
                this.myChart.on("click", this.clickNode)
            },
            //刷新节点数据
            refreshContent() {
                this.option.series[0].data = this.gData.node;
                this.option.series[0].links = this.gData.links;
                this.myChart.setOption(this.option, true);
            },
            //刷新状态
            refreshActive(sliceId) {
                console.log("active",sliceId);
                let node = this.gData.node;
                console.log(node);
                if (node !== undefined) {
                    for (let i = 0; i < node.length; i++) {
                        if (node[i].sliceId ==sliceId) {
                            node[i].itemStyle = {color: "blue"};
                        } else {
                            node[i].itemStyle = {color: "red"};
                        }
                    }
                    this.gData.node = node;
                    this.myChart.setOption(this.option, true);
                }
            },
            clickNode(params) {
                //点击了一个节点
                let id = params.data.sliceId;
                this.$emit("update:onActive", id)
            }
        },
        watch: {
            gData: {
                handler(val) {
                    this.refreshContent();
                    this.refreshActive();
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
                    this.refreshActive(val);
                }
            }
        }
    }
    ;
</script>