<template>
    <div id="footer">
        <div>
            <ul>
                <li><a href=""><i class="iconfont icon-github"></i></a></li>
                <li><a href=""><i class="iconfont icon-email"></i></a></li>
                <li><a href=""><i class="iconfont icon-qq1"></i></a></li>
                <li><a href=""><i class="iconfont icon-weixin"></i></a></li>
            </ul>
            <p>Copyright © 2020-2021 陈万磊 TIDC V.1.0.0 备案号:<a href="">ABC159</a></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped lang="less">
    #footer{
        width: 100%;
        margin-top: 40px;
        padding: 20px 0 0 0;
        font: 14px/1.5 "Helvetica neue",Helvetica,Tahoma,"lantinghei sc",sans-serif;
        line-height: 20px;
        background-color: #212220;
        >div{
            padding: 10px 0 10px 0;
            margin: 0 auto;
            width: 1280px;
            text-align: center;
            ul li{
                display: inline-block;
                border-radius: 50%;
                margin-left: 19px;
                width: 30px;
                height: 30px;
                text-align: center;
                text-shadow: 1px 1px 1px rgba(0,0,0,.5);
                line-height: 30px;
                background-color: rgba(255,255,255,.2);
                transition: background-color .3s;
                &:hover{
                    a>i{
                        color: #fff;
                    }
                }
                &:nth-child(1){
                    margin-left: 15px;
                    &:hover{
                        background-color: #b952c5;
                        color: #fff;
                    }
                }
                &:nth-child(2){
                    &:hover{
                        background-color: #d25744;
                    }
                }
                &:nth-child(3){
                    &:hover{
                        background-color: #668f20;
                        color: #fff;
                    }
                }
                &:nth-child(4){
                    &:hover{
                        background-color: #06a2c9;
                        color: #fff;
                    }
                }
                a{
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    i{
                        font-size: 14px;
                        text-align: center;
                        color: rgba(255,255,255,.5);
                        transition: color .3s;
                    }
                }
            }
            p{
                margin-top: 5px;
                font-size: 13px;
                text-align: center;
                color: #565755;
                a{
                    color: white;
                }
            }
        }
    }
    @media all and (max-width: 1366px) {
        #footer>div{
            width: 90%;
        }
    }
</style>
