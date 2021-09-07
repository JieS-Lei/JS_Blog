<template>
    <div id="shell">
        <div id="wrap">
            <div class="bg"></div>
            <i class="iconfont icon-shuangzuojiantou-"></i>
            <div class="txt"><span>请按住滑块，拖动到最右边</span></div>
        </div>
    </div>
</template>

<script>

export default {
    name: "slidingBlock",
    data(){
        return{
            verify: false,
        }
    },
    methods: {
        exportFn(){
            this.$emit("ifPass",this.verify);
        }
    },
    mounted(){
        //判断是移动端还是PC端，动态设置事件
        let _device = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent);
        let mousedown = _device ? 'touchstart' : 'mousedown';
        let mousemove = _device ? 'touchmove' : 'mousemove';
        let mouseup = _device ? 'touchend' : 'mouseup';

        //需求变量
        let This = this;
        let wrap = document.querySelector("#wrap"),
            bgBox = document.querySelector(".bg"),
            span = document.querySelector("#wrap>i"),
            txt = document.querySelector(".txt");
        let bgBoxMaxWidth = wrap.offsetWidth - span.offsetWidth;
        let x;

        function mousemoveFn(e){
            let _x = (e.pageX || e.clientX || e.changedTouches[0].pageX) - x;
            bgBox.style.width = _x+2 + "px";
            span.style.marginLeft = _x + "px";
            //滑动轨道两边极限的限制
            if (span.offsetLeft < 0 || bgBox.offsetWidth < 0) bgBox.style.width = span.style.marginLeft = 0 + 'px';
            if (span.offsetLeft >= bgBoxMaxWidth || bgBox.offsetWidth >= bgBoxMaxWidth){
                txt.innerHTML = "验证通过！";
                txt.style.color = "#fff";
                bgBox.style.width = bgBoxMaxWidth+2 + "px";
                span.style.marginLeft = bgBoxMaxWidth + "px";
                This.verify = true;
                This.exportFn();
                document.removeEventListener("mousemove",mousemoveFn);
            }
        }
        function mouseupFn(){
            //清除鼠标滑动事件
            document.removeEventListener(mousemove,mousemoveFn);
            if (This.verify) return
            span.classList.add("move"); //加动画
            bgBox.classList.add("move");
            span.style.marginLeft = 0 + 'px'; //滑块归位
            bgBox.style.width = 0 + 'px';
        }
        function mousedownFn(e){
            x = e.pageX || e.clientX || e.changedTouches[0].pageX;
            if (This.verify) return
            bgBox.classList.remove("move");
            span.classList.remove("move");
            //添加鼠标滑动事件
            document.addEventListener(mousemove,mousemoveFn);
            //添加鼠标抬起事件
            document.addEventListener(mouseup,mouseupFn);
        }
        //添加鼠标按下事件
        span.addEventListener(mousedown,mousedownFn);
    }
}
</script>

<style scoped lang="less">
    #shell{
        padding: 0 15px;
        user-select: none;
        #wrap{
            overflow: hidden;
            position: relative;
            border-radius: 5px;
            margin-bottom: 25px;
            width: auto;
            height: 36px;
            box-sizing: border-box;
            background: #e8e8e8;
            .bg{
                position: absolute;
                width: 0;
                height: 100%;
                background-color: #409eff;
            }
            >i{
                position: absolute;
                left: 0;
                border: 1px solid #ccc;
                border-radius: 5px;
                width: 40px;
                height: 36px;
                line-height: 36px;
                font-size: 24px;
                text-align: center;
                cursor: move;
                background: #fff;
                box-sizing: border-box;
                z-index: 2;
                &.iconfont{
                    font-size: 17px;
                    transform: rotate(180deg);
                }
                &:hover{
                    color: #06a2c9;

                }
            }
            //动画
            .bg.move,i.move{
                transition: all .3s;
            }
            .txt{
                width: 100%;
                text-align: center;
                position: absolute;
                border-radius: 5px 0 0 5px;
                z-index: 1;
                background: transparent;
                color: #9c9c9c;
                line-height: 36px;
                font-size: 12px;
                cursor: pointer;
                @keyframes slideToUnlock{
                    0%{background-position: -130px 0}
                    100%{background-position: 130px 0}
                }
                span{
                    display: inline-block;
                    width: 100%;
                    background: -webkit-gradient(linear,left top,right top,color-stop(0,#4d4d4d),color-stop(.4,#4d4d4d),color-stop(.5,#fff),color-stop(.6,#4d4d4d),color-stop(1,#4d4d4d));
                     -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    -webkit-animation: slideToUnlock 3s infinite;
                    -webkit-text-size-adjust: none;
                    z-index: 0;
                }
            }
        }
    }
</style>
