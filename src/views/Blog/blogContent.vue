<template>
    <div id="blog">
        <div class="left">
            <div v-for="item in articleData" class="article">
                <div v-if="item.ifUp" class="up">置顶</div>
                <div class="title">
                    <span>【{{ item.type }}】</span>
                    <router-link :to="'/article/'+item._id">{{ item.title }}</router-link>
                </div>
                <div class="time">
                    <span class="day">{{ new Date(item.date).getDate() }}</span>
                    <span class="month"><span>{{ new Date(item.date).getMonth() + 1 }}</span>月</span>
                    <span class="year">{{ new Date(item.date).getFullYear() }}</span>
                </div>
                <div class="content">
                    <router-link :to="'/article/'+item._id">
                        <img :src="item.preview" alt="">
                    </router-link>
                    {{ item.previewTxt }}
                </div>
                <div class="btn">
                    <router-link :to="'/article/'+item._id">继续阅读</router-link>
                </div>
                <div class="footer">
                    <div class="left">
                        <i class="iconfont icon-biaoqian"></i>
                        <p>{{ item.tag }}</p>
                    </div>
                    <div class="right">
                        <div class="watch">
                            <i class="iconfont icon-liulan1"></i>
                            <i>{{ item.pv }}</i>
                        </div>
                        <div class="reply">
                            <i class="iconfont icon-liuyan"></i>
                            <a>{{item.rv}}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="ifLoading" class="loading"><i class="iconfont icon-jiazai1"></i></div>
            <div v-if="ifNoMore" class="noMore">没有更多了……</div>
        </div>
        <div class="right">
            <div :class="{'on':ifShow}">
                <!-- width < 1024px时出现 -->
                <div class="btn" @click="clickShowFn(true)">
                    <span class="iconfont">&#xe62a;</span>
                </div>
                <div class="category">
                    <h3>分类导航</h3>
                    <ul>
                        <li v-for="(item,index) in searchDataExtend" @click="clickShowFn">
                            <router-link :to="'/blog/'+(index?(index+'/'):'')">{{ item }}</router-link>
                        </li>
                    </ul>
                </div>
                <!-- 遮罩层 -->
                <div :class="['mask',{'on':ifNone}]" @click="clickShowFn"></div>
                <!-- 1024px-END -->

                <div :class="['search',{'fixed':ifFixed}]">
                    <div>
                        <label>
                            <input v-model="searchInput" @input="searchInputFn" type="text" placeholder="输入关键字搜索">
                            <i class="iconfont icon-dashujukeshihuaico-"></i>
                        </label>
                        <div v-show="!!searchList.length">
                            <ul>
                                <li v-for="item in searchList">
                                    <router-link :to="'/article/'+item._id">{{ item.title }}</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <ul @mouseleave="sliderMouseleaveFn">
                        <li class="slider" :style="{top:sliderTop+'px'}"></li>
                        <li @mouseenter="sliderMouseenterFn(index)" v-for="(item,index) in searchDataExtend">
                            <router-link :to="'/blog/'+(index?(index+'/'):'')">{{ item }}</router-link>
                        </li>
                    </ul>
                </div>
                <div class="hot">
                    <h3>热门文章</h3>
                    <ul>
                        <li v-for="(item,index) of hotData">
                            <i>{{ index + 1 }}</i>
                            <router-link :to="'/article/'+item._id">{{ item.title }}</router-link>
                        </li>
                    </ul>
                </div>
                <div class="up">
                    <h3>置顶推荐</h3>
                    <ul>
                        <li v-for="(item,index) of upData">
                            <i>{{ index + 1 }}</i>
                            <router-link :to="'/article/'+item.upArticleId._id">{{ item.upArticleId.title }}
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="visitor">
                    <h3>最近访客</h3>
                    <ul>
                        <li v-for="item in visitor" v-if="item.user">
                            <img :src="item.user.headPortrait" :alt="item.user.userName">
                            <span>{{ item.user.userName }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import request from '../../api';

const articleInfo = request.getArticleInfo;
const articleHot = request.getArticleHot;
const article = request.getArticle;
const searchArticle = request.searchArticle;
const getVisitor = request.getVisitor;

export default {
    name: "blogContent",
    data() {
        return {
            //搜索框的v-model
            searchInput: "",
            searchList: [],
            searchTimer: null,
            //搜索框li数据
            searchData: [],
            //热门文章数据
            hotData: [],
            //置顶文章数据
            upData: [],
            //文章内容
            articleData: [],
            //最近访客
            visitor: [],
            //li滑块的top值
            sliderTop: (this.$route.params.id || 0) * 40,
            //搜索框是否悬浮
            ifFixed: false,
            //width小于1024时候改变布局
            ifShow: false,
            //遮罩层display是否为none
            ifNone: true,
            //滚动到底部之后是加载状态还是结束加载状态
            ifLoading: false,
            ifNoMore: false,
        }
    },
    computed: {
        searchDataExtend() {
            if (!this.searchData.length) return ["All Articles"]
            return ["All Articles", ...this.searchData]
        },
        id() {
            return this.$route.params.id;
        }
    },
    watch: {
        id() {
            this.articleFn();
            document.documentElement.scrollTop = 0;
        },
    },
    methods: {
        //搜索框的选项条中移入函数
        sliderMouseenterFn(index) {
            this.sliderTop = index * 40;
        },
        //搜索框的选项条中移出函数
        sliderMouseleaveFn() {
            this.sliderTop = (this.$route.params.id || 0) * 40;
        },
        //右边搜索框滚动时悬浮函数
        searchScrollFn() {
            this.ifFixed = document.documentElement.scrollTop >= 900;
            return this.searchScrollFn;
        },
        //文章加载函数
        articleFn() {
            this.ifLoading = this.ifNoMore = false;
            let tag = this.searchDataExtend[this.id] || "";
            article(tag, true)
                .then(res => this.articleData = res.data.data)
                .catch(err => console.error("articleData数据加载失败", err))
        },
        //滚动加载文章函数
        articleScrollFn(hitDiv) {
            if (this.ifLoading || this.ifNoMore) return;
            //滚动高
            let a = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
            //可视区高
            let b = document.documentElement.clientHeight;
            //文档高
            let c = document.documentElement.offsetHeight;
            //获取元素用于判断宽度是否小于1024px
            let condition = hitDiv.display !== "none" ? c - 200 : c - 520;
            if ((a + b) >= condition) {
                let tag = this.searchDataExtend[this.id] || false;
                this.ifLoading = true;
                article(tag).then(res => {
                    let data = res.data.data;
                    if (data.length) this.articleData.push(...data);
                    else this.ifNoMore = true;
                    this.ifLoading = false;
                }).catch(err => {
                    console.error("articleData数据加载失败", err);
                    this.ifLoading = false;
                });
            }
        },
        //遮罩层动画的变量修改
        clickShowFn(bool) {
            this.ifShow = !this.ifShow;
            if (bool === true) this.ifNone = !this.ifNone
            else setTimeout(() => this.ifNone = !this.ifNone, 600)
        },
        //搜索
        searchInputFn() {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                let keywords = this.searchInput.trim(); //去除首位空格
                if (keywords) {
                    searchArticle(keywords)
                        .then(res => {
                            if (!res.data.data instanceof Array || !res.data.data) return
                            this.searchList = res.data.data;
                        })
                        .catch(err => console.error(err))
                } else this.searchList = []
            }, 800);
        },
    },
    created() {
        //文章分类&&文章内容请求
        articleInfo().then(res => {
            let data = res.data.data;
            let info = {}, //info内容
                up = []; //置顶文章内容

            for (let [, value] of data.entries()) {
                if (value.type === 'info') info = value;
                if (value.type === 'upArticle') up.push(value);
            }
            //分类模块
            this.searchData = info.tags;
            //置顶文章模块
            this.upData = up;

            //分类模块加载完成后发送article请求
            this.articleFn();
        }).catch(err => console.error("articleInfo数据加载失败", err));
        //热门文章请求
        articleHot().then(res => {
            this.hotData = res.data.data;
        }).catch(err => console.error("articleHot数据加载失败", err));
        getVisitor().then(res => {
            if (!res.data.data instanceof Array || !res.data.data) return
            this.visitor = res.data.data;
        }).catch(err => console.error(err))
    },
    mounted() {
        //侧边搜索框的滚动下掉事件
        window.addEventListener("scroll", this.searchScrollFn());
        //滚动加载文章事件
        let hitDiv = window.getComputedStyle(document.querySelector(".right div div.search"), null);
        window.addEventListener("scroll", () => this.articleScrollFn(hitDiv));
    },
    destroyed() {
        window.removeEventListener("scroll", this.searchScrollFn);
    },
}
</script>

