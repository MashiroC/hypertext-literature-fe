<template>
    <div style="width: 100%;">
        <div style="display: flex;justify-items: flex-start">
            <div class="map" ref="map">
                <div ref="echart" style="width:100%">
                    <v-chart style="width:100%" :options="mapOptions" auto-resize :style="{width: '100%'}" ></v-chart>
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
                            <router-link :to="{name:'Book',params:{id:ch.to}}">{{ch.name}}</router-link>
                        </div>
                        <el-dropdown>
                        <span class="el-dropdown-link">
    其他选项<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
                            <el-dropdown-menu v-if="this.choose.length>2" slot="dropdown">
                                <el-dropdown-item v-for="ch in secondChoose">
                                    <router-link :to="{name:'Book',params:{id:ch.to}}">{{ch.name}}</router-link>
                                </el-dropdown-item>

                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <el-button @click="test1">test1</el-button>
            <el-button @click="test2">test2</el-button>
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
                title: "《只狼评测》",
                text: `最近用了一周多的时间打完了《只狼》，之前就想写一篇评测，今天周末刚好有一些时间把它写完，在正文开始前我想再次强调一次：这篇评测是我个人作为玩家的感受，每个人喜欢的游戏口味不同，每个人玩游戏的方式也不同，所以这篇文章不可能满足所有玩家的观点，如果你同意那我们可以深入讨论，如果你不认同的地方也请包容。

PS：未经同意请不要转载。有一些地方使用英文是因为英文是最精确的原意，有精确中文的翻译我会在后面用括号加入中文翻译，没有加的地方是因为我个人认为没有准确的中文翻译或者不了解准确的中文翻译是什么。

我先简单介绍一下我玩的过程：一共用了36小时左右通关了主线，战斗基本全部硬刚，除了加血之外没有用过任何辅助道具，有时使用义手武器和辅助招式，也有很多支线没有全部做完，所以肯定对游戏一些方面了解的不深入，如果有不精确的地方也请包容和指证，正文开始。



首先我个人给《只狼》的打分在87分，当然这是个人分数了，没有上90的原因其实在文章标题就说的很清晰了，《只狼》是一款资源有限的3A动作游戏大作，总体来说优点非常明显，缺点也有一些，但是优点大于缺点：

**优点：**

- 非常优秀的level design（关卡设计）和player traversal

- 畅快淋漓的战斗和优秀的boss战

- 展现给玩家苦难和凄美的艺术世界

**缺点：**

- 资源有限，技术力不足导致的渲染和综合表现力跟不上时代，fidelity一般

- 一般的叙事，差劲的任务指引

- 容易迷路的地图，还可以更好优化的一些鸡肋系统和一般的player growth（玩家成长）

- 用过于难的combat encounter和boss战来延长游戏时间`,
                choose: [
                    {to: 5, name: "玩一会只狼"},
                    {to: 6, name: "不玩只狼"},
                    {to: 7, name: "塞尔达是天！"},
                ],
                mapOptions: {
                    title: {
                        text: 'Graph 简单示例'
                    },
                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'none',
                            symbolSize: 50,
                            roam: true,
                            label: {
                                normal: {
                                    show: true
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
                            data: [{
                                name: '节点1',
                                x: 300,
                                y: 300
                            }, {
                                name: '节点2',
                                x: 800,
                                y: 300
                            }, {
                                name: '节点3',
                                x: 550,
                                y: 100
                            }, {
                                name: '节点4',
                                x: 550,
                                y: 500
                            }],
                            // links: [],
                            links: [{
                                source: 0,
                                target: 1,
                                symbolSize: [5, 20],
                                label: {
                                    normal: {
                                        show: true
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        width: 5,
                                        curveness: 0.2
                                    }
                                }
                            }, {
                                source: '节点2',
                                target: '节点1',
                                label: {
                                    normal: {
                                        show: true
                                    }
                                },
                                lineStyle: {
                                    normal: {curveness: 0.2}
                                }
                            }, {
                                source: '节点1',
                                target: '节点3'
                            }, {
                                source: '节点2',
                                target: '节点3'
                            }, {
                                source: '节点2',
                                target: '节点4'
                            }, {
                                source: '节点1',
                                target: '节点4'
                            }],
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
            let route = this.$route
            this.refresh(route)
        },
        methods: {
            refresh: function (val) {
                let id = val.params.id;
                console.log("id:"+id);
            },
            test1: function () {
                this.$refs.map.style.marginLeft = "-50%";
                // this.$refs.echart.style.display="none";
                this.$refs.slice.style.width = "100%"
            },
            test2: function () {
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
