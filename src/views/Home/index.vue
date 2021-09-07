<template>
    <div>
        <div :class="['rightBtn',{'on':ifShow}]" @click="showFn">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div :class="['nav',{'on':ifShow}]">
            <ul>
                <li>
                    <router-link to="/">首页</router-link>
                </li>
                <li>
                    <router-link to="/blog">博客</router-link>
                </li>
                <li>
                    <router-link to="/message">留言</router-link>
                </li>
            </ul>
            <div>
                <router-link to="">Mr.Js</router-link>
            </div>
        </div>
        <div class="firstBlock">
            <div>
                <div class="title">
                    <div class="animation">
                        <h1>孑&nbsp;身</h1>
                        <p>A secret makes a woman woman --Vermouth</p>
                        <router-link to="/blog">Enter Blog</router-link>
                    </div>
                </div>
                <div @click="scrollOnePage" class="btn animation">
                    <i class="iconfont icon-xiangxia"></i>
                </div>
            </div>
        </div>
        <div class="articleBlock">
            <div>
                <div class="title">
                    <div class="animation">
                        <h1>热门文章</h1>
                        <p>很想给你写封信,告诉你这里的天气. <br>昨夜的那场电影,还有我的心情.</p>
                    </div>
                </div>
                <div class="content">
                    <div v-for="item of hotData" class="animation">
                        <div class="img">
                            <img :src="item.preview" alt="">
                            <router-link :to="'/article/'+item._id">
                                <i class="iconfont icon-icon-test"></i>
                            </router-link>
                        </div>
                        <div class="synopsis">
                            <h4>
                                <router-link :to="'/article/'+item._id">{{ item.title }}</router-link>
                            </h4>
                            <p class="date">
                                {{ new Date(item.date).getFullYear() }}年{{ new Date(item.date).getMonth() + 1 }}月{{ new Date(item.date).getDate() }}日</p>
                            <p class="describe">{{ item.previewTxt }}</p>
                            <router-link :to="'/article/'+item._id">阅读更多</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btnBlock">
            <div class="shell">
                <div>
                    <ul>
                        <li class="animation">
                            <router-link to="/about">关于</router-link>
                        </li>
                        <li class="animation">
                            <router-link to="/links">+友情链接</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="listBlock">
            <div class="shell">
                <div>
                    <h1 class="animation">次元使者</h1>
                    <p class="animation">爱好游戏，动漫。闲来无事喜欢在一些不健康的场所虚度光阴，撸起代码就会废寝忘食。</p>
                </div>
            </div>
        </div>
        <footer>
            <div class="top">
                <div class="shell">
                    <div class="animation">
                        <ul>
                            <li>
                                <h2>孑身</h2>
                                <p>A secret makes a woman woman</p>
                                <router-link to="/about">About Me</router-link>
                            </li>
                            <li>
                                <h2>相关链接</h2>
                                <ul class="link">
                                    <li>
                                        <router-link to="/blog">
                                            <i class="iconfont icon-wenzhangguanliicon-"></i>
                                            博文
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link to="/message">
                                            <i class="iconfont icon-liuyan"></i>
                                            留言
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link to="/">
                                            <i class="iconfont icon-ziyuan1"></i>
                                            资源
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link to="/diary">
                                            <i class="iconfont icon-riji1"></i>
                                            日记
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link to="/archives">
                                            <i class="iconfont icon-guidangxiangmu"></i>
                                            归档
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <h2>联系我</h2>
                                <ul>
                                    <li>
                                        <i class="iconfont icon-weizhi"></i>
                                        地址：广东东莞厚街学府路
                                    </li>
                                    <li>
                                        <i class="iconfont icon-qq1"></i>
                                        QQ：1693256432
                                    </li>
                                    <li>
                                        <i class="iconfont icon-email"></i>
                                        邮箱：1693256432@qq.com
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="copyright">
                <div class="shell">
                  <p>Copyright © 2020-2021 陈万磊 TIDC V.1.0.0 备案号:<a href="">ABC159</a></p>
                </div>
            </div>
        </footer>
        <div v-show="loadingShow" id="loading">
            <div class="center">
                <div class="dot_one"></div>
                <div class="dot_two"></div>
                <div class="dot_three"></div>
            </div>
        </div>
        <upScrollBtn></upScrollBtn>
    </div>
