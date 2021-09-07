<template>
    <div class="Bg_lucency" @touchmove.prevent @mousewheel.prevent>
        <p v-if="!!upSucceed">更新成功</p>
        <div class="Bg_white">
            <h2 class="title">更换头像</h2>
            <div class="wrap">
                <span class="hint" v-if="!!uping">{{ uptxt }}</span>
                <div class="uploading">
                    <div class="input_bg">
                        <img v-if="!!imgSrc.length" :src="imgSrc" alt="" style="width: 180px;height: 180px">
                    </div>
                    <label v-if="!!!imgSrc.length" for="file_input">
                        <i class="iconfont icon-pictureupload"></i>
                        <span>选择图片</span>
                    </label>
                    <div class="reset_img">
                        <label v-if="!!imgSrc.length" for="file_input">
                            <i class="iconfont icon-zhongxin"></i>
                            <span>重新选择</span>
                        </label>
                    </div>
                    <input style="display: none" @change="getFile($event)" type="file" id="file_input" accept="image/png,image/jpg,image/jpeg,image/gif">
                    <span v-if="error.ifError">{{error.txt}}</span>
                </div>
                <div class="border-line"></div>
                <div class="preview">
                    <div class="img" :style="'background-image:url(' + ( imgSrc.length?imgSrc:ifLogin[1].photo )  + ');'"></div>
                    <div class="text">{{imgSrc.length?"预览头像":"当前头像"}}</div>
                </div>
            </div>
            <p>请选择图片上传：推荐大小180 * 180像素支持JPG、PNG等格式，图片需小于1M</p>
            <div class="btn">
                <input @click="reloadAvatar" class="off" type="button" value="取消">
                <input @click="ifBtn && uploading()" :class="{'on':ifBtn}" type="button" value="更新">
            </div>
        </div>
    </div>
</template>

<script>
    import request from "../api/index";
    const avatarUpload = request.avatarUpload;

    export default {
        name: "Avatar",
        inject: ['reloadAvatar'],
        props:{
            ifLogin: {
                type: Array,
                default: [false,{}],
            }
        },
        data(){
            return {
                imgSrc: '', //浏览器暂存文件的base64链接
                upath: '', //文件信息
                upSucceed: 0,
                uping: 0,
                uptxt: '',
                ifBtn: false,
                error: {
                    ifError: false,
                    txt: ""
                },
            }
        },
        methods: {
            errorFn(txt = ""){
                if (typeof txt !== 'string') return console.log("errorFn参数错误");
                if (!txt.length){
                    this.error.ifError = false;
                    this.error.txt = "";
                    return
                }
                if (this.ifBtn){
                    this.ifBtn = false;
                    this.imgSrc = "";
                }
                this.error.ifError = true;
                this.error.txt = txt;
            },
            uploading(){
                let formData = new FormData();
                formData.append("file",this.upath);
                this.uping = 1;
                this.uptxt = "正在上传头像…… (〃'▽'〃)";
                avatarUpload(formData)
                    .then(res => {
                        if (typeof res.data !== 'string' && res.data !== 'ok') return
                        this.uping = 0;
                        this.upSucceed = 1;
                        setTimeout(() => {
                            this.upSucceed = 0;
                            this.reloadAvatar();
                            this.$emit('upload',true);
                        },1000)
                    })
                    .catch(err => {
                        this.uptxt = "上传失败o(╥﹏╥)o";
                        console.error(err)
                    })
            },
            getFile: function (event) {
                this.upath = event.target.files[0];
                if (!this.upath) return
                if ( !/^(image\/jpeg|image\/png|image\/gif)$/.test(this.upath.type) ) return this.errorFn("文件格式不正确！");
                if ( this.upath.size/1024/1024 > 1) return this.errorFn("文件大于1M");
                let reader = new FileReader();
                reader.readAsDataURL(this.upath);
                reader.onload = () => this.imgSrc = reader.result;
                this.errorFn(); //初始化报错信息
                this.ifBtn = true; //提交验证通过
            },
        },
        created() {
            if (!this.ifLogin[0]) {
                this.reloadAvatar();
                alert("请先登录！");
            }
        }
    }
</script>

