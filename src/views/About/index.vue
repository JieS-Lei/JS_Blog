<template>
    <div>
        <Nav></Nav>
        <div>
            <div class="header">
                <div class="canvas">
                    <canvasVue></canvasVue>
                </div>
                <div class="text">
                    <h1>About Me</h1>
                    <p>A secret makes a woman woman --Vermouth</p>
                </div>
            </div>
            <div class="main">
                <div class="shell">
                    <div class="common">
                        <h3>关于我</h3>
                        <p>一个失败的傻狗子，没有能力，无所事事</p>
                        <span>可以通过以下方式联系到我：</span>
                        <ul>
                            <li>Q&nbsp;Q&nbsp;：1693256432</li>
                            <li>邮&nbsp;箱&nbsp;：<a href="mailto:1693256432@qq.com">1693256432@qq.com</a></li>
                        </ul>
                    </div>
                    <div class="common">
                        <h3>关于本站</h3>
                        <p>本站建于2020年9月，主要是个人爱好写着玩。</p>
                        <span>本站结构：</span>
                        <ul>
                            <li>前&nbsp;端&nbsp;：<code>Vue</code></li>
                            <li>后&nbsp;端&nbsp;：<code>NodeJS + MongoDB</code></li>
                        </ul>
                        <p>本站采用阿里云提供的服务器ESC和存储对象OSS。</p>
                    </div>
                    <div class="common">
                        <h3>关于版权</h3>
                        <p>本站采用「<a href="https://creativecommons.org/licenses/by-nc/4.0/deed.zh" target="_blank">署名-非商业性使用 4.0 国际 (CC BY-NC 4.0)</a>」创作共享协议。 只要在使用时注明出处，那么您可以可以对本站所有原创内容进行转载、节选、二次创作，但是您不得对其用于商业目的。</p>
                    </div>
                    <div class="common">
                        <h3>说明</h3>
                        <ul>
                            <li>本站前端样式自写，但是借鉴了<a href="https://www.yanshisan.cn/Blog/Index" target="_blank">燕十三</a>的开源前端样式，特此感谢！</li>
                            <li>本站文章仅代表个人观点，和任何组织或个人无关。</li>
                            <li>本站前端开发代码没有考虑对IE浏览器的兼容。</li>
                            <li>用户邮箱仅作回复消息用，不对外使用。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import Nav from "../../components/Nav";
    import Footer from "@/components/Footer";
    import canvasVue from "@/components/canvasVue";

    export default {
        name: "About",
        components: {
            Nav,
            Footer,
            canvasVue
        },
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
        .shell{
            padding: 10px;
            .common{
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
                p{
                    padding-left: 18px;
                    margin: 21px 0;
                    font-family: Segoe UI,Arial,sans-serif;
                    line-height: 24.5px;
                }
                ul,span{
                    padding-left: 18px;
                }
                ul li{
                    line-height: 28px;
                    code{
                        padding: 2.8px 5.6px;
                        border-radius: 4px;
                        font-family: Consolas,Courier New,monospace;
                        color: #bd4147;
                        background: rgba(27,31,35,.05);
                    }
                }
                a{
                    border: none;
                    text-decoration: none;
                    color: #0366d6;
                }
            }
        }
    }
    @media screen and (min-width: 1366px) {
        .main{
            width: 1280px;
        }
    }
</style>