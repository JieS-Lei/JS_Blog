<template>
  <div id="nav_shell">
    <!-- 导航栏 -->
    <div id="nav">
      <nav>
        <div class="Name">
          Mr.Js
        </div>
        <div :class="['menu',{'show':bool}]">
          <ul :class="'list'+listFn">
            <li>
              <router-link to="/">首页</router-link>
            </li>
            <li>
              <router-link to="/blog">博客</router-link>
            </li>
            <li>
              <router-link to="/message">留言</router-link>
            </li>
            <li>
              <router-link to="/diary">日记</router-link>
            </li>
            <li>
              <router-link to="/links">友链</router-link>
            </li>
            <li>
              <router-link to="/about">关于</router-link>
            </li>
          </ul>
        </div>
        <div class="login" v-if="!ifLogin">
          <div @click="registerShowFn">
            <i class="iconfont icon-zhuce1"></i>
            <p>注册</p>
          </div>
          <div @click="loginShowFn">
            <i class="iconfont icon-denglu1"></i>
            <p>登录</p>
          </div>
        </div>
        <div class="user" v-if="ifLogin">
          <div class="photo" @mouseenter="onAndOffFn(1)" @mouseleave="onAndOffFn(0)">
            <div class="img" :style="'background-image:url(' + login.photo + ');'"></div>
            <div v-show="userMenuShow" :class="['userMenu',{'open':userMenuMove}]">
              <div class="cusp"></div>
              <div class="btn">
                <p @click="avatarFn">更换头像</p>
                <p @click="logoutFn">退出登录</p>
                <p v-if="login.admin"><a href="http://localhost:8081/#/admin" target="_blank">后台系统</a></p>
              </div>
            </div>
          </div>
          <span>{{ login.user }}</span>
        </div>
        <div class="on" @click="onFn">
          <i class="iconfont icon-icon_huabanfuben"></i>
        </div>
      </nav>
    </div>
    <!-- 登录框 -->
    <div id="loginPage" v-if="show">
      <div @touchmove.prevent @mousewheel.prevent :class="['mask',{'up':hintBoxShow}]"></div>
      <div @touchmove.prevent @mousewheel.prevent class="register" v-if="registerShow">
        <p>注册</p>
        <div @keyup.enter="ifForbidden || registerFn()">
          <form>
            <div>
              <span>用户名：</span>
              <label>
                <input @blur="blur_userFn" v-model="userName" :class="{'on':user_fail}" type="text"
                       placeholder="名字要2-7个字哦φ(>ω<*)">
                <span v-show="user_fail">{{ err_userName }}</span>
                <i class="iconfont icon-icon-test1" v-show="user_succeed"></i>
                <i class="iconfont icon-icon-test2" v-show="user_fail"></i>
              </label>
            </div>
            <div>
              <span>密码：</span>
              <label>
                <input @blur="blur_pwFn" v-model="password" :class="{'on':pw_fail}" type="password"
                       placeholder="密码要6-18位哦φ(>ω<*)">
                <span v-show="pw_fail">{{ err_password }}</span>
                <i class="iconfont icon-icon-test1" v-show="pw_succeed"></i>
                <i class="iconfont icon-icon-test2" v-show="pw_fail"></i>
              </label>
            </div>
            <div>
              <span>确认密码：</span>
              <label>
                <input @blur="blur_cPwFn" v-model="confirmPassword" :class="{'on':cPw_fail}"
                       type="password" placeholder="输两次才不会错哦φ(>ω<*)">
                <span v-show="cPw_fail">{{ err_confirmPassword }}</span>
                <i class="iconfont icon-icon-test1" v-show="cPw_succeed"></i>
                <i class="iconfont icon-icon-test2" v-show="cPw_fail"></i>
              </label>
            </div>
            <div>
              <span>验证码：</span>
              <label class="verifyCode">
                <input @input="input_VCode" @compositionend="input_VCode" v-model="VCode" type="text">
                <span v-html="svgVCode" class="verifyCode"></span>
                <span v-show="VCode_fail">{{ err_VCode }}</span>
                <i class="iconfont icon-icon-test1" v-show="VCode_succeed"></i>
                <i class="iconfont icon-icon-test2" v-show="VCode_fail"></i>
              </label>
              <!-- 动态绑定事件需要加()执行 -->
              <div @click="(VCodeText === '刷新') && svgVCodeFn()" :class="{'on':VCodeText === '刷新'}">
                <i class="iconfont icon-loading02"></i>
                <i>{{ VCodeText }}</i>
              </div>
            </div>
          </form>
          <div class="btn">
            <button type="button" @click="inputInitialize" class="oneBtn">重置表单</button>
            <button @click="ifForbidden || registerFn()" :class="{'on':ifForbidden}" type="button">立即注册
            </button>
          </div>
        </div>
        <i class="iconfont icon-guanbi1 close" @click="removeInputShowFn"></i>
      </div>
      <div @touchmove.prevent @mousewheel.prevent class="login" v-if="loginShow">
        <p>登录</p>
        <div>
          <form>
            <div>
              <span>用户名：</span>
              <label>
                <input @blur="blur_userFn" v-model="userName" :class="{'on':user_fail}" type="text"
                       placeholder="名字要2-7个字哦φ(>ω<*)">
                <span v-show="user_fail">{{ err_userName }}</span>
                <i class="iconfont icon-icon-test1" v-show="user_succeed"></i>
                <i class="iconfont icon-icon-test2" v-show="user_fail"></i>
              </label>
            </div>
            <div>
              <span>密码：</span>
              <label>
                <input @blur="blur_pwFn" v-model="password" :class="{'on':pw_fail}" type="password"
                       placeholder="密码要6-18位哦φ(>ω<*)">
                <span v-show="pw_fail">{{ err_password }}</span>
                <i class="iconfont icon-icon-test1" v-show="pw_succeed"></i>
                <i class="iconfont icon-icon-test2" v-show="pw_fail"></i>
              </label>
            </div>
          </form>
          <slidingBlock @ifPass="parentEvent" v-if="slidingBlockReset"></slidingBlock>
          <div class="btn">
            <button type="button" :class="{'on':ifForbidden}" @click="ifForbidden || loginFn()">立即登录
            </button>
          </div>
        </div>
        <i class="iconfont icon-guanbi1 close" @click="removeInputShowFn"></i>
      </div>
      <div class="confirmationBox" v-if="hintBoxShow">
        <h2>提示</h2>
        <p>{{ this.hintText }}</p>
        <div class="btn">
          <div>
            <button type="button" @click="hintBoxShow = false" v-if="hintCancelShow">取消</button>
            <button type="button" @click="affirmRemoveFn(hintCancelShow || false,hintTimer)">确认</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 头像上传 -->
    <Avatar v-if="ifAvatar" :ifLogin="[ifLogin,login]" @upload="val"></Avatar>
  </div>
