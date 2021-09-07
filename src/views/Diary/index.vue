<template>
    <div>
        <Nav></Nav>
        <diaryContent></diaryContent>
        <Footer></Footer>
        <upScrollBtn></upScrollBtn>
    </div>
</template>

<script>
    import Nav from "../../components/Nav";
    import diaryContent from "./diaryContent";
    import upScrollBtn from "../../components/upScrollBtn";
    import Footer from "../../components/Footer";

    export default {
        name: "Diary",
        components:{
            Nav,
            diaryContent,
            Footer,
            upScrollBtn,
        }
    }
</script>

<style scoped>

</style>