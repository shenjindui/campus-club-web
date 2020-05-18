<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 消息列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                   <!-- <div class="handle-row">
                        <el-button type="primary">全部标为已读</el-button>
                    </div>-->
                </el-tab-pane>
                <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                       <!-- <div class="handle-row">
                            <el-button type="danger">删除全部</el-button>
                        </div>-->
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--<div class="handle-row">
                            <el-button type="danger">清空回收站</el-button>
                        </div>-->
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import store from "../../store/store";
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                unread: [{
                    date: '2020-04-19 20:00:00',
                    title: '【系统通知】本系统将于今晚凌晨2点到5点进行升级维护',
                },{
                    date: '2020-05-15 9:00:00',
                    title: '今晚7点整发将在系统聊天系统进行社团社长全体第一次会议，请及时参加。',
                }],
                read: [{
                    date: '2019-12-19 20:00:00',
                    title: '【系统通知】本系统将于今晚凌晨2点到5点上线并维护'
                }],
                recycle: [{
                    date: '2020-05-15 9:00:00',
                    title: '今晚8点整发将在系统聊天系统进行社团社员全体第一次会议，请及时参加。'
                }]
            }
        },
        mounted () {
            let userInfo2=store.fetchIDlist("userInfo");
            if ('WebSocket' in window) {
                var userCode=userInfo2.userCode;
                this.websocket = new WebSocket('ws://localhost:8889/push/websocket/'+userCode);
                this.initWebSocket()
            } else {
                alert('当前浏览器 不支持')
            }
        },
        methods: {
            handleRead(index) {
                const item = this.unread.splice(index, 1);
                console.log(item);
                this.read = item.concat(this.read);
            },
            handleDel(index) {
                const item = this.read.splice(index, 1);
                this.recycle = item.concat(this.recycle);
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1);
                this.read = item.concat(this.read);
            },
            initWebSocket () {
                // 连接错误
                this.websocket.onerror = this.setErrorMessage

                // 连接成功
                this.websocket.onopen = this.setOnopenMessage

                // 收到消息的回调
                this.websocket.onmessage = this.setOnmessageMessage

                // 连接关闭的回调
                this.websocket.onclose = this.setOncloseMessage

                // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                window.onbeforeunload = this.onbeforeunload
            },
            setErrorMessage () {
                console.log('WebSocket连接发生错误   状态码：' + this.websocket.readyState)
            },
            setOnopenMessage () {
                console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
            },
            setOnmessageMessage (event) {
                // 根据服务器推送的消息做自己的业务处理
                console.log('服务端返回：' + event.data+"----")
                if(event.data!=''&&event.data!=null&&event.data!='{}'){
                    this.$notify.info({
                        title: '系统提示',
                        message: '您有未缴纳的社费信息,请及时前往缴纳！',
                    });
                }
            },
            setOncloseMessage () {
                console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
            },
            onbeforeunload () {
                this.closeWebSocket()
            },
            closeWebSocket () {
                this.websocket.close()
            },
        },
        computed: {
            unreadNum(){
                return this.unread.length;
            }
        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

