<template>
    <div>
        <Nav></Nav>
        <div>
            <div class="header">
                <div class="canvas">
                    <canvasVue></canvasVue>
                </div>
                <div class="text">
                    <h1>Riendship Link</h1>
                    <p>A secret makes a woman woman --Vermouth</p>
                </div>
            </div>
            <div class="main">
                <div class="explain_shell">
                    <div class="explain">
                        <h3>链接申请说明</h3>
                        <ul class="commonStyle">
                            <li><i class="iconfont icon-icon-test2 close"></i><i>经常宕机</i></li>
                            <li><i class="iconfont icon-icon-test2 close"></i><i>不合法规</i></li>
                            <li><i class="iconfont icon-icon-test2 close"></i><i>插边球站</i></li>
                            <li><i class="iconfont icon-icon-test2 close"></i><i>红标报毒</i></li>
                            <li><i class="iconfont icon-icon-test1 check"></i><i>原创优先</i></li>
                            <li><i class="iconfont icon-icon-test1 check"></i><i>技术优先</i></li>
                        </ul>
                        <div class="commonStyle">
                            <p>交换友链可在留言板留言.本站链接如下：</p>
                            <p>名称：孑身</p>
                            <p>网址：http://47.105.95.71/</p>
                            <p>图标：http://47.105.95.71/logo.png</p>
                            <p>描述：I look forward to the mountains and rivers and you</p>
                        </div>
                        <p class="commonStyle">申请提交后若无其它原因将在24小时内审核,如超过时间还未通过,请私信我.(各种额外因素)</p>
                    </div>
                </div>
                <div v-on="this.data === []" class="links clear">
                    <ul>
                        <li v-for="item in data">
                            <div>
                                <a :href="item.src">
                                    <img :src="item.img" alt="">
                                    <h3>{{item.title}}</h3>
                                    <p>{{item.txt}}</p>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <Footer></Footer>
        <upScrollBtn></upScrollBtn>
    </div>
</template>

<script>
    import Nav from "@/components/Nav";
    import Footer from "@/components/Footer";
    import upScrollBtn from "@/components/upScrollBtn";
    import canvasVue from "../../components/canvasVue";

    export default {
        name: "Links",
        data(){
            return {
                //假数据
                data: [
                    {title:"杨小草",txt:"杨小草·如此生活三十年",src:"https://www.dennisdong.top",img:"https://www.littlegrass.co/logo.png"},
                    {title:"巫小屋's Blog",txt:" 愿你走出半生，归来仍是少年",src:"https://www.dennisdong.top",img:"https://oss.wghonline.cn/%E5%B7%AB%E5%B0%8F%E5%B7%B4/img/%E5%8D%9A%E5%AE%A2%E5%A4%B4%E5%83%8F.jpg"},
                    {title:"Jzl'Blog",txt:"jzlnice的个人博客",src:"https://www.dennisdong.top",img:"https://www.jzlnice.com/favicon.ico"},
                    {title:"LZQ'blog",txt:"林梓强的个人博客",src:"https://www.dennisdong.top",img:"http://www.linziqiang.com/favicon.ico"},
                    {title:"Dennis温暖小屋",txt:"世间所有的相遇，都是久别重逢",src:"https://www.dennisdong.top",img:"https://www.dennisdong.top/favicon.ico"},
                    {title:"一篇文字",txt:"一篇文字！不是只有视频和音乐才带给人欢乐！",src:"https://www.dennisdong.top",img:"https://www.dumogu.top/favicon.ico"},
                    {title:"suchuan的博客",txt:"有风有景，懂得感恩，方是人生。",src:"https://www.dennisdong.top",img:"https://secure.gravatar.com/avatar/572ea8123da290e55482828eb0a41f6e?s=120"},
                    {title:"Khari&Yaru的美好记忆",txt:"流年以笑掷，未来诚可期！",src:"https://www.dennisdong.top",img:"https://file.qianyaru.cn/logo_blog_favicon.ico"},
                    {title:"Jzl'Blog",txt:"jzlnice的个人博客",src:"https://www.dennisdong.top",img:"https://www.jzlnice.com/favicon.ico"},
                    {title:"LZQ'blog",txt:"林梓强的个人博客",src:"https://www.dennisdong.top",img:"http://www.linziqiang.com/favicon.ico"},
                ],
            }
        },
        components:{
            Nav,
            Footer,
            upScrollBtn,
            canvasVue,
        }
    }
</script>

<style scoped lang="less">
    .header{
        position: relative;
        margin-top: 60px;
        user-select: none;
        .canvas{
            width: 100%;
            height: 260px;
            background-color: #212220;
        }
        .text{
            position: absolute;
            top: 70px;
            width: 100%;
            text-align: center;
            color: #fff;
            h1{
                font-size: 35px;
                font-weight: initial;
            }
            p{
                margin-top: 10px;
                font-size: 21px;
            }
        }
    }
    .main{
        margin: auto;
        margin-top: 14px;
        width: 90%;
        font: 14px/1.5 Helvetica,sans-serif;
        box-sizing: border-box;
        .explain_shell{
            padding: 10px;
            .explain{
                overflow: hidden;
                padding: 20px;
                color: #515250;
                background-color: #fff;
                h3{
                    margin-bottom: 14px;
                    padding-left: 14px;
                    border-left: 3.5px solid #6bc30d;
                    font-weight: 700;
                    font-size: 21px;
                    line-height: 21px;
                }
                ul {
                    overflow: hidden;
                    li {
                        float: left;
                        margin-right: 15px;
                        i {
                            font-style: normal;
                            vertical-align: bottom;
                        }
                        .iconfont {
                            font-weight: bold;
                            vertical-align: middle;
                            &.close {
                                color: red;
                            }
                            &.check {
                                color: #73db03;
                            }
                        }
                    }
                }
                .commonStyle{
                    padding-left: 18px;
                    margin: 21px 0;
                    line-height: 24.5px;
                }
            }
        }
        .links{
            margin-top: 10px;
            color: #515250;
            ul li{
                float: left;
                padding: 0 10px 20px;
                width: 25%;
                box-sizing: border-box;
                div{
                    width: 100%;
                    height: 100%;
                    a {
                        display: block;
                        padding: 20px;
                        color: #333;
                        background-color: #fff;
                        transition: all .3s ease-in-out;
                        &:hover{
                            box-shadow: 3px 4px 10px #bccce5;
                            transform: translate3d(0,-2px,0);
                        }
                        img{
                            float: left;
                            width: 40px;
                            height: 40px;
                            border-radius: 100%;
                        }
                        h3{
                            overflow: hidden;
                            padding: 10px 15px 9px;
                            height: 21px;
                            font-weight: 400;
                        }
                        p{
                            overflow: hidden;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 3;
                            margin-top: 14px;
                            font-size: 13px;
                            height: 60px;
                        }
                    }
                }
            }
        }
    }
    @media screen and (min-width: 1366px) {
        .main{
            width: 1280px;
        }
    }
    @media screen and (max-width: 1024px) {
        .main .links ul li{
            width: 50%;
        }
    }
    @media screen and (max-width: 768px) {
        .main .links ul li{
            width: 100%;
            &:nth-last-child(1){
                padding-bottom: 0;
            }
        }
    }
</style>
