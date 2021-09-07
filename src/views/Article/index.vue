<template>
    <div>
        <Nav @ifLogin="ifLoginFn" v-if="reloadNav"></Nav>
        <div class="warp_article">
            <div>
                <div class="article_title">
                    <div class="title">
                        <h4>
                            {{ article.title }}
                            <button v-if="ifMusic" @click="musicFn" title="静音">
                                <i class="iconfont icon-soundsize" v-if="!ifMuted"></i>
                                <i class="iconfont icon-mutemode" v-if="ifMuted"></i>
                            </button>
                        </h4>
                    </div>
                    <div class="info">
                        <span>作者：<router-link to="/">孑&nbsp;身</router-link></span>
                        <span class="left">围观群众：<i>{{ article.pv }}</i></span>
                        <span class="left">更新于 <i style="font-style: normal">{{ format(article.date) }}</i></span>
                    </div>
                    <div class="time">
                        <span class="day">{{ new Date(article.date).getDate() }}</span>
                        <span class="month"><span>{{ new Date(article.date).getMonth() + 1 }}</span>月</span>
                        <span class="year">{{ new Date(article.date).getFullYear() }}</span>
                    </div>
                </div>
                <div class="article_content">
                    <div id="PTxt" class="ql-snow">
                        <div class="ql-editor" v-html="article.content"></div>
                    </div>
                    <div class="PS">
                        <p>非特殊说明，本文版权归&nbsp;<span>孑身</span>&nbsp;所有，转载请注明出处。</p>
                        <p>本文作者：
                            <router-link to="/">孑&nbsp;身</router-link>
                        </p>
                        <p>本文网址：
                            <router-link :to="this.$route.fullPath">
                                http://47.105.95.71:3000/#{{ this.$route.fullPath }}
                            </router-link>
                        </p>
                    </div>
                    <aplayer
                        v-if="ifMusic"
                        :muted="ifMuted"
                        :music="audio"
                        :autoplay="true"
                        :showLrc="true"
                        theme="pic"
                        repeat="list"
                        style="margin: 5px 0"
                    />
                    <h6>延伸阅读</h6>
                    <ul>
                        <li>
                            <router-link :to="similarArticle.next.href">{{ similarArticle.next.title }}</router-link>
                        </li>
                        <li>
                            <router-link :to="similarArticle.previous.href">{{ similarArticle.previous.title }}
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="article_footer">
                    <ul>
                        <li><a href="#"></a></li>
                        <li><a href="#"></a></li>
                        <li><a href="#"></a></li>
                        <li><a href="#"><i class="iconfont icon-qq1"></i></a></li>
                        <li><a href="#"></a></li>
                    </ul>
                </div>
                <div class="article_inputBox">
                    <h5><span>发表评论</span></h5>
                    <quill-editor
                        v-model="content"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)"
                    >
                    </quill-editor>
                    <div class="btn">
                        <button type="button" @click="submitFn">提交留言</button>
                    </div>
                </div>
                <div class="article_comment">
                    <ul>
                        <li v-for="(item,index) in data" :key="item._id">
                            <div class="msg">
                                <div class="photo">
                                    <img :src="item.user.headPortrait" :alt="item.user.userName">
                                </div>
                                <div class="user">
                                    <span class="name">{{ item.user.userName }}</span>
                                    <span class="blogger" v-if="item.user.admin">站长</span>
                                </div>
                                <div class="ql-snow">
                                    <div class="ql-editor txt" v-html="item.content"></div>
                                </div>
                                <div class="siteInfo">
                                    <span>{{ format(item.date) }}</span>
                                    <span class="textarea" @click="replyClick(index)">
                                {{
                                            (item.replyTxt.listIndexArr[0] === index && item.replyTxt.listIndexArr[1] === undefined) ? "收起" : "回复"
                                        }}
                            </span>
                                </div>
                            </div>
                            <hr v-if="item.children.length">
                            <div class="reply" v-for="(node,i) in item.children" :key="node.date+(Math.random()*50)">
                                <div class="photo">
                                    <img :src="node.user.headPortrait" :alt="node.user.userName">
                                </div>
                                <div class="replyTxt">
                                    <span class="name">{{ node.user.userName }}</span>
                                    <span class="blogger" v-if="node.user.admin">站长</span>
                                    <span style="margin-right:5px;">回复</span>
                                    <span class="name">{{ node.reUser }}</span>
                                    <div>{{ node.content }}</div>
                                </div>
                                <div class="info">
                                    <span>{{ format(node.date) }}</span>
                                    <span class="textarea" @click="replyClick(index,i)">
                                        {{
                                            (item.replyTxt.listIndexArr[0] === index && item.replyTxt.listIndexArr[1] === i) ? "收起" : "回复"
                                        }}
                                    </span>
                                </div>
                            </div>
                            <div :class="['replyText',{'on':item.replyTxt.ifShow}]">
                                <!--suppress HtmlFormInputWithoutLabel -->
                                <textarea v-model="item.replyTxt.content" id="textarea"
                                          :placeholder="`回复【${item.replyTxt.reUser}】`"></textarea>
                                <div class="btn">
                                    <button type="button" @click="replyBtnFn(index)">提交</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div :class="['hint',{'right' : hint.ifRight}]">
                    <div class="icon">
                        <span class="iconfont error" v-if="!hint.ifIcon">&#xe65f;</span>
                        <span class="iconfont pass" v-if="hint.ifIcon">&#xe617;</span>
                    </div>
                    <div class="txt">
                        {{ hint.Txt }}
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
        <upScrollBtn></upScrollBtn>
    </div>