</template>

<script>
//路由配置文件
import routes from "../router/routeList";
import request from "../api/index";
import slidingBlock from "./slidingBlock";
import Avatar from "@/components/Avatar";

const svgVCodeFn = request.getSvgVCode;
const CheckVCode = request.CheckVCode;
const postRegister = request.postRegister;
const {postLogin, postIfLogin, postLogout} = request;

export default {
  name: "Nav",
  components: {
    slidingBlock,
    Avatar
  },
  provide() {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reloadAvatar: this.reloadAvatar,
    }
  },
  data() {
    return {
      routeArray: (() => {
        let array = [];
        routes.forEach(item => {
          array.push(item.name);
        })
        return array
      })(),
      //导航栏选项的打开与关闭
      bool: false,
      //表单的显隐
      show: false,
      loginShow: false,
      registerShow: false,
      //提示框的显隐与显示内容
      hintBoxShow: false,
      hintText: "",
      hintCancelShow: true,
      hintTimer: null,
      //表单规则匹配成功与否的小图标的显隐
      user_succeed: false,
      user_fail: false,
      pw_succeed: false,
      pw_fail: false,
      cPw_succeed: false,
      cPw_fail: false,
      //注册和登录表单的v-model
      userName: "",
      password: "",
      confirmPassword: "",
      //注册和登录的错误信息
      err_userName: "",
      err_password: "",
      err_confirmPassword: "",
      //user正则规则
      user_regular: /^[\w\u4e00-\u9fa5\uac00-\ud7ff\u0800-\u4e00]{2,7}$/,
      //密码正则规则
      pw_regular: /^[\w<>,.?|;':"{}!@#$%^&*()\/\-\[\]\\]{6,18}$/,
      //验证码相关
      svgVCode: "loading……",
      VCodeText: "刷新",
      timer: void (0),
      //刷新按钮的节流
      time: 0,
      //验证码v-model和错误信息,及小图标的显隐
      VCode: "",
      err_VCode: "",
      VCode_succeed: false,
      VCode_fail: false,
      //登录按钮可用与否的验证
      ifForbidden: true,
      //限制注册请求的多次发送
      RegisterRequest: true,
      //登录滑块的重置
      slidingBlockReset: true,
      //是否登录以及登录信息
      ifLogin: false,
      login: {
        _id: null,
        user: null,
        photo: null,
        admin: false,
        reqDate: {
          year: null,
          month: null,
          day: null
        }
      },
      //登录后点击头像显示下拉菜单及动画
      userMenuShow: false,
      userMenuMove: false,
      userMenuTimer: null, //节流
      //更换头像
      ifAvatar: false,
      refreshAvatar: true, //刷新头像div
    }
  },
  computed: {
    listFn() {
      if (this.$route.name === 'Article') return 2;
      return this.routeArray.indexOf(this.$route.name) + 1;
    },
  },
  methods: {
    //滑块子组件传值函数
    parentEvent(data) {
      if (data === true) this.ifForbidden = false;
    },
    //导航栏选项的打开与关闭
    onFn() {
      this.bool = !this.bool;
    },
    //input表单初始化函数
    inputInitialize() {
      this.user_succeed = false;
      this.user_fail = false;
      this.userName = "";

      this.pw_succeed = false;
      this.pw_fail = false;
      this.password = "";

      this.cPw_succeed = false;
      this.cPw_fail = false;
      this.confirmPassword = "";

      this.VCode_succeed = false;
      this.VCode_fail = false;
      this.VCode = "";

      this.ifForbidden = true;
    },
    //注册框和登录框的打开与关闭
    registerShowFn() {
      this.show = true;
      this.registerShow = true;
      this.svgVCodeFn();
    },
    loginShowFn() {
      this.loginShow = true;
      this.show = true;
    },
    removeInputShowFn() {
      if (this.userName || this.password || this.confirmPassword) {
        this.popUpFn(true, "关闭表单后，您表单内填写的信息将不会被保留下来，是否确认？");
        return;
      }
      this.registerShow = false;
      this.loginShow = false;
      this.show = false;
      this.inputInitialize();
    },
    /*
    * 表单弹窗的确认按钮点击事件
    * @params
    *   i: boolean 可选 默认为true
    *       判断是否要关闭注册框
    *   timer: number/null 可选
    *       定时器内容，存在定时器存储其ID，否则为null
    * */
    affirmRemoveFn(i = true, timer) {
      if (i) {
        this.show = false;
        this.registerShow = false;
        this.loginShow = false;
      }
      this.inputInitialize();
      this.popUpFn(false);

      if (this.registerShow && this.VCodeText === '刷新') this.svgVCodeFn();
      if (typeof timer === 'number') {
        clearTimeout(this.hintTimer);
        this.hintTimer = null;
        this.registerShow = false;
        this.loginShow = true;
      }
    },
    /*
    * 注册和登录input框成功与错误提示信息显示与关闭
    * @params
    *   ifSucceed: boolean 必选
    *       审核是通过还是失败对应相应的boolean
    *   type: String 必选
    *       参数类型（userName、password……）
    *   content: String 可选
    *       报错提示信息
     */
    blurVerifyFn(ifSucceed, type, content = '') {
      if (typeof ifSucceed !== 'boolean' && typeof (type || content) !== 'string')
        return console.error("参数格式错误！");
      if (ifSucceed) {
        switch (type) {
          case 'userName':
            this.user_succeed = true;
            this.user_fail = false;
            break;
          case 'password':
            this.pw_succeed = true;
            this.pw_fail = false;
            break;
          case 'confirmPassword':
            this.cPw_succeed = true;
            this.cPw_fail = false;
            break;
          case 'VCode':
            this.VCode_succeed = true;
            this.VCode_fail = false;
            break;
          default:
            console.error(type + "不存在！！");
        }
        return;
      }
      switch (type) {
        case 'userName':
          this.err_userName = content;
          this.user_succeed = false;
          this.user_fail = true;
          break;
        case 'password':
          this.err_password = content;
          this.pw_succeed = false;
          this.pw_fail = true;
          break;
        case 'confirmPassword':
          this.err_confirmPassword = content;
          this.cPw_succeed = false;
          this.cPw_fail = true;
          break;
        case 'VCode':
          this.err_VCode = content;
          this.VCode_succeed = false;
          this.VCode_fail = true;
          break;
        default:
          console.error(type + "不存在！！");
      }
    },
    blur_userFn() {
      if (!this.userName) {
        this.blurVerifyFn(false, 'userName', "必须要输入名字哦(╬◣д◢)");
        return;
      }
      if (this.userName.length < 2 || this.userName.length > 7) {
        this.blurVerifyFn(false, 'userName', "用户名必须是2-7位o(*≧д≦)o!!");
        return;
      }
      if (this.user_regular.test(this.userName))
        this.blurVerifyFn(true, 'userName');
      else this.blurVerifyFn(false, 'userName', "只能有文字、数字、下划线o(*≧д≦)o!!");
    },
    blur_pwFn() {
      this.confirmPassword && this.blur_cPwFn();
      if (!this.password) {
        this.blurVerifyFn(false, 'password', "不能没有密码哦(╬◣д◢)");
        return;
      }
      if (this.password.length < 6 || this.password.length > 18) {
        this.blurVerifyFn(false, 'password', "密码必须是6-18位o(*≧д≦)o!!");
        return;
      }
      if (this.pw_regular.test(this.password))
        this.blurVerifyFn(true, 'password');
      else this.blurVerifyFn(false, 'password', "密码不能是特殊字符和文字o(*≧д≦)o!!");
    },
    blur_cPwFn() {
      if (!this.password) {
        this.blurVerifyFn(false, "confirmPassword", "您还没有输入密码哦(╬◣д◢)");
        return;
      }
      if (!this.confirmPassword) {
        this.blurVerifyFn(false, "confirmPassword", "还要再输入一次密码哦(｡･ω･｡)");
        return;
      }
      if (this.password === this.confirmPassword)
        this.blurVerifyFn(true, "confirmPassword");
      else this.blurVerifyFn(false, "confirmPassword", "两次输入的密码不一样哦(▼ヘ▼#)");
    },
    //验证码input时的验证
    input_VCode() {
      if (!this.VCode) {
        this.blurVerifyFn(false, "VCode", "请填写验证码");
        this.ifForbidden = true;
        return;
      }
      if (this.VCode.length === 4) {
        CheckVCode(this.VCode).then(res => {
          if (res.data.code === 0) {
            this.blurVerifyFn(true, "VCode");
            this.ifForbidden = false;
          } else if (res.data.code === 3) {
            this.popUpFn(true, '访问超时，请刷新表单后重试（点击确定刷新）！', false);
          } else {
            this.blurVerifyFn(false, "VCode", "验证码错误");
            this.ifForbidden = true;
          }
        }).catch(err => {
          console.error("验证失败，VCode接口错误", err);
        })
        return;
      }
      this.blurVerifyFn(false, "VCode", "验证码错误");
      this.ifForbidden = true;
    },
    /*
    * 注册表单弹窗的打开与关闭
    * @params
    *   ON: boolean 必选
    *       判断提示框是打开还是关闭
    *   txt: string 必选（打开弹窗时） 默认为空字符串
    *       弹窗需要显示的文本内容（关闭弹窗时不需要传）
    *   CancelBtn: boolean 可选 默认为true
    *       是否有取消按钮
    * */
    popUpFn(ON, txt = '', CancelBtn = true) {
      if ((typeof ON !== 'boolean') && (typeof CancelBtn !== 'boolean')) return console.error("popUpFn函数参数错误")
      if (ON) {
        this.hintCancelShow = CancelBtn;
        this.hintText = txt;
        this.hintBoxShow = true;
        return
      }
      this.hintBoxShow = false;
    },
    //验证码刷新函数
    svgVCodeFn() {
      svgVCodeFn().then(res => {
        clearTimeout(this.timer);
        let time = 0;
        let timerFn = () => {
          time++;
          if (time > res.data.countDown) {
            clearTimeout(this.timer);
            this.VCodeText = "刷新";
          } else this.VCodeText = res.data.countDown - time + "s";
        };
        timerFn();
        this.timer = setInterval(timerFn, 1000);
        this.svgVCode = res.data.data;
        this.time = new Date;
        //验证码预先验证
        if (this.VCode.length === 4) {
          CheckVCode(this.VCode).then(res => {
            if (res.data.code === 0)
              this.blurVerifyFn(true, "VCode");
            else this.blurVerifyFn(false, "VCode", "验证码错误");
          }).catch(err => {
            console.error("验证失败，接口错误", err);
          })
        }
      }).catch(err => {
        console.error("svgVCode数据加载失败", err);
      })
    },
    //注册按钮事件函数
    registerFn() {
      this.blur_userFn();
      this.blur_pwFn();
      this.blur_cPwFn();
      if (this.user_fail || this.pw_fail || this.cPw_fail || this.VCode_fail) return;
      if (!this.RegisterRequest) return;

      postRegister(this.userName, this.password, this.VCode).then(res => {
        let data = res.data;
        let count = 7, timer = null;
        this.RegisterRequest = true;
        switch (data.code) {
          case 0:
            this.popUpFn(true, data.msg + `\n点击确认按钮跳转到登录页面！(${count}秒后自动跳转)`, false);
            timer = setInterval(() => {
              this.hintText = data.msg + `\n点击确认按钮跳转到登录页面！(${--count}秒后自动跳转)`;
              if (!this.registerShow && !this.hintTimer || count <= 0) clearInterval(timer);
            }, 1000)
            this.hintTimer = setTimeout(() => {
              this.popUpFn(false);
              this.registerShow = false;
              this.inputInitialize();
              this.loginShow = true;
              clearInterval(timer);
            }, count * 1000);
            break
          case 2:
            this.blurVerifyFn(false, "VCode", data.msg);
            break
          case 3:
            this.blurVerifyFn(false, "userName", data.msg);
            break
          case 1:
          case 4:
            this.popUpFn(true, data.msg, false);
            break
        }
        this.svgVCodeFn(); //请求后修改验证码
      }).catch(err => {
        console.error("接口请求错误！" + err);
        this.popUpFn(true, '注册失败，请稍后重试！', false);
        this.RegisterRequest = true;
        this.svgVCodeFn(); //请求后修改验证码
      })
      //发送请求后暂时禁用
      this.RegisterRequest = false;
      //发送请求后清空验证码！
      this.VCode_succeed = false;
      this.VCode_fail = false;
      this.VCode = "";
      this.ifForbidden = true;
    },
    //登录成功执行的函数
    loginSucceedFn(res) {
      //存储注册日期（number格式）
      let date = new Date(res.data.userInfo.reqDate);
      this.login.reqDate.year = date.getFullYear();
      this.login.reqDate.month = date.getMonth() + 1;
      this.login.reqDate.day = date.getDate();
      //存储id
      this.login._id = res.data.userInfo._id;
      //存储用户名
      this.login.user = res.data.userInfo.userName;
      //存储头像地址
      this.login.photo = res.data.userInfo.headPortrait;
      //是否为管理员
      this.login.admin = res.data.userInfo.admin;
      //判断登录成功
      this.ifLogin = true;
      //将登陆成功的值传出去
      this.$emit('ifLogin', [this.ifLogin, this.login]);
    },
    //登录按钮事件函数
    loginFn() {
      if (!this.RegisterRequest) return;
      this.blur_userFn();
      this.blur_pwFn();
      if (this.user_fail || this.pw_fail) return;
      //登录请求
      postLogin(this.userName, this.password).then(res => {
        switch (res.data.code) {
          case 2:
            this.popUpFn(true, res.data.msg + '请检查后重试', false);
            //重置滑块
            this.slidingBlockReset = false;
            this.$nextTick(() => {
              this.slidingBlockReset = true;
            })
            break
          case 3:
            this.blurVerifyFn(false, 'password', res.data.msg)
            break
          case 0:
            this.inputInitialize();
            this.removeInputShowFn();
            this.loginSucceedFn(res);
        }
        this.RegisterRequest = true;
      }).catch(err => {
        console.error("接口请求错误！" + err);
        this.popUpFn(true, '登录失败，请稍后重试！', false);
        this.RegisterRequest = true;
      })
      this.RegisterRequest = false;
    },
    onAndOffFn(num) {
      clearTimeout(this.userMenuTimer);
      if (num) {
        this.userMenuShow = true;
        this.userMenuTimer = setTimeout(() => {
          this.userMenuMove = true;
        }, 300);
        return
      }
      if (!this.userMenuShow) return
      this.userMenuMove = false;
      this.userMenuTimer = setTimeout(() => {
        this.userMenuShow = false;
      }, 400);
    },
    //登出事件
    logoutFn() {
      if (!this.RegisterRequest) return;
      if (!this.ifLogin) return
      postLogout().then(res => {
        let code = res.data.code;
        if (code === 0 || code === 1) {
          //重置user信息
          this.ifLogin = false;
          this.login.user = null;
          this.login.admin = false;
          this.login.photo = null;
          this.login.reqDate.month = null;
          this.login.reqDate.day = null;
          this.login.reqDate.year = null;
          code && alert("请登录后再操作！");
          //重置user菜单
          this.userMenuShow = false;
          this.userMenuMove = false;
          this.userMenuTimer = null;
          //登出成功后传值
          this.$emit('ifLogin', [this.ifLogin]);
        } else {
          alert("登出失败，请稍后重试！")
        }
        this.RegisterRequest = true;
      }).catch(err => {
        console.error(err);
        this.RegisterRequest = true;
      })
      this.RegisterRequest = false;
    },
    //更换头像页面打开事件
    avatarFn() {
      if (!this.ifLogin) return alert("请先登录！")
      this.ifAvatar = true;
    },
    //更换头像关闭事件
    reloadAvatar() {
      this.ifAvatar = false;
    },
    //头像更换后刷新函数
    val(data) {
      this.$route.path("/")
      if (!data) return
      postIfLogin()
          .then(res => res.data.userInfo.code === 0 && this.loginSucceedFn(res))
          .catch(err => console.error(err))
    },
  },
  created() {
    postIfLogin()
        .then(res => res.data.userInfo.code === 0 && this.loginSucceedFn(res))
        .catch(err => console.error(err))
  },
}
</script>

