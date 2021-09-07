<template>
    <div class="diary">
        <div class="diary-main">
            <h1><i class="iconfont icon-shizhong"></i>千梦</h1>
            <div class="timeline"></div>
            <div v-for="(val,key,i) in yearObj" class="timeline-year">
                <h2 @click="expandCloseFn(i)">
                    <a>{{ key }}</a>
                    <i :class="['iconfont icon-icon-up',{on:ifExpand[i]}]"></i>
                </h2>
                <div class="month-day-content">
                    <ul>
                        <li v-for="item in val">
                            <div class="month-day"><p class="date">
                                {{ item.date.getMonth() + 1 }}月{{ item.date.getDate() }}日</p></div>
                            <div class="circle"><i class="iconfont icon-yuandian"></i></div>
                            <div class="content">
                                <p>{{ item.text }}</p>
                                <img v-for="i in item.img" :src="i" alt="">
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <h1 class="end">
                <i class="iconfont icon-end"></i>
                The END
            </h1>
        </div>
    </div>
</template>

<script>
export default {
    name: "DiaryContent",
    data() {
        return {
            //年份按钮的旋转
            ifExpand: [],
            //划分出每年的日记
            yearObj: {},
            //高度储存库
            heightData: [],
            //动画定时器
            timer: null,
            //假数据
            diaryData: [
                {text: "live for you(www)", date: new Date(), img: []},
                {text: "occupation and work", date: new Date(2020, 3, 5), img: []},
                {
                    text: "occupation and work",
                    date: new Date(2020, 6, 6),
                    img: ["http://28248m0b43.zicp.vip/images/defaultPhoto.jpg"]
                },
                {text: "best actor award", date: new Date(2019, 5, 10), img: []},
                {text: "live for you(www)", date: new Date(2019, 1, 23), img: []},
                {
                    text: "act actor action",
                    date: new Date(2018, 11, 9),
                    img: ["http://28248m0b43.zicp.vip/images/preview.jpg", "http://28248m0b43.zicp.vip/images/defaultPhoto.jpg"]
                },
                {text: "live for you(www)", date: new Date(2018, 10, 2), img: []},
                {text: "live for you(www)", date: new Date(2017, 1, 12), img: []},
            ],
        }
    },
    methods: {
        expandCloseFn(key) {
            //判断上一个事件是否结束
            if (Object.prototype.toString.call(this.timer) !== '[object Null]') return;
            //获取要变化高度的标签 and 标签的高度
            let conAll = document.querySelectorAll("div.month-day-content");
            let conDiv = conAll[key];
            let conHeight = conDiv.clientHeight;
            //点击改变按钮的状态 and 高度数据的存储与更新
            (() => {
                //修改年份按钮布尔值 and 重绘页面
                this.ifExpand[key] = !this.ifExpand[key];
                this.$forceUpdate();
                //存储每一个年份div的高度 and 更新储存库里高度
                !this.heightData.length && conAll.forEach((item, index) => {
                    this.heightData[index] = item.clientHeight;
                });
                conHeight > this.heightData[key] && (this.heightData[key] = conHeight);
            })();
            //高度变化函数
            (() => {
                //定义与获取 数据
                let _height = null;  //步长
                this.ifExpand[key] && (conHeight = 0); //打开时高度从0开始
                _height = this.ifExpand[key] ? 8 : -8;
                //初始化数据
                clearInterval(this.timer);
                this.timer = null;
                //伸缩动画
                this.timer = setInterval(() => {
                    conHeight += _height;
                    //收缩下限
                    if (conHeight < 0) conHeight = 0;
                    if (conHeight > this.heightData[key]) conHeight = this.heightData[key];
                    conDiv.style.cssText = `height:${conHeight}px`;
                    //收缩上限
                    if (conHeight === this.heightData[key] || !conHeight) {
                        conDiv.style.cssText = `display:${this.ifExpand[key] ? 'black' : 'none'}`;
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                    //伸缩加速度
                    _height *= 1.03;
                }, 10)
            })()
        },
    },
    mounted() {
        //根据后台返回的数据内容填充页面数据
        let arr = this.diaryData;
        let x = arr[0].date.getFullYear();
        let _x = x - arr[arr.length - 1].date.getFullYear();
        let year = null;
        for (let i = 0; i <= _x; i++) {
            year = x - i;
            this.yearObj[year.toString() + " 年"] = this.diaryData.filter(value => value.date.getFullYear() === year);
            this.ifExpand.push(true);
        }
        //重绘
        this.$forceUpdate();
    },
}
</script>

<style scoped lang="less">
.diary {
    position: relative;
    padding: 8px;
    margin: 80px auto 0;
    width: 90%;
    min-height: 90vh;
    background: #fff;
    box-sizing: border-box;

    .diary-main {
        position: relative;

        h1 {
            position: relative;
            margin-left: calc(35% - 7px);
            font: 14px/1.5 "Helvetica neue", Helvetica, Tahoma, sans-serif;
            font-size: 18px;
            font-weight: 400;
            color: #484348;
            background: #fff;
            z-index: 1;

            &.end {
                padding-top: 4px;
                padding-bottom: 2px;
                margin-top: 40px;
                margin-left: calc(34% - 7px);

                .iconfont {
                    padding-right: 2px;
                    font-size: 25px;
                }
            }

            .iconfont {
                padding-right: 10px;
                font: normal normal normal 14px FontAwesome;
                font-size: 17px;
            }
        }

        div.timeline {
            position: absolute;
            top: 0;
            left: 35%;
            width: 2px;
            height: 100%;
            background: #484348;
            z-index: 0;
        }

        div.timeline-year {
            margin: 10px 0;

            h2 {
                margin: 5px 0;
                width: 31%;
                font: 14px/1.5 "Helvetica neue", Helvetica, Tahoma, sans-serif;
                font-size: 16px;
                font-weight: 500;
                text-align: right;
                line-height: 1.5;
                color: #6bc30d;
                cursor: pointer;
                user-select: none;

                .iconfont {
                    display: inline-block;
                    width: 1.28571429em;
                    font-size: inherit;
                    text-align: center;
                    transition: transform .2s;

                    &.on {
                        transform: rotateZ(90deg)
                    }
                }
            }

            .month-day-content {
                overflow: hidden;

                ul li {
                    overflow: hidden;
                    padding: 10px 0;

                    div {
                        display: inline-block;
                        vertical-align: top;
                        @keyframes LeftMove {
                            0% {
                                opacity: 0;
                                transform: translate3d(-100%, 0, 0);
                            }
                            100% {
                                opacity: 1;
                                transform: translate3d(0, 0, 0);
                            }
                        }
                        @keyframes RightMove {
                            0% {
                                opacity: 0;
                                transform: translate3d(100%, 0, 0);
                            }
                            100% {
                                opacity: 1;
                                transform: translate3d(0, 0, 0);
                            }
                        }

                        &.month-day {
                            width: 31%;
                            text-align: right;
                            animation: LeftMove 1s;

                            .date {
                                display: inline-block;
                                padding: 2px 5px;
                                margin-top: 5px;
                                font: 14px/1.5 "Helvetica neue", Helvetica, sans-serif;
                                font-size: 15px;
                                color: #484348;
                            }
                        }

                        &.circle {
                            position: relative;
                            display: inline-block;
                            width: 8%;
                            text-align: center;
                            line-height: 1.35;
                            color: #484348;
                            background-color: #fff;
                            z-index: 1;

                            .iconfont {
                                font-size: 24px;
                            }
                        }

                        &.content {
                            position: relative;
                            max-width: 49%;
                            padding: 20px;
                            margin-left: 10px;
                            line-height: 1.5;
                            color: #fff;
                            background-color: #484348;
                            animation: RightMove 1s;

                            &::before {
                                content: '';
                                position: absolute;
                                left: -20px;
                                top: 6px;
                                height: 0;
                                width: 0;
                                border: 6px solid rgba(255, 255, 255, 0);
                                border-right: 10px #484348;
                                border-left-width: 10px;
                            }

                            img {
                                max-width: 100%;
                            }
                        }
                    }
                }
            }
        }
    }
}

@media all and (min-width: 768px) {
    .diary {
        padding: 15px;

        .diary-main {
            h1 {
                margin-left: calc(18% - 13px);
                font-size: 26px;

                &.end {
                    margin-left: calc(17% - 10px);

                    .iconfont {
                        font-size: 36px;
                    }
                }

                .iconfont {
                    font-size: 26px;
                }
            }

            div.timeline {
                left: 18%;
            }

            div.timeline-year {
                h2 {
                    width: 16%;
                    font-size: 24px;
                }

                .month-day-content ul li div {
                    &.month-day {
                        width: 16%;
                    }

                    &.circle {
                        width: 4%;
                    }
                }
            }

        }
    }
}

@media all and (min-width: 992px) {
    .diary .diary-main {
        h1 {
            margin-left: calc(18% - 16px);
            font-size: 34px;

            &.end {
                margin-left: calc(17% - 8px);

                .iconfont {
                    font-size: 41px;
                }
            }

            .iconfont {
                font-size: 31px;
            }
        }

        div.timeline-year h2 {
            font-size: 30px;
        }
    }
}

@media all and (min-width: 1366px) {
    .diary {
        width: 1280px;
    }
}
</style>
