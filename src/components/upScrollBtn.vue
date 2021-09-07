<template>
    <div id="upScroll" v-show="ifShow" @click="toTopFn">
        <i class="iconfont icon-top1"></i>
    </div>
</template>

<script>
    export default {
        name: "upScrollBtn",
        data(){
            return{
                ifShow: false,
                timer_Scroll: null,
                timer_Top: null,
            }
        },
        methods:{
            //检查滚动高度,判断组件是否加载
            scrollFn(){
                let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
                this.ifShow =  scrollHeight > 150;
            },
            //scrollFn节流函数
            throttleScrollFn(){
                clearTimeout(this.timer_Scroll);
                this.timer_Scroll = setTimeout(this.scrollFn,250);
            },
            //回到顶部事件
            toTopFn(){
                //节流
                if (typeof this.timer_Top === 'number') return
                //动画代码
                let nowHeight = document.documentElement.scrollTop || document.body.scrollTop;
                if(nowHeight < 150) return
                let _height = 1;
                this.timer_Top = setInterval(()=>{
                    nowHeight -= _height;
                    if (nowHeight < 0) nowHeight = 0;
                    document.documentElement.scrollTop = document.body.scrollTop = nowHeight;
                    if (!nowHeight) {
                        clearInterval(this.timer_Top);
                        this.timer_Top = null;
                    }
                    _height += 2;
                },10)
            }
        },
        created(){
            window.addEventListener("scroll", this.throttleScrollFn);
        }
    }
</script>

<style scoped lang="less">
    #upScroll{
        position: fixed;
        right: 15px;
        bottom: 15px;
        z-index: 99;
        i{
            display: block;
            border-radius: 2px;
            margin-bottom: 1px;
            width: 50px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 40px;
            color: #fff;
            background-color: #9F9F9F;
            opacity: .95;
            cursor: pointer;
            &:hover{
                opacity: .85;
            }
        }
    }
</style>