<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  watch: {
    //监听路由是否变化
    '$route'(to) {
      if (to.name === "Blog") /^(1|2|3|4|5|6|undefined)$/.test(to.params.id) || this.$router.push("/404");
    }
  },
  mounted() {
    if (navigator.userAgent.match(/Trident\/7\./)) {
      this.$router.push("/404");
    }
  }
}
</script>

<style lang="less">
@import "assets/css/reset.css";
@import "assets/css/font.css";
@import "https://at.alicdn.com/t/font_1786165_1g9kr1s2ssl.css";

#app {
  overflow: hidden;
  width: 100%;
  background: url("http://28248m0b43.zicp.vip/images/bgImg3.jpg") center top/cover fixed;

  > div {
    overflow: hidden;
  }

  //富文本高度
  .ql-container .ql-editor {
    min-height: 200px;
  }
}

.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}
</style>
