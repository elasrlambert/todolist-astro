<template>
    <div class="title"><h1>今天要干嘛？</h1></div>
            <div class="header">
                <input type="text" v-model.trim="userInput" @keyup.enter="addTodo" placeholder="请输入内容..." />
                <button @click="addTodo">添加</button>
            </div>
            <div class="content-box">
                <transition-group tag="ul" name="todo" v-if="todoList_show.length != 0">
                    <li :key="item.id" v-for="(item,index) in todoList_show">
                        <div :class="item.computed?'status-item-finished':'status-item'" @click="item.computed = !item.computed"></div>
                        <span :class="{del:item.computed}" @dblclick="justifyContent(item)" title="双击修改todo内容">{{item.content}}</span>
                        <button @click.exact.ctrl.left="todoList.splice(index, 1)" @dblclick="todoList.splice(index, 1)" title='按住"ctrl"+“鼠标左键”，或双击删除。'>✖</button>
                    </li>
                </transition-group>
                <div class="noneTodo" v-else>
                    <h3>空空如也</h3>
                </div>
            </div>
            <div class="footer">
                <ul>
                    <li>剩余任务：{{unfinishNum}}</li>
                    <li @click="status = 0" :class="{active:status == 0}">全部</li>
                    <li @click="status = 1" :class="{active:status == 1}">未完成</li>
                    <li @click="status = 2" :class="{active:status == 2}">已完成</li>
                    <li @click="clearFinished">清除已完成</li>
                </ul>
            </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            todoList: [
            // {
            //     id: 1,
            //     content:
            //         "这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。这是一段内容。",
            //     computed: true,
            // },
        ],
        userInput: "",
        status: 0,
        }
    },
    methods: {
        // 添加 todo item
        addTodo() {
            if (!this.userInput) {
                alert("请输入有效内容！");
                return;
            }
            this.todoList.push({
                id: +new Date(),
                content: this.userInput.trim(),
                computed: false,
            });
            this.userInput = "";
        },
        // 清除已完成的任务
        clearFinished() {
            if (window.confirm("你确定要清除已完成的 todo 吗")) {
                this.todoList = this.todoList.filter((el) => !el.computed);
            }
        },
        // 双击修改 todo 的内容
        justifyContent(item) {
            let res;
            if ((res = prompt("请输入您要修改的内容：", item.content))) {
                item.content = res.trim();
            }
        },
        // 初始化，加载本地存储的 todoList 数据
        initTodoList() {
            if (localStorage.getItem("todoListData")) {
                this.todoList = JSON.parse(localStorage.getItem("todoListData"));
            }
        },
    },
    computed: {
        todoList_show() {
            // console.log(this.status);
            switch (this.status) {
                case 0:
                    return this.todoList;
                    break;
                case 1:
                    return this.todoList.filter((i) => !i.computed);
                    break;
                case 2:
                    return this.todoList.filter((i) => i.computed);
                    break;
                default:
                    console.log("status 发生了错误！");
                    return false;
                    break;
            }
        },
        unfinishNum() {
            let num = 0;
            this.todoList.forEach((el) => {
                if (!el.computed) {
                    num++;
                }
            });
            return num;
        },
    },
    watch: {
        // 自动保存修改到本地存储
        todoList: {
            deep: true,
            handler(newval, oldval) {
                localStorage.setItem("todoListData", JSON.stringify(this.todoList));
            },
        },
    },
    mounted() {
        this.initTodoList();
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
}
@media screen and (max-width: 400px) {
    .footer ul {
        flex-wrap: wrap;
        // font-size: 14px;
    }
}
.title {
    text-align: center;
    font-family: "宋体";
    letter-spacing: 10px;
    margin-top: 25px;
}
@keyframes relaxAnimation {
    0% {
        text-shadow: -8px 0px 5px #000;
    }
    100% {
        text-shadow: 8px 0px 5px #000;
    }
}
.header {
    width: 320px;
    height: 55px;
    margin: 15px auto;
    // border: 1px solid #000;
    line-height: 55px;
    text-align: center;
    input {
        width: 220px;
        padding: 5px;
        border: none;
        font-size: 15px;
        border-bottom: #999 2px dashed;
        letter-spacing: 3px;
        font-weight: bold;
        outline: none;
        &::placeholder {
            color: orangered;
            opacity: 0.3;
        }
    }

    button {
        padding: 5px;
        background-color: white;
        font-weight: bold;
        border-radius: 5px;
        outline: none;
        transform: rotateZ(15deg);
        box-shadow: 2px 2px 0px 2px #000;
        transition: 0.1s all;
        &:hover {
            color: orangered;
            // background-color: orangered;
            border: 2px solid orangered;
            cursor: pointer;
            box-shadow: 2px 2px 0px 2px transparent;
            transform: rotateZ(0deg);
        }
    }
}
.content-box {
    width: 600px;
    max-width: 80%;
    margin: 15px auto;
    perspective: 800px;
    min-height: 250px;
    transform-style: preserve-3d;
    // border: 1px solid #000;
    li {
        list-style: none;
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        // border: 1px solid #000;
        padding: 5px;
        border-radius: 5px;
        box-shadow: 0px 0px 1px 1px #999;
        font-family: "宋体";
        letter-spacing: 2px;
        transition: all 0.5s;
        background-color: rgb(255, 251, 247);
        word-break: break-all;
        // transition: all 1s;
        // display: inline-block;

        .status-item,.status-item-finished {
            width: 20px;
            height: 20px;
            border: 2px solid #999;
            margin: auto 0;
            flex-shrink: 0;
            z-index: 1;
            &:hover {
                cursor: pointer;
                border-color: orangered;
                z-index: 0;
            }
        }
        .status-item-finished {
            position: relative;
            &::after {
                position: absolute;
                top: -20px;
                left: 0;
                display: block;
                // height: 100%;
                font-size: 32px;
                z-index: 0;
                font-weight: bold;
                color: orangered;
                content: "✔";
            }
        }
        button {
            padding: 0 10px;
            background-color: transparent;
            height: 25px;
            line-height: 25px;
            margin: auto 0;
            border: none;
            &:hover {
                cursor: pointer;
                background-color: black;
                color: #fff;
            }
        }
        span {
            display: inline-block;
            width: 90%;
            user-select: none;
            margin-left: 15px;
            flex: 1;
            &.del {
                text-decoration: line-through;
            }
            &:hover {
                cursor: pointer;
            }
        }

        &:hover {
            transform: translateZ(50px);
            box-shadow: 0px 0px 8px 2px #eee;
        }
    }
    .noneTodo h3 {
        height: 100%;
        font-size: 35px;
        text-align: center;
        transition: all 10s;
        transform: skew(30px);
        color: orangered;
        animation: relaxAnimation 3s linear alternate infinite;
        line-height: 100px;
        opacity: 0.35;
    }
}
// 添加、删除动画
.todo-enter,
.todo-leave-to {
    // 注意不同 transform 属性会覆盖！因为 li 标签已经在 hover 伪类中写了 transform 属性了，所以这里的 transform 属性如果想生效，需要使用 !important 来保证生效！
    transform: translateY(-150px) !important;
    opacity: 0;
}
.todo-enter-active,
.todo-leave-active {
    transform-style: preserve-3d;
    perspective: 800px;
    transition: all 0.8s !important;
}
.todo-leave-active {
    // 关键处
    display: block;
    width: 100%;
    position: absolute;
}
.footer ul {
    width: 600px;
    max-width: 80%;
    margin: 55px auto;
    display: flex;
    justify-content: space-around;
    border-top: 2px dashed #000;
    padding-top: 25px;
    position: relative;
    color: #666;
    transition: all 1s;
    &::before {
        display: block;
        content: "";
        position: absolute;
        top: 0;
        width: 100%;
        border-top: 20px dotted rgba(255, 20, 120, 0.4);
        transform: translateY(-50%);
    }
    li {
        list-style: none;
        padding: 5px;
        border-radius: 5px;
        font-weight: 550;
        border: 2px solid transparent;
        &:not(:first-child).active,
        &:not(:first-child):hover {
            color: orangered;
            border: 2px solid orangered;
            cursor: pointer;
        }
    }
}
</style>