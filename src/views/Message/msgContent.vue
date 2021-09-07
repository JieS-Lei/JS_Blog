<!--suppress JSUnresolvedVariable, JSDeprecatedSymbols, SpellCheckingInspection -->
<template>
    <div class="container">
        <div class="msgInputBox">
            <div class="title">
                <h1>留言板</h1>
                <p>沟通交流 - 是人与人之间最神奇的魔法！</p>
            </div>
            <div class="inputBox">
                <quill-editor
                    v-model="content"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                </quill-editor>
            </div>
            <div class="btn">
                <button type="button" @click="submitFn">提交留言</button>
            </div>
        </div>
        <div class="msgShow">
            <ul>
                <li v-for="(item,index) in data" :key="item._id">
                    <div class="msg">
                        <div class="photo">
                            <img :src="item.user.headPortrait" :alt="item.user.userName">
                        </div>
                        <div class="user">
                            <span class="name">{{ item.user.userName }}</span>
                            <span class="blogger" v-if="item.user.admin">站长</span>
                            <span class="equipmentInfo">{{ item.browser }}</span>
                        </div>
                        <div class="ql-snow">
                            <div class="ql-editor txt" v-html="item.content"></div>
                        </div>
                        <div class="siteInfo">
                            <i class="iconfont icon-location"></i>
                            <span>{{ item.location }}</span>
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
                            <i class="iconfont icon-location"></i>
                            <span>{{ node.location }}</span>
                            <span class="equipmentInfo">{{ node.browser }}</span>
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
                <i class="iconfont icon-shibai error" v-if="!hint.ifIcon"></i>
                <i class="iconfont icon-chenggong pass" v-if="hint.ifIcon"></i>
            </div>
            <div class="txt">
                {{ hint.Txt }}
            </div>
        </div>
        <div v-if="ifLoading" class="loading"><i class="iconfont icon-jiazai1"></i></div>
        <div v-if="ifNoMore" class="noMore">没有更多了……</div>
    </div>
</template>

<script>
import request from "../../api";