</template>

<script>
import upScrollBtn from "../../components/upScrollBtn";
import request from "../../api/index";

const articleHot = request.getArticleHot;

export default {
    name: "Home",
    data() {
        return {
            ifShow: false,
            //热门文章
            hotData: [],
            //loading页面的显隐
            loadingShow: true
        }
    },
    components: {
        upScrollBtn,
    },
    methods: {
        //导航打开与关闭函数
        showFn() {
            this.ifShow = !this.ifShow;
        },
        //首页按钮向下滚动事件函数
        scrollOnePage() {
            let nowHeight = document.documentElement.scrollTop || document.body.scrollTop;
            const toHeight = window.innerHeight;
            if (nowHeight >= toHeight) return;

            const _height = Math.floor((toHeight - nowHeight) / 40);
            let timer = setInterval(() => {
                nowHeight += _height;
                //判断剩余未滚动距离是否小于每次滚动的距离
                if (Math.abs(toHeight - nowHeight) < _height)
                    nowHeight = toHeight;
                document.documentElement.scrollTop = document.body.scrollTop = nowHeight;
                if (nowHeight === toHeight)
                    clearInterval(timer)
            }, 10)
        },
        //滚动条滚动事件函数
        scrollFn() {
            let animationDOM = document.querySelectorAll(".animation");
            let pageHeight = window.innerHeight;
            animationDOM.forEach(node => {
                if (
                    (node.getBoundingClientRect().top >= 0
                        || node.getBoundingClientRect().bottom >= 20)
                    && node.getBoundingClientRect().top <= (pageHeight - 30)
                ) {
                    node.classList.add("move");
                }
            })
        }
    },
    created() {
        //热门文章请求
        articleHot(3).then((res) => {
            this.loadingShow = false;
            this.hotData = res.data.data;
        }).catch(err => {
            console.error("hotData数据加载错误", err)
        })
    },
    updated() {
        //滚动事件绑定
        this.scrollFn();
        window.addEventListener("scroll", this.scrollFn)
    }
}
</script>

<style scoped lang="less">
div.rightBtn {
    overflow: hidden;
    position: fixed;
    right: 55px;
    top: 40px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, .1);
    cursor: pointer;
    z-index: 100;
    transition: all .5s;

    &:hover {
        background: #6bc30d;
    }

    &.on > span:nth-child(1) {
        transform: rotate(45deg);
        margin-top: 18px;
    }

    &.on > span:nth-child(2) {
        transform: rotate(-45deg);
        margin-top: -2px;
    }

    &.on > span:nth-child(3) {
        transform: translateY(15px);
        transition: all .3s;
    }

    span {
        display: block;
        margin: 5px auto 0;
        width: 26px;
        height: 2px;
        line-height: 10px;
        background: #fff;
        transition: all .5s;

        &:nth-child(1) {
            margin-top: 12px;
        }
    }
}