<style scoped lang="less">
#loginPage {
  position: fixed;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 999;
  width: 100vw;
  height: 100vh;

  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    z-index: 100;
    -webkit-animation: Move .3s both;
    -moz-animation: Move .3s both;
    -o-animation: Move .3s both;
    @keyframes Move {
      0% {
        background: rgba(0, 0, 0, 0)
      }
      50% {
        background: rgba(0, 0, 0, 0.6)
      }
    }

    &.up {
      z-index: 111;
    }
  }

  .register, .login {
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    border-radius: 5px;
    width: 350px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    background-color: #fff;
    z-index: 110;
    -webkit-animation: zoomMove .3s both;
    -moz-animation: zoomMove .3s both;
    -o-animation: zoomMove .3s both;
    @keyframes zoomMove {
      0% {
        opacity: 0;
        transform: scale3d(.3, .3, .3);
      }
      50% {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
    }

    p {
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e9e7;
      margin: 20px 20px 0;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
      font-size: 18px;
      font-weight: 400;
      line-height: 24px;
      color: #303133;
    }

    > div {
      padding: 30px 33px;
      color: #606266;
      font-size: 14px;

      form div {
        position: relative;
        margin-bottom: 22px;
        box-sizing: border-box;

        > span {
          display: inline-block;
          width: 70px;
          font-size: 14px;
          line-height: 40px;
          text-align: right;
          vertical-align: middle;
          color: #606266;
        }

        label {
          position: relative;
          display: inline-block;

          &.verifyCode {
            input {
              padding-left: 10px;
              padding-right: 14px;
              width: 70px;
              min-width: 60px;
              vertical-align: middle;
            }

            i {
              left: 50px;
              width: 14px;
            }

            span.verifyCode {
              position: static;
              display: inline-block;
              padding: 0;
              margin-left: 2px;
              width: 105px;
              height: 40px;
              vertical-align: middle;

              /deep/ svg {
                width: 100% !important;
                height: 100% !important;
              }
            }
          }

          input {
            display: inline-block;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            padding: 0 12px;
            width: 100%;
            min-width: 196px;
            height: 40px;
            font-size: inherit;
            line-height: 40px;
            outline: none;
            color: #606266;
            background-color: #fff;
            box-sizing: border-box;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);

            &:focus {
              border-color: #409eff;
            }

            &.on {
              border-color: #f56c6c;
            }
          }

          > span {
            position: absolute;
            top: 100%;
            left: 0;
            padding-top: 4px;
            font-size: 12px;
            font-style: normal;
            line-height: 1;
            color: #f56c6c;
          }

          i {
            display: inline-block;
            position: absolute;
            right: 0;
            top: 0;
            width: 25px;
            height: 100%;
            font-size: 14px;
            font-weight: 400;
            line-height: 40px;
            text-align: center;
            transition: all .3s;
            color: #409eff;

            &:last-child {
              color: #f56c6c;
            }
          }
        }

        div {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          left: 247px;
          width: 25px;
          height: 40px;
          color: #c0c4cc;
          cursor: not-allowed;
          user-select: none;

          &.on {
            color: #606266;
            cursor: pointer;

            i.iconfont {
              color: #606266;
            }
          }

          &.on:hover {
            i {
              opacity: 0.5;
              color: #cb0000;

              &.iconfont {
                transform: rotate(360deg);
                transition: transform 1s;
              }
            }
          }

          i {
            font-size: 12px;
            font-style: normal;
            line-height: 20px;
            text-align: center;

            &.iconfont {
              padding: 0;
              width: 25px;
              height: 20px;
              font-size: 15px;
              line-height: 20px;
              text-align: center;
              color: #c0c4cc;
            }
          }
        }
      }

      div.btn {
        text-align: center;

        button {
          display: inline-block;
          padding: 12px 30px;
          border: 1px solid #dcdfe6;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          box-sizing: border-box;
          color: #606266;
          background: #fff;
          transition: all .1s;
          line-height: 1;
          outline: none;
          cursor: pointer;

          &:hover {
            border-color: #409eff;
            color: #409eff;
          }

          &.oneBtn {
            margin-right: 40px;

            &:hover {
              border-color: #fbc4c4;
              color: #f56c6c;
            }
          }

          &.on {
            color: #bcbec2;
            background-color: #f4f4f5;
            border-color: #e9e9eb;
            cursor: not-allowed;
          }
        }
      }
    }

    i.close {
      display: inline-block;
      position: absolute;
      top: 20px;
      right: 20px;
      width: 20px;
      height: 20px;
      font-size: 18px;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      overflow: hidden;
      transform: scale(1);

      &:hover {
        transform: scale(1.07);
        color: #e53d3d;
      }
    }
  }

  .confirmationBox {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 400px;
    height: 195px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .3);
    box-sizing: border-box;
    z-index: 115;

    h2 {
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e9e7;
      margin: 20px 20px 0;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
      font-size: 18px;
      font-weight: 400;
      line-height: 24px;
      color: #303133;
    }

    p {
      padding: 20px 50px;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
      font-size: 14px;
      line-height: 28px;
      color: #606266;
      word-break: break-all;
      white-space: pre-wrap;
    }

    .btn {
      padding: 3px 40px 15px;
      text-align: right;
      box-sizing: border-box;

      div {
        display: inline-block;

        button {
          display: inline-block;
          padding: 5px 10px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          line-height: 1;
          text-align: center;
          color: #606266;
          background-color: #fff;
          outline: none;
          cursor: pointer;
          transition: all .2s;

          &:hover {
            color: #409eff;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
          }

          &:nth-child(2) {
            margin-left: 20px;
            color: #f56c6c;
            background: #fef0f0;
            border-color: #fbc4c4;

            &:hover {
              background: #f56c6c;
              border-color: #f56c6c;
              color: #fff;
            }
          }
        }
      }
    }
  }
}

