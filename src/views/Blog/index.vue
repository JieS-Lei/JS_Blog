<template>
    <div>
        <Nav></Nav>
        <blog-content></blog-content>
        <Footer></Footer>
        <upScrollBtn></upScrollBtn>
    </div>
</template>

<script>
    import Nav from "@/components/Nav";
    import blogContent from "./blogContent";
    import Footer from "@/components/Footer";
    import upScrollBtn from "@/components/upScrollBtn";

    export default {
        name: "Blogs",
        components:{
            Nav,
            blogContent,
            Footer,
            upScrollBtn,
        }
    }
</script>

<style scoped>

</style>