const postMessage = request.postMessage;
const getMessageList = request.getMessageList;
const postChildMessage = request.postChildMessage;

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
    name: "msgContent",
    inject: ['reloadNav','reloadMsgContent'],
    data() {
        return {
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
            },
            ifLoading: false,
            ifNoMore: false,
            //提示框动画及内容
            hint: {
                ifRight: false, //弹出框的显示
                Txt: '', //弹出框的内容
                ifIcon: false, //图标的切换
                timer: null,
            },
            //默认留言内容
            data: [],
        }
    },
    props: ["ifLogin"],
    methods: {
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
            let fmt = "yyyy-MM-dd hh:mm:ss";
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
        //获取浏览器类型及其版本函数
        BrowserFn() {
            // noinspection JSUnresolvedletiable,JSUnusedGlobalSymbols
            let document = window.document,
                navigator = window.navigator,
                agent = navigator.userAgent.toLowerCase(),
                //IE8+支持.返回浏览器渲染当前文档所用的模式
                //IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
                //IE10:10(兼容模式7||8||9)
                IEMode = document.documentMode,
                //chrome
                chrome = window.chrome || false,
                //IE Edge
                Edge = false,
                System = {
                    //user-agent
                    agent: agent,
                    //是否为IE
                    isIE: /msie/.test(agent) || /trident/.test(agent),
                    //Gecko内核
                    isGecko: agent.indexOf("gecko") > 0 && agent.indexOf("like gecko") < 0,
                    //webkit内核
                    isWebkit: agent.indexOf("webkit") > 0,
                    //是否为标准模式
                    isStrict: document.compatMode === "CSS1Compat",
                    //是否支持subtitle
                    supportSubTitle: function () {
                        return "track" in document.createElement("track");
                    },
                    //是否支持scoped
                    supportScope: function () {
                        return "scoped" in document.createElement("style");
                    },
                    //获取IE的版本号
                    ieVersion: function () {
                        try {
                            return agent.match(/(edge.|msie\s|trident.*rv:)([\d.]+)/)[2] || 0;
                        } catch (e) {
                            console.log("error" + e);
                            return IEMode;
                        }
                    },
                    //Opera版本号
                    operaVersion: function () {
                        try {
                            // noinspection JSUnresolvedVariable
                            if (window.opera) return agent.match(/opera.([\d.]+)/)[1];
                            else if (agent.indexOf("opr") > 0) return agent.match(/opr\/([\d.]+)/)[1];
                        } catch (e) {
                            console.log("error" + e);
                            return 0;
                        }
                    },
                    //描述:version过滤.如31.0.252.152 只保留31.0
                    versionFilter: function () {
                        if (arguments.length === 1 && typeof arguments[0] === "string") {
                            let version = arguments[0], start, end;
                            start = version.indexOf(".");
                            if (start > 0) {
                                end = version.indexOf(".", start + 3);
                                if (end !== -1) {
                                    return version.substr(0, end);
                                }
                            }
                            return version;
                        } else if (arguments.length === 1) return arguments[0];
                        return 0;
                    }
                };
            //IE Edge
            if (!window.external.contextMenuSourceElement && navigator.userAgent.indexOf("Edge") > -1) {
                chrome = false;
                System.isIE = true;
                Edge = true;
            }

            // noinspection SpellCheckingInspection
            try {
                //浏览器类型(IE、Opera、Chrome、Safari、Firefox)
                System.type = System.isIE ? "IE" :
                    window.opera || (agent.indexOf("opr") > 0) ? "Opera" :
                        (agent.indexOf("chrome") > 0) ? "Chrome" :
                            //safari也提供了专门的判定方式
                            window.openDatabase ? "Safari" :
                                (agent.indexOf("firefox") > 0) ? "Firefox" :
                                    'unknown';

                //版本号
                System.version = (System.type === "IE") ? System.ieVersion() :
                    (System.type === "Firefox") ? agent.match(/firefox\/([\d.]+)/)[1] :
                        (System.type === "Chrome") ? agent.match(/chrome\/([\d.]+)/)[1] :
                            (System.type === "Opera") ? System.operaVersion() :
                                (System.type === "Safari") ? agent.match(/version\/([\d.]+)/)[1] :
                                    "0";

                //浏览器外壳
                System.shell = function () {
                    //遨游浏览器
                    // noinspection SpellCheckingInspection
                    if (agent.indexOf("maxthon") > 0) {
                        System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version;
                        return "傲游浏览器";
                    }
                    //QQ浏览器
                    if (agent.indexOf("qqbrowser") > 0) {
                        System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version;
                        return "QQ Browser";
                    }

                    //搜狗浏览器
                    if (agent.indexOf("se 2.x") > 0) return '搜狗浏览器';

                    //Chrome:也可以使用window.chrome && window.chrome.webstore判断
                    if (chrome && System.type !== "Opera") {
                        let external = window.external,
                            clientInfo = window.clientInformation,
                            //客户端语言:zh-cn,zh.360下面会返回undefined
                            clientLanguage = clientInfo.languages;

                        //猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                        if (external && 'LiebaoGetVersion' in external) {
                            return '猎豹浏览器';
                        }
                        //百度浏览器
                        if (agent.indexOf("bidubrowser") > 0) {
                            System.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
                                agent.match(/chrome\/([\d.]+)/)[1];
                            return "百度浏览器";
                        }
                        //360极速浏览器和360安全浏览器
                        if (System.supportSubTitle() && typeof clientLanguage === "undefined") {
                            //object.key()返回一个数组.包含可枚举属性和方法名称
                            // noinspection JSUnusedLocalSymbols
                            let storeKeyLen = Object.keys(chrome.webstore).length,
                                v8Locale = "v8Locale" in window;
                            return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                        }
                        return "Chrome";
                    }

                    //IE Edge
                    if (typeof Edge === 'boolean' && Edge) return "Edge"
                    return System.type;
                };
                //浏览器名称(如果是壳浏览器,则返回壳名称)
                System.name = System.shell();
                //对版本号进行过滤过处理
                System.version = System.versionFilter(System.version);
            } catch (e) {
                console.log("error" + e);
            }

            {
                //判断是否是移动端
                let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
                if (flag)
                    System.name = "Mobile " + System.name;
            }

            return System.name + " " + System.version;
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
        //提交button提交留言事件
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
                user: this.ifLogin[1]._id,
                content: this.content,
                location: window.returnCitySN ? window.returnCitySN.cname : "中国",
                browser: this.BrowserFn(),
            };
            postMessage(options)
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.msg === "未登录或登录超时") {
                            this.hintFn("登录超时,请重新登录！", 2000);
                            this.reloadNav();
                            return
                        }
                        this.hintFn("数据类型错误！", 2000);
                        return
                    }
                    if (res.data.code === 0) {
                        this.hintFn("留言提交成功", 2000, true);
                        this.content = null;
                        setTimeout(() => {
                            this.init()
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
        //回复按钮事件
        replyBtnFn(index) {
            if (!this.ifLogin[0]) return this.hintFn("请登录账号！", 2000);
            if (!this.data.length) return this.hintFn("未知错误！", 4000);
            if (!this.data[index].replyTxt.content) return this.hintFn("请输入内容！");
            let options = {
                parentId: this.data[index]._id,
                content: this.data[index].replyTxt.content,
                user: this.ifLogin[1]._id,
                reUser: this.data[index].replyTxt.reUser,
                browser: this.BrowserFn(),
                location: window.returnCitySN ? window.returnCitySN.cname : "中国",
            }
            postChildMessage(options)
                .then(res => {
                    if (res.data.code === 1) {
                        if (res.data.msg === "未登录或登录超时") {
                            this.hintFn("登录超时,请重新登录！", 2000);
                            this.reloadNav();
                            return
                        }
                        this.hintFn("数据类型错误！", 2000);
                        return
                    }
                    if (res.data.code === 2) {
                        this.hintFn("此评论不存在！", 2000);
                        setTimeout(() => this.reloadMsgContent(), 800);
                        return
                    }
                    if (res.data.code === 0) {
                        this.hintFn("评论提交成功", 2000, true);
                        this.data[index].replyTxt.content = null;
                        this.data[index].replyTxt.ifShow = false;
                        setTimeout(() => {
                            this.init()
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
        //滚动加载留言函数
        messageScrollFn(cb) {
            if (this.ifLoading || this.ifNoMore) return;
            //滚动高
            let a = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
            //可视区高
            let b = document.documentElement.clientHeight;
            //文档高
            let c = document.documentElement.offsetHeight;
            if ((a + b) >= (c - 200)) {
                this.ifLoading = true;
                getMessageList().then(res => {
                    let data = res.data.data;
                    if (data.length) this.data.push(...data.map(itme => {
                        itme.replyTxt = {
                            user: '', //id
                            content: null, //内容
                            date: '', //日期
                            reUser: '', //回复给谁
                            browser: '', //浏览器信息
                            location: '', //地址
                            ifShow: false,
                            listIndexArr: [],
                        };
                        return itme;
                    }));
                    else this.ifNoMore = true;
                    cb || cb();
                    this.ifLoading = false;
                }).catch(err => {
                    console.error("articleData数据加载失败", err);
                    this.ifLoading = false;
                });
            }
        },
        //初始函数
        init() {
            this.ifLoading = this.ifNoMore = false;
            getMessageList(true).then(res => {
                let data = res.data.data;
                this.data = data.map(item => {
                    item.replyTxt = {
                        user: '', //id
                        content: null, //内容
                        date: '', //日期
                        reUser: '', //回复给谁
                        browser: '', //浏览器信息
                        location: '', //地址
                        ifShow: false,
                        listIndexArr: [],
                    };
                    return item;
                })
                this.ifLoading = false;
            }).catch(err => {
                console.error(err);
            })
        }
    },
    created() {
        this.init();
    },
    mounted() {
        //给富文本工具栏添加title
        document.getElementsByClassName('ql-editor')[0].dataset.placeholder = ''
        for (let item of titleConfig) {
            let tip = document.querySelector('.quill-editor ' + item.Choice)
            if (!tip) continue
            tip.setAttribute('title', item.title)
        }
        //滚动加载留言
        window.addEventListener("scroll", this.messageScrollFn);
    },
    destroyed() {
        window.removeEventListener("scroll", this.searchScrollFn);
    },
}
</script>

<style scoped lang="less">
.container {
    margin: 74px auto 0;
    width: 90%;

    .msgInputBox {
        background-color: #fff;

        .title {
            padding: 15px;
            text-align: center;
            color: #515250;

            h1 {
                font-size: 28px;
                font-weight: 700;
            }

            p {
                font-size: 17.5px;
                margin: 17.5px 0;
            }
        }

        .inputBox {
            position: relative;
            padding: 15px;
        }
    }

    .btn {
        display: inline-block;
        margin: 0 15px 20px;

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

    .msgShow {
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

                        .iconfont {
                            padding: 0;
                            margin: 0 5px;
                            font-size: 13px;
                            font-weight: bolder;
                        }

                        .textarea {
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

                        .iconfont {
                            padding: 0;
                            margin: 0 5px;
                            font-size: 12px;
                            font-weight: bolder;
                        }

                        .equipmentInfo {
                            color: #a93838;
                        }

                        .textarea {
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

    .loading {
        margin: 10px 0;
        text-align: center;
        color: #999;
        user-select: none;

        .iconfont {
            display: inline-block;
            height: 32px;
            font-size: 30px;
            line-height: 32px;
            color: #898999;
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

    .noMore {
        margin: 10px 0;
        font-size: 14px;
        line-height: 1.5;
        text-align: center;
        color: #999;
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

            .iconfont {
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

@media screen and(min-width: 1366px) {
    .container {
        width: 1280px;
    }
}
</style>