</template>

<script>
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import upScrollBtn from "../../components/upScrollBtn";
import aplayer from "vue-aplayer";

import request from "../../api";

const getOneArticle = request.getOneArticle;
const previousArticle = request.previousArticle;
const nextArticle = request.nextArticle;
const getComment = request.getComment;
const articleComment = request.articleComment;
const articleChildComment = request.articleChildComment;

import VueAPlayer from 'vue-aplayer';

VueAPlayer.disableVersionBadge = true;

//富文本工具栏提示
const titleConfig = [
    {Choice: '.ql-bold', title: '加粗'},
    {Choice: '.ql-italic', title: '斜体'},
    {Choice: '.ql-underline', title: '下划线'},
    {Choice: '.ql-header', title: '段落格式'},
    {Choice: '.ql-strike', title: '删除线'},
    {Choice: '.ql-blockquote', title: '块引用'},
    {Choice: '.ql-code', title: '插入代码'},
    {Choice: '.ql-code-block', title: '插入代码段'},
    {Choice: '.ql-font', title: '字体'},
    {Choice: '.ql-size', title: '字体大小'},
    {Choice: '.ql-list[value="ordered"]', title: '编号列表'},
    {Choice: '.ql-list[value="bullet"]', title: '项目列表'},
    {Choice: '.ql-direction', title: '文本方向'},
    {Choice: '.ql-header[value="1"]', title: 'h1'},
    {Choice: '.ql-header[value="2"]', title: 'h2'},
    {Choice: '.ql-align', title: '对齐方式'},
    {Choice: '.ql-color', title: '字体颜色'},
    {Choice: '.ql-background', title: '背景颜色'},
    {Choice: '.ql-image', title: '图像'},
    {Choice: '.ql-video', title: '视频'},
    {Choice: '.ql-link', title: '添加链接'},
    {Choice: '.ql-formula', title: '插入公式'},
    {Choice: '.ql-clean', title: '清除字体格式'},
    {Choice: '.ql-script[value="sub"]', title: '下标'},
    {Choice: '.ql-script[value="super"]', title: '上标'},
    {Choice: '.ql-indent[value="-1"]', title: '向左缩进'},
    {Choice: '.ql-indent[value="+1"]', title: '向右缩进'},
    {Choice: '.ql-header .ql-picker-label', title: '标题大小'},
    {Choice: '.ql-header .ql-picker-item[data-value="1"]', title: '标题一'},
    {Choice: '.ql-header .ql-picker-item[data-value="2"]', title: '标题二'},
    {Choice: '.ql-header .ql-picker-item[data-value="3"]', title: '标题三'},
    {Choice: '.ql-header .ql-picker-item[data-value="4"]', title: '标题四'},
    {Choice: '.ql-header .ql-picker-item[data-value="5"]', title: '标题五'},
    {Choice: '.ql-header .ql-picker-item[data-value="6"]', title: '标题六'},
    {Choice: '.ql-header .ql-picker-item:last-child', title: '标准'},
    {Choice: '.ql-size .ql-picker-item[data-value="small"]', title: '小号'},
    {Choice: '.ql-size .ql-picker-item[data-value="large"]', title: '大号'},
    {Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: '超大号'},
    {Choice: '.ql-size .ql-picker-item:nth-child(2)', title: '标准'},
    {Choice: '.ql-align .ql-picker-item:first-child', title: '居左对齐'},
    {Choice: '.ql-align .ql-picker-item[data-value="center"]', title: '居中对齐'},
    {Choice: '.ql-align .ql-picker-item[data-value="right"]', title: '居右对齐'},
    {Choice: '.ql-align .ql-picker-item[data-value="justify"]', title: '两端对齐'}
];