<style scoped lang="less">
    .Bg_lucency{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        z-index: 100;
        animation: Move .3s both;
        user-select: none;
        @keyframes Move{
            0%{
                background: rgba(0, 0, 0, 0);
            }
            50%{background: rgba(0, 0, 0, 0.6);}
        }
        .Bg_white{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 500px;
            height: 485px;
            text-align: center;
            background-color: #fff;
            animation: zoomMove .3s both;
            @keyframes zoomMove{
                0%{
                    opacity: 0;
                    transform: scale3d(.3,.3,.3);
                }
                50%{opacity: 1;}
            }
            .title{
                border-bottom: 1px solid #e8e9e7;
                font-size: 20px;
                font-weight: 400;
                line-height: 50px;
                color: #303133;
                cursor: default;
            }
            .wrap{
                display: inline-block;
                padding: 50px 20px;
                font-size: 12px;
                text-align: center;
                color: #717171;
                .uploading{
                    float: left;
                    position: relative;
                    margin-right: 40px;
                    .input_bg{
                        width: 180px;
                        height: 180px;
                        background-color: #000;
                        border-radius: 4px;
                        border: 1px solid #e5e9ef;
                    }
                    >label{
                        position: absolute;
                        top: 0;
                        left: 0;
                        border: 1px solid #e5e9ef;
                        border-radius: 4px;
                        width: 180px;
                        height: 180px;
                        transition: all .6s ease;
                        background: #f1f2f5;
                        cursor: pointer;
                        &:hover{background: #e5e9ef;}
                        .iconfont{
                            display: block;
                            margin: 52px auto 0;
                            width: 54px;
                            font-size: 54px;
                        }
                        span{
                            display: block;
                            font-family: MicrosoftYaHei,sans-serif;
                            font-size: 16px;
                            color: #6d757a;
                            line-height: 20px;
                            margin-top: 10px;
                            padding: 0 12px;
                            letter-spacing: 0;
                        }
                    }
                    >span{
                        position: absolute;
                        bottom: -27px;
                        left: 0;
                        right: 0;
                        margin-top: 5px;
                        font-size: 12px;
                        color: #f56c6c;
                    }
                    .reset_img{
                        position: absolute;
                        bottom: -28px;
                        left: 50%;
                        transform: translate(-50%);
                        label{
                            font-size: 12px;
                            color: #6d757a;
                            cursor: pointer;
                            .iconfont{
                                margin-right: 3px;
                                font-size: 12px;
                            }
                        }
                    }
                }
                .preview{
                    margin-left: 40px;
                    margin-top: 30px;
                    float: left;
                    .img{
                        overflow: hidden;
                        width: 96px;
                        height: 96px;
                        border-radius: 50%;
                        border: 1px solid #e6eaf0;
                        background-size: cover;
                        background-position: center center;
                    }
                    .text{
                        margin-top: 20px;
                        font-size: 12px;
                        color: #99a2aa;
                    }
                }
                .border-line{
                    height: 182px;
                    width: 1px;
                    background: #e5e9ef;
                    float: left;
                }
                .hint{
                    position: absolute;
                    top: 70px;
                    left: 0;
                    right: 0;
                    color: rgba(250, 113, 152,.8);
                }
            }
            p{
                font-size: 12px;
                line-height: 16px;
                color: #99a2aa;
            }
        }
        .btn{
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding: 0 80px;
            input{
                display: inline-block;
                border: 1px solid #00a1d6;
                width: 140px;
                height: 40px;
                font-size: 14px;
                line-height: 32px;
                border-radius: 4px;
                text-decoration: none;
                border-color: #f4f5f7;
                color: #ccd0d7;
                cursor: auto;
                outline: 0;
                transition: all .3s;
                &.on{
                    border: 1px solid #00a1d6;
                    color: #fff;
                    background-color: #00a1d6;
                    cursor: pointer;
                    &:hover{
                        background-color: #00b5e5;
                        border-color: #00b5e5;
                    }
                }
                &.off{
                    border: 1px solid #FB7299;
                    color: #FB7299;
                    background: #fff;
                    cursor: pointer;
                    &:hover{
                        background: #FB7299;
                        color: #fff;
                    }
                }
            }
        }
        >p{
            position: absolute;
            top: 100px;
            left: 0;
            right: 0;
            margin: 0 auto;
            width: 80px;
            height: 30px;
            border-radius: 5px;
            font-size: 12px;
            line-height: 30px;
            text-align: center;
            color: #fff;
            background-color: #00a1d6;;
            animation: downMove .3s cubic-bezier(.215,.61,.355,1);
            @keyframes downMove{
                0%{
                    opacity: 0;
                    transform: translateY(-50px);
                }
                50%{opacity: 1;}
            }
        }
    }
</style>