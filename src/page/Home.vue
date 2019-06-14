<template>
    <div class="container">
        <el-main>
            <el-row>
                <el-col :span="6">
                    <div>&nbsp;</div>
                </el-col>
                <el-col :span="18">
                    <el-row>
                        <div>
                            <el-col v-for="(book,index) in books" :key="book.value" :span="7"
                                    :offset="index % 3 > 0 ? 1 : 0" style="padding-top:1rem">
                                <el-card>
                                    <img src="https://m.media-amazon.com/images/I/81-VUy02aKL._SS500_.jpg" width="100%"
                                         class="image">
                                    <div style="padding: 14px;">
                                        <router-link :to="{name:'BookHome',params:{id:book.id}}">{{book.name}}</router-link>
                                    </div>
                                </el-card>
                            </el-col>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        </el-main>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                books: [],
            }
        },
        mounted: function () {
            let url = this.apiDomain + "/fictions";
            this.$http.get(url).then((resp) => {
                this.books = resp.body.data;
                console.log(this.books);
                for (let i = 0; i < this.books.length; i++) {
                    sessionStorage.setItem("book" + this.books[i].id, JSON.stringify(this.books[i]))
                }
            })
        },
        methods: {},
    }
</script>

<style scoped>

</style>