div.nav {
    position: fixed;
    width: 100%;
    height: 0;
    background: rgba(0, 0, 0, .6);
    z-index: 10;
    user-select: none;

    &.on {
        height: 100vh;

        &::after {
            right: 0;
        }

        ul, div {
            display: block;
        }
    }

    &::after {
        content: "";
        position: fixed;
        top: 0;
        right: -60%;
        width: 60%;
        height: 100%;
        background: #fff linear-gradient(46deg, #fff, #f1f2f0);
        z-index: 5;
        transform: translateX(45%) skew(-12deg);
        transition: all .5s cubic-bezier(.19, 1, .22, 1);
    }

    ul {
        display: none;
        position: absolute;
        right: 0;
        top: 200px;
        font-size: 20px;
        z-index: 6;

        li {
            position: relative;
            line-height: 80px;

            a {
                display: inline-block;
                padding: 10px 50px;
                font-family: "Microsoft YaHei", serif;
                font-size: 20px;
                line-height: 46px;
                color: #686967;
                transition: color .5s linear;

                &::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 15px;
                    right: 105px;
                    height: 1px;
                    background-color: transparent;
                    transition: all .3s linear;
                }

                &:hover {
                    color: #6bc30d;

                    &::before {
                        right: 15px;
                        background-color: #6bc30d;
                    }
                }
            }
        }
    }

    div {
        display: none;
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 10px 50px;
        z-index: 7;

        a {
            font-family: barbarahand, serif;
            font-size: 50px;
            color: #686967;
        }
    }
}

