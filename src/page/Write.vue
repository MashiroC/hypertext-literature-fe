<template>
    <div style="width:100%">
        <div style="width:100%" class="flex-left">
            <div style="width:50%;height:500px">
                <v-graph id="test" :gData="graphData" :onActive.sync="activeNode" :pos="rootId" :enable-click="false"/>
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
                rootId: "",
                activeNode: 6,
                choose: "",
                fictionId: null,
                title: "",
                text: "",
                graphData: "",
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
            this.fictionId = this.$route.params.fictionId;
            this.initText();
            this.initMap();
            // let route = this.$route
            // this.refreshData(route)
        },
        methods: {
            initText: function () {
                // localStorage.clear();
                let cacheText = localStorage.getItem("cacheText" + this.fictionId);
                if (cacheText !== null) {
                    this.text = cacheText;
                }
            },
            initMap: function () {
                let id = this.$route.params.fictionId;
                console.log(id);

                let book = JSON.parse(sessionStorage.getItem("book" + id));

                this.fictionId = id;
                this.rootId = book.prologurId;

                //小说id不一样 换了小说 重新渲染map
                let url = this.apiDomain + "/fiction/" + book.id;

                this.$http.get(url).then((resp) => {
                    let tmp = resp.body.data;
                    console.log(tmp);
                    //去掉选项传给图组件
                    for (let i = 0; i < tmp.length; i++) {
                        // tmp[i].choose = undefined;
                    }
                    this.edges = tmp;

                    //传节点名字
                    let tmpTitle = [];
                    let url = this.apiDomain + "/fiction/" + id + "/nodes";

                    //需要给地图详细信息的情况下
                    this.$http.get(url).then((resp) => {
                        let nodes = resp.body.data;
                        for (let i = 0; i < nodes.length; i++) {
                            tmpTitle[nodes[i].id] = {title: nodes[i].title};
                        }
                        let testData = {graph: tmp, nodeTitle: tmpTitle};
                        this.graphData = testData;
                        //如果slice为空 就去渲染序章
                        // if (slice === undefined) {
                        //     this.activeNode = this.rootId;
                        // } else {
                        //     //不为空 就渲染当前章
                        //     this.activeNode = slice;
                        // }
                    });


                    //如果slice为空 就去渲染序章
                    // if (slice === undefined) {
                    //     this.activeNode = this.rootId;
                    // } else {
                    //     //不为空 就渲染当前章
                    //     this.activeNode = slice;
                    // }

                })
            },
            //保存草稿
            saveText: function () {
                localStorage.setItem("cacheText" + this.fictionId, this.text);
                this.$message({
                    message: '本地草稿保存成功',
                    type: 'success'
                });
            },
            reloadPage: function () {
                location.reload();
            }
        },
        components: {
            // MarkDown
        },
        watch: {
            $route: {
                handler(val) {
                    console.log(val)
                    this.reloadPage()
                }
            },
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