<style scoped lang="less">
#blog {
    display: flex;
    width: 1280px;
    margin: 60px auto auto;

    > .right {
        margin-left: 20px;
        width: 300px;

        > div {
            display: flex;
            flex-direction: column;
            width: 300px;

            .category, .mask, .btn {
                display: none;
            }

            > div {
                margin-top: 20px;
            }

            div.search {
                display: flex;
                flex-direction: column;
                background-color: #fff;

                &.fixed {
                    position: fixed;
                    z-index: 2;
                    width: 300px;
                    animation: scrollMove .6s cubic-bezier(.215, .61, .355, 1);
                }

                @keyframes scrollMove {
                    0% {
                        opacity: 0;
                        transform: translate3d(0, -1000px, 0);
                    }
                    60% {
                        opacity: 1;
                        transform: translate3d(0, 25px, 0);
                    }
                    75% {
                        transform: translate3d(0, -10px, 0);
                    }
                    90% {
                        transform: translate3d(0, 5px, 0);
                    }
                    100% {
                        transform: none;
                    }
                }

                > div {
                    position: relative;
                    padding: 20px;
                    background-color: #808080;
                    box-sizing: border-box;

                    label {
                        position: relative;
                        z-index: 4;
                        display: block;
                        padding: 0 20px;
                        border-radius: 40px;
                        height: 40px;
                        background-color: #fff;

                        input {
                            border: 0;
                            width: 100%;
                            height: 40px;
                            line-height: 40px;
                            outline: none;
                            font: 14px/1.5 "Microsoft YaHei", "微软雅黑", "Helvetica Neue", "Hiragino Sans GB", Helvetica, Tahoma, sans-serif;
                            color: #515250;
                        }

                        .iconfont {
                            position: absolute;
                            top: 5px;
                            right: 5px;
                            width: 30px;
                            height: 30px;
                            text-align: center;
                            font-size: 20px;
                            transition: color .3s;
                            line-height: 30px;
                            color: #787977;
                            cursor: pointer;

                            &:hover {
                                color: #6bc30d;
                            }
                        }
                    }

                    div {
                        position: absolute;
                        top: 40px;
                        left: 0;
                        width: 100%;
                        padding: 0 20px;
                        z-index: 3;
                        box-sizing: border-box;

                        ul {
                            padding: 30px 0 10px;
                            border: 1px solid #e8e9e7;
                            border-bottom-left-radius: 10px;
                            border-bottom-right-radius: 10px;
                            background-color: #fff;

                            li {
                                text-align: center;
                                transition: .2s;

                                a {
                                    display: block;
                                    padding: 10px;
                                    color: #333;

                                    &.on {
                                        background-color: #eaeaea;
                                        color: #777
                                    }

                                    &:hover {
                                        background-color: #eaeaea;
                                        color: #777
                                    }
                                }
                            }
                        }

                    }
                }

                > ul {
                    position: relative;
                    padding-bottom: 20px;
                    margin-top: 20px;

                    li {
                        position: relative;
                        z-index: 1;
                        width: 100%;
                        height: 40px;
                        box-sizing: border-box;

                        a {
                            display: block;
                            margin: 0 30px;
                            padding: 0 20px;
                            line-height: 39px;
                            border-bottom: 1px solid #eee;
                            color: #787977;
                        }

                        &.slider {
                            position: absolute;
                            border-right: 6px solid #484947;
                            background-color: #f8f9f7;
                            transition: top .3s;
                        }
                    }
                }
            }

            div.hot, div.up {
                background-color: #fff;

                h3 {
                    margin: 10px 20px;
                    border-bottom: 1px solid #e8e9e7;
                    padding: 5px;
                    font-size: 18px;
                    line-height: 30px;
                    font-weight: 400;
                    color: #383937;
                }

                ul {
                    padding-bottom: 10px;
                    margin: 0 20px;

                    li {
                        margin: 3px 0;
                        line-height: 32px;

                        a {
                            line-height: 32px;
                            color: #787977;

                            &:hover {
                                text-decoration: underline;
                                color: #6bc30d
                            }
                        }

                        i {
                            display: inline-block;
                            border-radius: 50%;
                            margin-right: 8px;
                            width: 22px;
                            height: 22px;
                            font-family: SourceCodeProRegular, Menlo, Monaco, Consolas, "Courier New", monospace, 'Helvetica Neue', Arial, sans-serif;
                            font-style: normal;
                            line-height: 22px;
                            text-align: center;
                            color: #515250;
                            background-color: #edefee;
                            user-select: none;
                        }

                        &:nth-child(1) i {
                            color: #fff;
                            background-color: #e24d46;
                        }

                        &:nth-child(2) i {
                            color: #fff;
                            background-color: #2ea7e0;
                        }

                        &:nth-child(3) i {
                            color: #fff;
                            background-color: #6bc30d;
                        }
                    }
                }
            }

            div.visitor {
                background-color: #fff;

                h3 {
                    margin: 10px 20px;
                    border-bottom: 1px solid #e8e9e7;
                    padding: 5px;
                    font-size: 18px;
                    line-height: 30px;
                    font-weight: 400;
                    color: #383937;
                }

                ul {
                    padding-bottom: 10px;
                    margin: 0 20px;
                    text-align: center;

                    li {
                        position: relative;
                        display: inline-block;
                        margin-right: 4px;
                        margin-bottom: 5px;
                        width: 60px;
                        height: 60px;
                        cursor: pointer;
                        user-select: none;

                        img {
                            display: inline-block;
                            width: 60px;
                            height: 60px;
                        }

                        span {
                            position: absolute;
                            left: 0;
                            bottom: 0;
                            width: 100%;
                            height: 20px;
                            font-family: Microsoft Yahei, serif;
                            font-size: 12px;
                            line-height: 20px;
                            text-align: center;
                            color: #fff;
                            background-color: rgba(0, 0, 0, .2);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }
    }

    > .left {
        flex: 1;

        > div.article {
            overflow: hidden;
            position: relative;
            padding: 20px 30px 25px 30px;
            margin-top: 20px;
            color: #515250;
            background-color: #fff;
            animation: zoomMove 1s both;
            @keyframes zoomMove {
                0% {
                    opacity: 0;
                    transform: scale3d(.3, .3, .3);
                }
                50% {
                    opacity: 1;
                }
            }

            .title {
                padding: 5px 130px 5px 0;
                border-bottom: 1px solid #e8e9e7;
                font-size: 18px;
                font-weight: 400;
                line-height: 30px;

                span {
                    display: inline-block;
                    font-size: 16px;
                    vertical-align: bottom;
                    color: #2ea7e0;
                }

                a {
                    display: inline;
                    text-decoration: none;
                    border: none;
                    margin-left: 5px;
                    color: #212220;

                    &:hover {
                        color: #6bc30d;
                        text-decoration: underline;
                    }
                }
            }

            .time {
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 0 20px 5px 20px;
                font-family: Consolas, monospace, serif;
                font-size: 18px;
                line-height: 32px;
                background-color: #fff;

                .day {
                    position: relative;
                    top: 2px;
                    display: block;
                    font-size: 40px;
                    text-align: center;
                    font-weight: 700;
                    color: #6bc30d;
                }

                .month {
                    font-size: 14px;
                    line-height: 32px;
                    color: #989997;

                    span {
                        font-size: 18px;
                    }
                }

                .year {
                    margin-left: 18px;
                    color: #989997;
                }
            }

            .content {
                margin-top: 20px;
                min-height: 200px;
                line-height: 28px;

                a {
                    display: block;
                    position: relative;
                    float: left;
                    overflow: hidden;
                    border: 1px solid #e8e9e7;
                    margin-left: 2px;
                    margin-right: 20px;
                    width: 300px;
                    height: 180px;
                    font-size: 0;
                    line-height: 0;
                    color: #3e8bc7;

                    &:hover {
                        color: #6bc30d;
                        text-decoration: underline;

                        &::before {
                            transition: left 1s ease-in-out;
                            left: 160%;
                        }
                    }

                    &::before {
                        position: absolute;
                        left: -160%;
                        top: 0;
                        content: "";
                        height: 100%;
                        width: 100px;
                        transform: skewX(-25deg) translateZ(0);
                        background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, .3) 50%, hsla(0, 0%, 100%, 0));
                    }

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            .btn {
                position: relative;
                height: 40px;
                line-height: 40px;

                &::before {
                    display: inline-block;
                    position: absolute;
                    top: 20px;
                    left: 100px;
                    right: 0;
                    height: 1px;
                    content: "";
                    background-color: #d0d0d0;
                }

                a {
                    font-weight: bold;
                    color: #383937;

                    &:hover {
                        color: #6bc30d;
                        text-decoration: underline;
                    }
                }
            }

            .footer {
                overflow: hidden;
                padding-bottom: 4px;
                cursor: default;
                user-select: none;
                color: #787977;

                .left {
                    float: left;

                    i {
                        margin-right: 6px;
                        font-size: 18px;
                    }

                    p {
                        display: inline-block;
                        font-size: 12px;
                        padding: 2px 5px;
                        color: #787977;
                        background-color: #f1f2f0;

                        &:hover {
                            color: #fff;
                            background: #6bc30d;
                        }
                    }
                }

                .right {
                    float: right;

                    div {
                        display: inline-block;
                        font-family: Consolas, serif;
                        font-size: 14px;
                        font-style: normal;
                        color: #787977;

                        &.watch {
                            font-size: 0;
                            text-align: center;

                            .iconfont {
                                margin-right: 4px;
                                font-size: 17px;
                                font-weight: bolder;
                            }

                            i {
                                font-size: 14px;
                                font-style: normal;
                            }
                        }

                        &.reply {
                            margin-left: 25px;

                            .iconfont {
                                font-size: 14px;
                                font-weight: bolder;
                            }

                            a {
                                margin-left: 4px;
                                margin-right: 30px;

                                &:hover {
                                    color: #6bc30d;
                                    text-decoration: underline;
                                }
                            }
                        }
                    }
                }
            }

            .up {
                position: absolute;
                top: 9px;
                left: -18px;
                width: 74px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                background-color: #ff5722;
                color: #fff;
                transform: rotate(-45deg);
            }
        }

        > div.loading {
            margin: 10px 0;
            text-align: center;
            color: #999;
            user-select: none;

            i {
                display: inline-block;
                height: 32px;
                font-size: 30px;
                line-height: 32px;
                color: #737383;
                animation: rotateMove .8s linear 0s infinite normal;
            }

            @keyframes rotateMove {
                0% {
                    transform: rotate(0);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        }

        > div.noMore {
            margin: 10px 0;
            font-size: 14px;
            line-height: 1.5;
            text-align: center;
            color: #999;
        }
    }
}

@media all and (max-width: 1366px) {
    div#blog {
        width: 90%;
    }
}

@media all and (max-width: 1024px) {
    div#blog {
        display: block;
        margin-top: 80px;
        min-height: 75.45vh;

        > div.right {
            margin-left: 0;
            width: 100%;

            > div {
                width: 100%;

                &.on {
                    div.category {
                        right: 0;
                    }

                    div.btn {
                        display: none;
                    }

                    div.mask {
                        display: block;
                        animation: showMove .5s;
                    }
                }

                > div.search {
                    display: none;
                    width: 0;
                    height: 0;

                    &.fixed {
                        position: static;
                        width: 0;
                        height: 0;
                    }
                }

                div.category {
                    display: block;
                    position: fixed;
                    top: 60px;
                    right: -180px;
                    bottom: 0;
                    padding: 10px;
                    margin: 0;
                    width: 160px;
                    font-size: 11px;
                    color: #eee;
                    background: #393d49;
                    z-index: 9;
                    transition: right .5s;

                    h3 {
                        padding: 0 0 5px 0;
                        border-bottom: 1px solid #009688;
                        margin-bottom: 5px;
                        font-size: 15px;
                        font-weight: 500;
                        line-height: 22px;
                        text-align: center;
                    }

                    ul li {
                        float: left;
                        overflow: hidden;
                        padding: 5px 1%;
                        margin: 4px 0;
                        width: 98%;
                        text-align: center;
                        background-color: #009688;

                        &:hover {
                            background: #5fb878;
                        }

                        a {
                            display: block;
                            line-height: 19px;
                            color: #eee;
                        }
                    }
                }

                div.btn {
                    display: block;
                    position: fixed;
                    right: 0;
                    top: 40%;
                    padding: 30px 0;
                    margin: 0;
                    width: 15px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #009688;
                    user-select: none;
                    z-index: 7;
                    animation: btnMove .8s;
                    animation-timing-function: cubic-bezier(1.000, -0.600, 0.000, 1.650);

                    &:hover {
                        color: #212220;
                        cursor: pointer;
                    }
                }

                div.mask {
                    display: block;
                    position: fixed;
                    left: 0;
                    right: 0;
                    top: 60px;
                    bottom: 0;
                    margin: 0;
                    background: rgba(0, 0, 0, .7);
                    z-index: 5;
                    animation: inversionShowMove .5s;
                    animation-fill-mode: forwards;

                    &.on {
                        display: none;
                    }
                }
            }

            @keyframes showMove {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
            @keyframes inversionShowMove {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
            @keyframes btnMove {
                0% {
                    right: -15px
                }
                100% {
                    right: 0
                }
            }
        }

        > div.left {
            div.noMore {
                margin-bottom: 3px;
            }
        }
    }
}

@media all and (max-width: 500px) {
    div#blog div.left div.article {
        > div.title {
            padding-right: 0;
        }

        > div.content a {
            border: 0;
            margin: 0 0 10px;
            width: 100%;
            height: auto;
            float: none;
        }

        > div.time {
            display: none;
        }
    }
}
</style>