@keyframes upMove {
    0% {
        opacity: 0;
        transform: translateY(100%)
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes downMove {
    0% {
        opacity: 0;
        transform: translateY(-100%);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }

}

@keyframes leftMove {
    0% {
        opacity: 0;
        transform: translateX(-100%);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes rightMove {
    0% {
        opacity: 0;
        transform: translateX(100%);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

div.firstBlock {
    width: 100%;
    height: 100vh;
    background-color: #fff;
    background: transparent url("http://28248m0b43.zicp.vip/images/bgImg.jpg") no-repeat center/cover fixed;

    > div {
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);

        div.title {
            display: block;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            text-align: center;
            color: #fff;

            div {
                visibility: hidden;

                &.move {
                    visibility: visible;
                    animation: firstBlockScaleMove 2s;
                    animation-fill-mode: both;
                }

                h1 {
                    font-weight: 400;
                }

                p {
                    font-family: pacifico, serif;
                    margin: 20px 0;
                    letter-spacing: 6px;
                    font-size: 16px;
                }

                a {
                    display: inline-block;
                    padding: 0 18px;
                    border-radius: 2px;
                    margin-top: 20px;
                    height: 38px;
                    font-size: 14px;
                    text-align: center;
                    line-height: 38px;
                    color: #fff;
                    background-color: #1E9FFF;
                    cursor: pointer;
                    transition: all .3s;

                    &:hover {
                        opacity: .8;
                    }
                }

                @keyframes firstBlockScaleMove {
                    0% {
                        opacity: 0;
                        transform: scale3d(.3, .3, .3);
                    }
                    100% {
                        opacity: 1;
                    }
                }
            }
        }

        div.btn {
            position: absolute;
            bottom: 30px;
            left: 50%;
            margin-left: -25px;
            display: block;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            user-select: none;
            transition: all .5s ease-out;
            visibility: hidden;

            &:hover {
                background-color: #6bc30d;
            }

            &.move {
                visibility: visible;
                animation: upMove 2s;
                animation-fill-mode: both;
            }

            .iconfont {
                position: absolute;
                margin: auto;
                width: 100%;
                height: 100%;
                font-size: 2.5rem;
                font-weight: bolder;
                line-height: 50px;
                text-align: center;
                color: #fff;
            }
        }
    }
}

div.articleBlock {
    padding: 100px 0;
    width: 100%;
    text-align: center;
    background-color: #ffffff;

    > div {
        display: inline-block;
        width: 90%;

        .title {
            width: 100%;

            div {
                display: inline-block;
                visibility: hidden;
                animation-delay: .2s;

                &.move {
                    visibility: visible;
                    animation: downMove 1s;
                    animation-fill-mode: both;
                }

                h1 {
                    padding-bottom: 30px;
                    position: relative;
                    font-size: 32px;
                    font-weight: 500;

                    &::after {
                        content: "";
                        position: absolute;
                        left: 50%;
                        bottom: -1px;
                        margin-left: -25px;
                        width: 50px;
                        height: 2px;
                        background: #00c2ff;
                    }
                }

                p {
                    margin-top: 20px;
                    line-height: 22px;
                    color: #888;
                }
            }
        }

        .content {
            width: 100%;

            &::after {
                content: '';
                display: block;
                clear: both;
                visibility: visible;
            }

            > div {
                padding: 0 10px;
                margin-top: 50px;
                width: 100%;
                box-sizing: border-box;
                visibility: hidden;

                &.move {
                    visibility: visible;
                    animation: upMove 1s;
                    animation-fill-mode: both;
                }

                &:nth-child(2) {
                    animation-delay: .2s;
                }

                &:nth-child(3) {
                    animation-delay: .4s;
                }

                &:hover {
                    div.img {
                        &::before {
                            opacity: 1;
                            visibility: visible;
                            transform: translateY(0);
                        }

                        img {
                            transform: scale(1.2);
                        }

                        a {
                            top: 50%;
                            opacity: 1;
                            visibility: visible;
                        }
                    }
                }

                div.img {
                    overflow: hidden;
                    position: relative;

                    &::before {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(255, 255, 255, .51);
                        visibility: hidden;
                        opacity: 0;
                        z-index: 2;
                        transform: translateY(-100%);
                        transition: all .4s ease;
                    }

                    img {
                        width: 100%;
                        height: 244px;
                        background: #faf9f9;
                        transition: all .4s ease;
                    }

                    a {
                        position: absolute;
                        top: 0;
                        left: 50%;
                        margin: -20px 0 0 -20px;
                        width: 40px;
                        height: 40px;
                        text-align: center;
                        line-height: 40px;
                        color: #fff;
                        background: #333;
                        opacity: 0;
                        visibility: hidden;
                        transition: all .4s ease;
                        z-index: 3;

                        .iconfont {
                            display: inline-block;
                            font: normal normal normal 14px/1 FontAwesome;
                            font-size: inherit;
                            font-weight: bolder;
                            text-rendering: auto;
                        }
                    }
                }

                div.synopsis {
                    padding: 30px 15px;
                    text-align: left;
                    background: #faf9f9;

                    h4 {
                        margin-bottom: 10px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;

                        a {
                            font-weight: normal;
                            color: #333;

                            &:hover {
                                color: #777;
                            }
                        }
                    }

                    .date {
                        margin-bottom: 15px;
                        font-size: 12px;
                        color: #bbb;
                    }

                    .describe {
                        overflow: hidden;
                        height: 55px;
                        color: #999;
                    }

                    > a {
                        display: inline-block;
                        padding: 0;
                        margin-top: 15px;
                        color: #29b6f6;
                        background: 0 0;
                        transition: all .4s ease;

                        &:hover {
                            color: #333;
                        }
                    }
                }
            }
        }
    }
}

div.btnBlock {
    overflow: hidden;
    position: relative;
    padding: 100px 0;
    width: 100%;
    background: url("http://28248m0b43.zicp.vip/images/bgImg2.jpg") no-repeat center center/cover fixed;

    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 0;
    }

    .shell div {
        position: relative;
        width: 90%;
        margin: 0 auto;
        text-align: center;
        z-index: 1;

        ul {
            display: inline-block;

            li {
                position: relative;
                display: inline-block;
                border: 1px solid #b4b4b4;
                width: 200px;
                height: 46px;
                margin: 10px;
                text-align: center;
                box-sizing: border-box;
                transition: all .6s linear;
                visibility: hidden;

                &.move {
                    visibility: visible;
                    animation: leftMove 1s;
                    animation-fill-mode: both;
                }

                &::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 0;
                    height: 44px;
                    background-color: #6bc30d;
                    z-index: -1;
                    transition: all .6s linear;
                }

                &:hover {
                    border-color: #fff;
                    color: #fff;

                    &::after {
                        width: 100%;
                    }
                }

                &:nth-child(2).move {
                    animation-name: rightMove;
                }

                a {
                    display: block;
                    position: relative;
                    padding: 10px;
                    text-align: center;
                    line-height: 26px;
                    color: #fff;
                    z-index: 1;
                }
            }
        }
    }
}

div.listBlock {
    overflow: hidden;
    padding: 100px 0;
    width: 100%;
    background-color: #faf9f9;

    .shell div {
        margin: 0 auto;
        width: 90%;
        text-align: center;

        h1 {
            margin-bottom: 20px;
            font-weight: normal;
            visibility: hidden;

            &.move {
                visibility: visible;
                animation: leftMove 1s;
                animation-fill-mode: both;
            }
        }

        p {
            visibility: hidden;

            &.move {
                visibility: visible;
                animation: rightMove 1s;
                animation-fill-mode: both;
            }
        }
    }
}

footer {
    .top {
        padding: 60px 0 90px;
        width: 100%;
        background: #232328;

        .shell div {
            padding: 0 15px;
            margin: 0 auto;
            width: 90%;
            visibility: hidden;

            &.move {
                visibility: visible;
                animation: upMove 1.5s;
                animation-fill-mode: both;
            }

            > ul {
                &::after {
                    content: '';
                    display: block;
                    clear: both;
                }

                > li {
                    display: block;
                    float: left;
                    width: 100%;
                    box-sizing: border-box;

                    h2 {
                        margin: 30px 0 20px;
                        font-size: 18px;
                        font-weight: normal;
                        color: #fff;
                    }

                    p {
                        color: #eee;
                    }

                    > a {
                        display: inline-block;
                        padding: 0 18px;
                        border-radius: 2px;
                        margin-top: 20px;
                        height: 38px;
                        font-size: 14px;
                        text-align: center;
                        line-height: 38px;
                        color: #fff;
                        background-color: #1E9FFF;
                        transition: all .3s;

                        &:hover {
                            border-color: #fff;
                            color: #fff;
                            opacity: .8;
                        }
                    }

                    ul li {
                        margin-bottom: 10px;
                        color: #eee;

                        &:nth-last-child(1) {
                            margin-bottom: 0;
                        }

                        a {
                            color: #eee;

                            &:hover {
                                color: #82b440;
                            }
                        }

                        .iconfont {
                            margin-right: 10px;
                            width: 20px;
                            font-size: 16px;
                            user-select: none;
                        }
                    }

                    ul.link li {
                        float: left;
                        width: 50%;
                    }
                }
            }
        }
    }

    .copyright {
        padding: 12px 0;
        background: #1d1d21;

        .shell {
            padding: 0 15px;
            margin: 0 auto;
            width: 90%;

            p {
                font-family: Helvetica, serif;
                font-size: 14px;
                text-align: center;
                color: #bbb;

                a {
                    color: white;
                }
            }
        }
    }
}

#loading {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: #374140;

    .center {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 150px;
        width: 150px;

        div {
            float: left;
            border-radius: 50%;
            margin: 65px 15px 0;
            width: 20px;
            height: 20px;
            background-color: #fff;
            animation: loadingScaleMove 1.5s infinite;

            &.dot_two {
                animation-delay: .25s;
            }

            &.dot_three {
                animation-delay: .5s
            }
        }

        @keyframes loadingScaleMove {
            75% {
                transform: scale(0);
            }
        }
    }
}

@media all and (max-width: 768px) {
    div.nav::after {
        width: 50%;
        transform: none;
    }

    div.nav > div {
        padding: 0;
        width: 50%;
        text-align: center;
    }
}

@media all and (min-width: 768px) {
    div.articleBlock > div {
        width: 750px;

        .content > div {
            float: left;
            width: 33.33333333%;
        }
    }

    footer .top .shell > div > ul > li {
        width: 50%;
    }
}

@media all and (min-width: 992px) {
    div.articleBlock > div {
        width: 970px;
    }

    footer .top .shell > div > ul > li {
        width: 33.33333333%;
    }
}

@media all and (min-width: 1200px) {
    div.articleBlock > div {
        width: 1170px;
    }
}
</style>
