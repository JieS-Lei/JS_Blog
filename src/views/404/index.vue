<template>
    <div id="NotFound">
        <div class="img404">
            <img src="../../assets/images/404.png" alt="404">
            <p class="txt404">很遗憾，您访问页面不存在，请返回 <router-link to="/">孑身的主页</router-link></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Error404"
    }
</script>

<style scoped lang="less">
    #NotFound{
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: #efefef;
        user-select: none;
        div.img404{
            margin: 10% auto 0;
            font-family: 微软雅黑,serif;
            font-size: 16px;
            text-align: center;
            p{
                margin-top: 50px;
                font-size: 16px;
                color: #5d595e;
                a{
                    margin-left: 10px;
                    color: #00b391;
                    &:hover{
                        text-decoration: underline;
                    }
                }
            }
        }
    }
</style>