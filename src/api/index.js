import axios from "axios";

//配置默认参数
axios.defaults.baseURL = 'http://28248m0b43.zicp.vip'; //默认访问地址
axios.defaults.withCredentials = true; //跨域允许携带cookie
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; //设置Post请求格式

export default {
    //请求文章信息
    getArticleInfo(){
        return axios.post("/article/getInfo")
    },
    /*
    * 请求热门文章
    * @params
    *   limit: Number 可选 不传值后台默认为8
    *       一共请求多少条数据
    *
    * @return
    *   返回axios请求的promise
    * */
    getArticleHot(limit){
        return axios.post("/article/getHot",{limit})
    },
    /*
    * 获取文章列表
    * @params
    *   tag: String 必选  值为""的话默认返回所有类型的文章
    *       由传回字符串，让后台判断返回哪个类型的文章
    *   ifFresh: boolean 判断是不是第一次发送请求
    *
    * @return
    *   返回axios请求的promise
    * */
    getArticle : (() => {
        let skip = 0,
            limit = 5;
        return function (tag,ifFresh = false) {
            if (ifFresh){
                skip = 0;
                limit = 5;
            }else skip += limit;

            return axios.post("/article/getArticle", {skip,limit,tag});
        }
    })(),
    //搜索文章
    searchArticle(keywords){
      return axios.post("/article/search",{keywords})
    },
    //最近访客
    getVisitor(){
        return axios.post("/visitor")
    },
    //获取验证码svg标签
    getSvgVCode(){
        return axios.post("/register/VCode")
    },
    /*
    * 验证码提交验证
    * @params
    *   VCode: String 必选
    *       后台由传回的字符串,判断验证码是否正确
    *
    * @return
    *   返回axios请求的promise
    * */
    CheckVCode(VCode){
        return axios.post("/register/CheckVCode",{VCode})
    },
    /*
    * 注册信息提交
    * @params
    *   userName: String 必选  用户名
    *   password: String 必选  密码
    *   VCode:    String 必选  验证码
    *       (以上参数都不能为空)
    *
    * @return
    *   返回axios请求的promise
    * */
    postRegister(userName,password,VCode){
        return axios.post("/register",{userName,password,VCode});
    },
    /*
    * 登录信息提交
    * @params
    *   userName: String 必选  用户名
    *   password: String 必选  密码
    *       (以上参数都不能为空)
    *
    * @return
    *   返回axios请求的promise
    * */
    postLogin(userName,password){
        return axios.post("/login",{userName,password});
    },
    //登录状态
    postIfLogin(){
        return axios.post("/login/ifLogin",);
    },
    //登出
    postLogout(){
        return axios.post("/login/logout",);
    },
    /*
    * 留言接口
    * @params
    *   options: Object 必选
    *       参数 user: ObjectId 必 留言者信息
    *           content: String 必 留言内容
    *           browser: String 留言者的浏览器信息
    *           location: String 留言者所在城市
    * @return
    *   返回axios请求的promise
    * */
    postMessage(option){
        return axios.post("/message/commit",option)
    },
    /*
    * 回复接口
    * @params
    *   options: Object 必选
    *       参数 parentId: ObjectId 必 回复的留言的ID
    *           user: ObjectId 必 回复者信息
    *           $user: String 必 被回复者用户名
    *           content: String 必 回复内容
    *           location: String 回复者所在城市
    *           browser: String 回复者的浏览器信息
    * @return
    *   返回axios请求的promise
    * */
    postChildMessage(option){
        return axios.post("/message/childCommit",option)
    },
    //获取留言 ifFresh: boolean 判断是不是第一次发送请求
    getMessageList : (() => {
        let skip = 0,
            limit = 15;
        return function (ifFresh = false) {
            if (ifFresh){
                skip = 0;
                limit = 15;
            }else skip += limit;

            return axios.post("/message/getList",{skip,limit})
        }

    })(),
    //获取某篇文章信息
    getOneArticle(_id){
        return axios.post("/article/oneArticle",{_id})
    },
    //上一篇文章
    previousArticle(tag,date){
        return axios.post("/article/previousArticle",{tag,date})
    },
    //下一篇
    nextArticle(tag,date){
        return axios.post("/article/nextArticle",{tag,date})
    },
    //获取文章评论接口
    getComment(articleId){
        return axios.post("/article/getComment",{articleId})
    },
    /*
    * 文章评论接口
    * @params
    *   options: Object 必选
    *       参数 user: ObjectId 必 留言者信息ID
    *           content: String 必 留言内容
    * @return
    *   返回axios请求的promise
    * */
    articleComment(option){
        return axios.post("/article/comment",option)
    },
    /*
    * 文章评论的回复 接口
    * @params
    *   options: Object 必选
    *       参数 parentId: ObjectId 必 回复的评论的ID
    *           user: ObjectId 必 回复者信息
    *           $user: String 必 被回复者用户名
    *           content: String 必 回复内容
    * @return
    *   返回axios请求的promise
    * */
    articleChildComment(option){
        return axios.post("/article/childComment",option)
    },
    //头像上传的接口
    avatarUpload(photo){
        return  axios.post("/upload/avatar", photo, { headers: {
                'Content-Type': 'multipart/form-data'
            } })
    }
};
