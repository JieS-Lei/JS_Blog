<template>
    <div>
        <Nav @ifLogin="ifLoginFn" v-if="isRouterAliveNav"></Nav>
        <msgContent :ifLogin="login" v-if="isRouterAliveMsg"></msgContent>
        <Footer></Footer>
        <upScrollBtn></upScrollBtn>
    </div>
</template>

<script>
    import Nav from "../../components/Nav";
    import Footer from "../../components/Footer";
    import upScrollBtn from "../../components/upScrollBtn";
    import msgContent from "../../views/Message/msgContent";

    export default {
        name: "Message",
        components:{
            Nav,
            Footer,
            upScrollBtn,
            msgContent,
        },
        provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
            return {
                reloadNav: this.reloadNav,
                reloadMsgContent: this.reloadMsgContent,
            }
        },
        data(){
            return {
                isRouterAliveNav: true, //nav组件的刷新
                isRouterAliveMsg: true, //msg组件的刷新
                login : [false,{}],
            }
        },
        methods: {
            ifLoginFn(data) {
                this.login = data;
            },
            //刷新Nav组件函数
            reloadNav(){
                this.isRouterAliveNav = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAliveNav = true;         //再打开
                })
            },
            reloadMsgContent(){
                this.isRouterAliveMsg = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAliveMsg = true;         //再打开
                })
            },

        },
    }
</script>

<style scoped>

</style>
