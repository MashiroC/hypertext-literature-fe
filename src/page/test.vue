<template>
    <div style="width:100%">
        <div style="width:100%" class="flex-left">
            <div style="width:50%;height:500px">
                <v-graph id="test" :gData="graphData" :onActive.sync="activeNode"/>
            </div>
            <div class="slice" ref="slice">
                <mavon-editor style="height:100%;width:100%" v-model="text" :toolbars="toolbar" @save="saveText"/>

            </div>
        </div>
        <div>{{activeNode}}</div>

    </div>
</template>

<script>
    // import MarkDown from 'vue-meditor'

    export default {
        name: "App",
        data() {
            return {
                activeNode: 6,
                choose: "",
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
                },
                toolbar: {
                    bold: true, // 粗体
                    italic: true,// 斜体
                    header: true,// 标题
                    underline: true,// 下划线
                    strikethrough: true,// 中划线
                    mark: true,// 标记
                    superscript: true,// 上角标
                    subscript: true,// 下角标
                    quote: true,// 引用
                    ol: true,// 有序列表
                    ul: true,// 无序列表
                    link: true,// 链接
                    // imagelink: true,// 图片链接
                    code: true,// code
                    table: true,// 表格
                    subfield: true,// 是否需要分栏
                    fullscreen: true,// 全屏编辑
                    readmodel: true,// 沉浸式阅读
                    htmlcode: true,// 展示html源码
                    help: true// 帮助
                }
            }
        },
        computed: {},
        mounted: function () {
            this.initText();
            // let route = this.$route
            // this.refreshData(route)
        },
        methods: {
            initText: function () {
                // localStorage.clear();
                let cacheText = localStorage.getItem("cacheText");
                if (cacheText !== null) {
                    this.text=cacheText;
                }
            },
            //保存草稿
            saveText: function () {
                localStorage.setItem("cacheText", this.text);
                this.$message({
                    message: '本地草稿保存成功',
                    type: 'success'
                });
            }
        },
        components: {
            // MarkDown
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

<style scoped>
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
        height: 700px;
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