export default {
    name: "index",
    components: {
        Nav,
        Footer,
        upScrollBtn,
        aplayer,
    },
    watch: {
        //监听路由是否变化
        '$route'(to, from) {
            if (to.params.id !== from.params.id) {
                this.id = to.params.id;
                this.init();//重新加载数据
            }
        }
    },
    data() {
        return {
            id: (() => this.$route.params.id)(), //当前文章的id

            audio: {
                title: '暂无歌曲',
                artist: ' - o(╥﹏╥)o',
                src: '',
                pic: '',
                lrc: '[00:00.00] (,,•́ . •̀,,) 抱歉，当前歌曲暂无歌词！',
            }, //音乐的默认配置文件

            content: null, //富文本编辑器默认内容
            editorOption: { //  富文本编辑器配置
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code', 'code-block'],

                        [{'header': 1}, {'header': 2}],               // custom button values
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                        [{'direction': 'rtl'}],                         // text direction

                        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                        [{'header': [1, 2, 3, 4, 5, 6, false]}],

                        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                        [{'font': []}],
                        [{'align': []}],
                        ['clean'],

                        ['formula', 'link'],

                        ['image', 'video'],
                    ]
                }
            }, //富文本配置内容
            hint: {
                ifRight: false, //弹出框的显示
                Txt: '', //弹出框的内容
                ifIcon: false, //图标的切换
                timer: null,
            }, //提示框动画及内容

            ifLogin: [false, {}], //登录信息

            data: [], //评论的数据
            article: {
                title: "",
                pv: 0,
                date: null,
                content: "",
            }, //当前_id的文章的信息，默认为空
            similarArticle: {
                previous: {href: "", title: "没有更多了o(╥﹏╥)o"},
                next: {href: "", title: "没有更多了o(╥﹏╥)o"},
            }, //延伸阅读
            reloadNav: true, //用于刷新nav
            ifMusic: false, //是否有音乐
            ifMuted: false, //是否静音
        }
    },
    methods: {
        //判断是否登录
        ifLoginFn(data) {
            this.ifLogin = data
        },
        // 富文本编辑器 失去焦点事件
        onEditorBlur(editor) {
        },
        // 富文本编辑器 获得焦点事件
        onEditorFocus(editor) {
        },
        // 富文本编辑器 内容改变事件
        onEditorChange(editor) {
        },
        //时间转化函数 time是时间戳
        format(time) {
            let fmt = "yyyy/MM/dd hh:mm:ss";
            let date = new Date(time);
            let o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;

        },
        //组件初始获取数据 or 重新获取评论信息
        init(get = true) {
            if (get) {
                this.audio.src = "";
                this.ifMusic = false;
                getOneArticle(this.$route.params.id)
                    .then(res => {
                        if (res.data.code !== 0) return this.$router.push("/404");

                        let data = res.data.data;
                        if (data.music.src) this.ifMusic = true;
                        this.article.title = data.title;
                        this.article.content = data.content;
                        this.article.pv = data.pv;
                        this.article.date = data.date;
                        data.music.artist = " - " + data.music.artist;
                        this.audio = data.music;
                        previousArticle(data.tag, data.date)
                            .then(res => {
                                let data = res.data.data;
                                if (typeof data !== 'object') return
                                if (!data._id || !data.title) {
                                    this.similarArticle.previous.href = "";
                                    this.similarArticle.previous.title = "没有更多了o(╥﹏╥)o";
                                    return
                                }
                                this.similarArticle.previous.href = "/article/" + data._id;
                                this.similarArticle.previous.title = data.title;
                            })
                            .catch(err => console.error(err))
                        nextArticle(data.tag, data.date)
                            .then(res => {
                                let data = res.data.data;
                                if (typeof data !== 'object') return
                                if (!data._id || !data.title) {
                                    this.similarArticle.next.href = "";
                                    this.similarArticle.next.title = "没有更多了o(╥﹏╥)o";
                                    return
                                }
                                this.similarArticle.next.href = "/article/" + data._id;
                                this.similarArticle.next.title = data.title;
                            })
                            .catch(err => console.error(err))
                    })
                    .catch(err => {
                        this.$router.push("/404");
                        console.log(err);
                    })
            }
            getComment(this.id)
                .then(res => {
                    if (res.data.code !== 0 || !(res.data.data.comment instanceof Array)) return
                    let data = res.data.data.comment;
                    this.data = data.map(item => {
                        item.replyTxt = {
                            user: '', //user的id
                            content: null, //内容
                            date: '', //日期
                            reUser: '', //回复给谁
                            ifShow: false,
                            listIndexArr: [],
                        };
                        return item;
                    }).reverse();
                })
                .catch(err => {
                    console.error(err);
                })
        },
        //弹窗函数
        hintFn(text = "", time = 3000, or = false) {
            clearTimeout(this.hint.timer);
            this.hint.Txt = text;
            this.hint.ifIcon = or;
            this.hint.ifRight = true;
            this.hint.timer = setTimeout(() => {
                this.hint.ifRight = false;
            }, time)
        },
        //button提交留言事件
        submitFn() {
            if (!this.content) {
                this.hintFn("请输入内容！");
                return
            }
            if (!this.ifLogin[0]) {
                this.hintFn("请登录账号！", 2000);
                return
            }
            let options = {
                articleId: this.id,
                user: this.ifLogin[1]._id,
                content: this.content,
            };
            articleComment(options)
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.msg === "未登录或登录超时") {
                            this.hintFn("登录超时,请重新登录！", 2000);
                            this.reloadNav = false;
                            this.$nextTick(this.reloadNav = true);
                            return
                        }
                        this.hintFn("数据类型错误！", 2000);
                        return
                    }
                    if (res.data.code === 0) {
                        this.hintFn("留言提交成功", 2000, true);
                        this.content = null;
                        setTimeout(() => {
                            this.init(false)
                        }, 800);
                        return
                    }
                    this.hintFn("数据错误，请稍后再试！");
                })
                .catch(err => {
                    this.hintFn("图片过大！");
                    console.error("提交接口错误" + err)
                })
        },
        //回复按钮点击函数
        replyClick(index, i) {
            if (this.ifLogin[0]) {
                if (index === undefined) return
                //点击的是父级回复
                let pData = this.data[index];
                if (i === undefined) {
                    pData.replyTxt.reUser = pData.user.userName;
                } else {
                    pData.replyTxt.reUser = pData.children[i].user.userName;
                }
                //两次点击是否是同一个
                if (index === pData.replyTxt.listIndexArr[0] && i === pData.replyTxt.listIndexArr[1]) {
                    pData.replyTxt.ifShow = false;
                    pData.replyTxt.listIndexArr = [];
                } else {
                    pData.replyTxt.ifShow = true;
                    pData.replyTxt.listIndexArr = [index, i];
                }
                pData.replyTxt.user = this.ifLogin[1]._id;
            } else this.hintFn("请登录账号！", 1000);
        },
        //回复按钮
        replyBtnFn(index) {
            if (!this.ifLogin[0]) {
                this.hintFn("请登录账号！", 2000);
                return
            }
            if (!this.data.length) {
                this.hintFn("未知错误！", 4000);
                return
            }
            if (!this.data[index].replyTxt.content) {
                this.hintFn("请输入内容！");
                return
            }
            let options = {
                articleId: this.id,
                parentId: this.data[index]._id,
                content: this.data[index].replyTxt.content,
                user: this.ifLogin[1]._id,
                reUser: this.data[index].replyTxt.reUser,
            }
            articleChildComment(options)
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.msg === "未登录或登录超时") {
                            this.hintFn("登录超时,请重新登录！", 2000);
                            this.reloadNav = false;
                            this.$nextTick(this.reloadNav = true);
                            return
                        }
                        this.hintFn("数据类型错误！", 2000);
                        return
                    }
                    if (res.data.code === 2) {
                        this.hintFn("此评论不存在！", 2000);
                        setTimeout(() => {
                            this.init(false)
                        }, 800);
                        return
                    }
                    if (res.data.code === 0) {
                        this.hintFn("评论提交成功", 2000, true);
                        this.data[index].replyTxt.content = null;
                        this.data[index].replyTxt.ifShow = false;
                        setTimeout(() => {
                            this.init(false)
                        }, 800);
                        return
                    }
                    this.hintFn("数据错误，请稍后再试！");
                })
                .catch(err => {
                    this.hintFn("回复失败，请求发生错误！");
                    console.error(err)
                })
        },
        //音乐静音
        musicFn() {
            this.ifMuted = !this.ifMuted;
        },
    },
    created() {
        this.init()
    },
    mounted() {
        //给富文本工具栏添加title
        document.getElementsByClassName('ql-editor')[0].dataset.placeholder = ''
        for (let item of titleConfig) {
            let tip = document.querySelector('.quill-editor ' + item.Choice)
            if (!tip) continue
            tip.setAttribute('title', item.title)
        }
    },
    beforeDestroy() {
        this.ifMusic = false;
    },
}
</script>