#nav {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 60px;
  background-color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  user-select: none;

  > nav {
    position: relative;
    z-index: 99;
    padding: 0 10px;
    margin: 0 auto;
    width: 1280px;
    max-width: 1280px;
    min-height: 60px;
    box-sizing: border-box;

    div.Name {
      display: inline-block;
      font-family: barbarahand, serif;
      font-size: 40px;
      text-align: center;
      line-height: 60px;
      color: #444647;
      cursor: pointer;
      user-select: none;
    }

    div.menu {
      position: absolute;
      top: 0;
      right: 15.5%;
      width: 576px;
      height: 60px;
      user-select: none;

      ul {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;

        li {
          flex: 1;
          position: relative;
          margin: 10px 5px;

          &::before {
            @keyframes bottom {
              0% {
                bottom: 2%
              }
              100% {
                width: 0
              }
            }
            position: absolute;
            bottom: -10px;
            left: 0;
            right: 0;
            margin: 0 auto;
            content: "";
            width: 0;
            height: 2px;
            background-color: #6bc30d;
            transition: width .6s, bottom .3s;
          }

          &:hover {
            a {
              color: #6bc30d;
            }

            &::before {
              width: 100%;
            }
          }

          a {
            display: block;
            height: 40px;
            font-size: 15px;
            font-weight: 400;
            text-align: center;
            line-height: 40px;
            color: #212220;
            transition: color .2s;
          }
        }
      }

      ul.list2 > li:nth-child(2),
      ul.list3 > li:nth-child(3),
      ul.list4 > li:nth-child(4),
      ul.list5 > li:nth-child(5),
      ul.list6 > li:nth-child(6) {
        @keyframes color {
          0% {
            color: #212220;
          }
          100% {
            color: #6bc30d;
          }
        }
        @keyframes width {
          0% {
            width: 0
          }
          100% {
            width: 100%
          }
        }

        &::before {
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          margin: 0 auto;
          content: "";
          width: 100%;
          height: 2px;
          background-color: #6bc30d;
          animation: width .3s linear 0s;
        }

        & > a {
          color: #6bc30d;
          animation: color .3s linear 0s;
        }
      }
    }

    div.login {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      right: 10px;
      margin-top: 5px;
      max-width: 54.5px;
      width: 54.5px;
      height: 50px;
      text-align: center;

      > div {
        display: flex;
        height: 25px;
        font-size: 0;
        color: #000;
        cursor: pointer;
        user-select: none;
        opacity: 1;
        transition: all .3s;

        p {
          flex: 1;
          display: inline-block;
          margin-left: 5px;
          font-size: 12px;
          font-weight: bolder;
          text-align: center;
          line-height: 25px;
        }

        i {
          flex: 1;
          font-size: 25px;
          font-weight: bolder;
          text-align: center;
          line-height: 25px;
        }

        &:hover {
          opacity: .5;
          color: #cb0000;
        }
      }
    }

    div.user {
      position: absolute;
      top: 0;
      right: 10px;
      cursor: pointer;

      .photo {
        overflow: hidden;
        display: inline-block;
        padding: 10px 0;
        height: 60px;
        font-size: 0;
        box-sizing: border-box;
        vertical-align: middle;
        user-select: none;
        transition: .3s;

        &:hover .img {
          opacity: .8;
        }

        .img {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          background-size: cover;
          background-position: center center;
        }

        div.userMenu {
          position: absolute;
          top: 55px;
          left: -27px;
          width: 100px;
          z-index: 999;
          transition: all .4s;
          transform-origin: 50px 0;
          transform: scale(.4) translateY(-30%);
          opacity: 0;

          &.open {
            transform: scale(1) translateY(0);
            opacity: 1
          }

          div.cusp {
            overflow: hidden;
            display: block;
            margin: 0 auto;
            width: 32px;
            height: 16px;

            &::after {
              display: block;
              margin: 12px auto 0;
              content: '';
              border: 1px solid #ebebeb;
              width: 24px;
              height: 24px;
              background-color: #fff;
              transform: rotate(45deg);
              box-sizing: border-box;
              box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
            }
          }

          div.btn {
            border-radius: 4px;
            padding: 6px 0;
            font-size: 14px;
            text-align: center;
            color: #787977;
            background-color: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, .15);

            p {
              padding: 0 20px;
              height: 36px;
              line-height: 36px;
              cursor: pointer;
              transition: .3s;

              &:hover {
                color: rgba(252, 8, 8, 0.5);
                background-color: #f6f6f6;
              }
            }
          }
        }
      }

      span {
        display: inline-block;
        max-width: 80px;
        margin-left: 6px;
        color: #444647;
        font-size: 14px;
        line-height: 60px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
        cursor: text;
      }
    }

    div.on {
      overflow: hidden;
      width: 0;
      height: 0;
    }
  }
}

@media all and (max-width: 1024px) {
  div#nav {
    &.show {
      overflow: visible;
    }

    > nav {
      position: static;
      text-align: center;

      & > div.Name {
        width: 50%;
      }

      & > div.menu {
        float: none;
        position: absolute;
        top: 59px;
        left: 0;
        width: 100%;
        height: 0;

        &.show {
          height: 315px;

          ul {
            height: 315px;
            opacity: 1;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        }

        ul {
          overflow: hidden;
          display: block;
          position: absolute;
          top: 0;
          width: 100%;
          height: 0;
          background: rgba(255, 255, 255, 1);
          border-radius: 0 0 25px 25px;
          opacity: 0;
          transition: height .3s linear, opacity .4s linear;

          li {
            border-bottom: 1px solid #e8e9e7;

            &:last-child {
              border: 0;
            }

            &::before {
              bottom: 0;
            }

            > a {
              box-sizing: border-box;
              padding: 4px 28px;
              text-align: left;
              line-height: 32px;
            }
          }
        }

        ul.list2 > li:nth-child(2),
        ul.list3 > li:nth-child(3),
        ul.list4 > li:nth-child(4),
        ul.list5 > li:nth-child(5),
        ul.list6 > li:nth-child(6) {
          @keyframes bottom {
            0% {
              bottom: -2%
            }
            100% {
              width: 0
            }
          }

          &::before {
            bottom: 0;
            transition: bottom .3s;
          }
        }
      }

      & > div.login {
        position: static;
        float: left;
      }

      & > div.user {
        position: static;
        float: left;

        > .photo {
          position: relative;
        }

        > span {
          display: none;
        }
      }

      & > div.on {
        float: right;
        margin-top: 5px;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        cursor: pointer;

        i {
          font-size: 30px;
          font-weight: bolder;
          color: rgba(0, 0, 0, 1);
          transition: all .3s;
        }

        &:hover {
          i {
            color: rgba(252, 8, 8, 0.5);
            opacity: .5;
          }
        }
      }
    }
  }
}

@media all and (max-width: 1366px) {
  div#nav > nav {
    width: 90%;
  }
}

@media all and (max-width: 415px) {
  #loginPage > .register, #loginPage > .login {
    min-width: 324px;
    width: 80%;

    > div {
      padding: 30px 8%;

      div.btn button.oneBtn {
        margin-right: 30px;
      }
    }
  }

  #loginPage .confirmationBox {
    width: 75%;
    height: 230px;
  }
}

@media all and (max-width: 330px) {
  #loginPage > .register, #loginPage > .login {
    min-width: 300px;
    width: 80%;

    > div {
      padding: 30px 5.6%;
    }
  }
}

//IE浏览器宽度极端窄情况下的优化
@media all and (max-width: 255px) {
  div#nav > nav > div.Name {
    margin-left: 25px;
  }

  div#nav > nav > div.login {
    width: auto;

    > div > p {
      display: none !important;
    }
  }
}
</style>