<style scoped lang="less">
.warp_article {
    margin-top: 80px;
    font: 14px/1.5 "Helvetica neue", Helvetica, Tahoma, "lantinghei sc", "Microsoft Yahei", sans-serif;
    color: #515250;

    > div {
        position: relative;
        padding: 20px 30px 25px 30px;
        margin: 0 auto;
        width: 1280px;
        background-color: #fff;
        box-sizing: border-box;

        a {
            border: none;
            text-decoration: none;
            color: #3e8bc7;
        }

        .btn {
            display: inline-block;
            margin: 15px 0;

            button {
                border: 1px solid #d9d9d9;
                border-radius: 5px;
                height: 38px;
                padding: 0 18px;
                font-size: 14px;
                color: rgba(0, 0, 0, .65);
                background-color: #fff;
                outline: 0;
                box-shadow: 0 2px 0 rgba(0, 0, 0, .015);
                cursor: pointer;
                user-select: none;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);

                &:hover {
                    border-color: #40a9ff;
                    color: #40a9ff;
                }
            }
        }

        .article_title {
            padding: 5px 130px 5px 0;
            border-bottom: 1px solid #e8e9e7;
            font-size: 18px;
            font-weight: 400;
            line-height: 1.5;

            .title {
                margin-top: 5px;

                h4 {
                    font-size: 20px;
                    font-weight: normal;

                    button {
                        display: inline-block;
                        padding: 0 5px;
                        border: 1px solid #C9C9C9;
                        border-radius: 2px;
                        margin-left: 5px;
                        height: 20px;
                        font-size: 0;
                        background-color: #fff;
                        color: #555;
                        white-space: nowrap;
                        cursor: pointer;
                        outline: 0;
                        transition: all .3s;

                        &:hover {
                            border-color: #409eff;
                        }

                        &:focus {
                            opacity: 1;
                        }

                        .iconfont {
                            font-size: 20px;
                            line-height: 20px;
                        }
                    }
                }
            }

            .info {
                font-size: 14px;
                color: #787977;

                span {
                    font-size: 12px;

                    i {

                    }

                    &.left {
                        margin-left: 13px;
                    }
                }
            }

            .time {
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 0 20px 5px 20px;
                margin-top: 10px;
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
                    margin-left: 8px;
                    color: #989997;
                }
            }
        }

        .article_content {
            padding-bottom: 20px;
            border-bottom: 1px solid #e1e2e0;
            margin: 20px 0 0 0;
            min-height: 200px;
            line-height: 28px;

            div#PTxt.ql-snow div.ql-editor {
                padding: 0;

                /deep/ p {
                    line-height: 2;
                }
            }

            .PS {
                padding: 15px 20px;
                margin-top: 20px;
                line-height: 22px;
                text-shadow: 0 1px 0 rgba(255, 255, 255, .8);
                color: #565755;
                background-color: #f8f9f7;
                clear: both;

                p {
                    font-size: 13px;
                    overflow: hidden;
                    word-wrap: normal;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    a {
                        margin: 0 2px;
                    }
                }
            }

            h6 {
                padding: 5px 20px;
                margin: 20px 0;
                border-left: 3px solid #6bc30d;
                min-height: 26px;
                line-height: 26px;
                font-size: 16px;
                font-weight: 400;
                text-shadow: 0 1px 0 rgba(255, 255, 255, .5);
                background-color: #f8f9f7;
                color: #585957;
                clear: both;
            }

            ul > li {
                &:before {
                    content: "♤";
                    margin-right: 5px;
                    color: #787977;
                }
            }
        }

        .article_footer {
            padding-bottom: 30px;
            border-bottom: 1px solid #e1e2e0;
            margin: 30px 0 30px;
            font-size: 0;
            text-align: center;
            user-select: none;

            ul {
                overflow: hidden;
                display: inline-block;
                font-size: 30px;

                li {
                    float: left;
                    border: 2px solid #e8e9e7;
                    border-radius: 50%;
                    margin: 0 10px;
                    width: 50px;
                    height: 50px;
                    font-size: 0;
                    box-sizing: border-box;
                    opacity: .75;
                    transition: opacity .36s linear;
                    cursor: pointer;
                    text-rendering: auto;

                    &:hover {
                        opacity: 1;
                    }

                    a {
                        display: block;
                        margin: 7px auto;
                        width: 32px;
                        line-height: 32px;
                        height: 32px;
                        background: url("../../assets/images/shareicon.png") no-repeat;
                        background-size: 32px 160px;
                    }
                }

                li:nth-child(1) {
                    border-color: #f46753;

                    a {
                        background-position: 0 -128px;
                    }
                }

                li:nth-child(2) {
                    border-color: #5ac64f;
                }

                li:nth-child(3) {
                    border-color: #ff7171;

                    a {
                        background-position: 0 -64px;
                    }
                }

                li:nth-child(4) {
                    border-color: #14afff;

                    a {
                        background-image: none;

                        i {
                            font-size: 30px;
                        }
                    }
                }

                li:nth-child(5) {
                    border-color: #fbb611;

                    a {
                        background-position: 0 -32px;
                    }
                }
            }
        }

        .article_inputBox {
            margin-bottom: 20px;

            h5 {
                position: relative;
                margin-bottom: 10px;
                height: 30px;

                span {
                    position: absolute;
                    top: 0;
                    left: 0;
                    margin-left: 20px;
                    padding: 0 10px;
                    font-size: 20px;
                    font-weight: 300;
                    background-color: #fff;
                    z-index: 3;
                }

                &::before {
                    transform: translateY(15px);
                    display: block;
                    content: '';
                    width: 100%;
                    height: 1px;
                    background: #e6e6e6;
                }
            }
        }

        .article_comment {
            margin-top: 20px;

            ul {
                position: relative;
                margin-bottom: 10px;
                color: #515250;

                li {
                    padding: 15px;
                    border-top: 1px dotted grey;
                    font: 14px/1.5 "Helvetica neue", Helvetica, Tahoma, "lantinghei sc", "Microsoft Yahei", sans-serif;
                    list-style: none;
                    background: #fff;
                    animation: zoomIn 1s both;
                    @keyframes zoomIn {
                        0% {
                            opacity: 0;
                            transform: scale3d(.3, .3, .3);
                        }
                        50% {
                            opacity: 1;
                        }
                    }

                    &:nth-child(1) {
                        border-top: 0;
                    }

                    div.msg {
                        position: relative;
                        font-size: 13px;

                        div.photo {
                            position: absolute;
                            margin: 5px 5px 5px 0;

                            img {
                                display: block;
                                width: 45px;
                                height: 45px;
                                border-radius: 50px;
                            }
                        }

                        div.user {
                            padding-top: 5px;
                            margin-left: 53px;
                            font-size: 14px;

                            .name {
                                padding-right: 5px;
                                color: #01aaed;
                            }

                            .blogger {
                                display: inline-block;
                                padding: 0 5px;
                                margin-right: 5px;
                                border-radius: 3px;
                                color: #fff;
                                background: #de6f7f;
                            }

                            .equipmentInfo {
                                padding-right: 5px;
                                color: #a93838;
                            }
                        }

                        div.txt {
                            padding: 2px 0 5px 0;
                            margin-left: 53px;
                            min-height: 30px;
                            word-break: break-all;
                        }

                        div.siteInfo {
                            padding-top: 5px;
                            margin-left: 53px;

                            span {
                                padding-right: 5px;
                            }

                            span.textarea {
                                padding: 0;
                                color: #009688;
                                cursor: pointer;
                                user-select: none;
                            }
                        }
                    }

                    hr {
                        height: 1px;
                        margin: 10px 0 10px 53px;
                        border: 0;
                        clear: both;
                        background-color: #e6e6e6;
                    }

                    div.reply {
                        position: relative;
                        margin-left: 53px;
                        min-height: 50px;

                        div.photo {
                            position: absolute;
                            margin: 5px 5px 5px 0;

                            img {
                                display: block;
                                width: 40px;
                                height: 40px;
                                border-radius: 50px;
                            }
                        }

                        div.replyTxt {
                            padding-top: 5px;
                            margin-left: 50px;
                            font-size: 12px;
                            line-height: 20px;

                            .name {
                                padding-right: 5px;
                                line-height: 20px;
                                color: #01aaed;
                            }

                            .blogger {
                                display: inline-block;
                                padding: 0 5px;
                                margin-right: 5px;
                                border-radius: 3px;
                                font-size: 12px;
                                color: #fff;
                                background: #de6f7f;
                            }

                            div {
                                display: inline-block;
                                padding-left: 5px;
                                word-break: break-all;
                            }
                        }

                        div.info {
                            padding-top: 5px;
                            margin-left: 53px;
                            font-size: 12px;

                            span {
                                padding-right: 5px;
                            }

                            span.textarea {
                                padding: 0;
                                color: #009688;
                                cursor: pointer;
                                user-select: none;
                            }
                        }
                    }

                    .replyText {
                        display: none;
                        overflow: hidden;
                        margin-top: 5px;
                        margin-left: 53px;
                        height: 0;
                        box-sizing: border-box;

                        &.on {
                            height: auto;
                            display: block;
                        }

                        #textarea {
                            display: block;
                            padding: 6px 10px;
                            border: 1px solid #e6e6e6;
                            border-radius: 2px;
                            margin-bottom: 10px;
                            width: 100%;
                            height: auto;
                            min-height: 80px;
                            font: 14px/1.5 "Microsoft YaHei", "微软雅黑", "Helvetica Neue", "Hiragino Sans GB", Helvetica, Tahoma, sans-serif;
                            line-height: 20px;
                            resize: vertical;
                            color: #515250;
                            background-color: #fff;
                            outline: 0;
                            box-sizing: border-box;
                            transition: all .3s;

                            &:focus {
                                border-color: #C9C9C9 !important;
                            }

                            &:hover {
                                border-color: #D2D2D2 !important;
                            }
                        }

                        .btn {
                            padding: 0;
                            margin: 0 0 5px;

                            button {
                                padding: 0 20px;
                                height: 25px;
                                font-size: 12px;
                                line-height: 25px;
                            }
                        }
                    }
                }
            }
        }

        .hint {
            overflow: hidden;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            border-radius: 4px;
            padding: 16px 24px;
            line-height: 1.5;
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, .17);
            box-sizing: border-box;
            opacity: 0.3;
            transition: all .3s;
            z-index: 0;

            &.right {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
                z-index: 999;
            }

            .icon {
                float: left;
                margin-right: 8px;
                color: #128af0;;

                span {
                    display: block;
                    font-weight: bold;
                    font-size: 34px;

                    &.error {
                        color: #f5222d;
                    }
                }
            }

            .txt {
                float: left;
                line-height: 50px;
            }
        }
    }
}

@media screen and (max-width: 1366px) {
    .warp_article > div {
        width: 90%;
    }
}

//@media screen and (max-width: 600px) {
//    .warp_article
//}
</style>
