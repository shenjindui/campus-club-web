<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12" :offset="6">
                <div class="main">
                    <el-row>
                        校园社团管理系统人员测试交流功能
                        <el-button type="primary" @click="conectWebSocket()">点击建立连接</el-button>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: "", // 昵称
                websocket: null, // WebSocket对象
                aisle: "", // 对方频道号
                messageList: [], // 消息列表
                messageValue: "" // 消息内容
            };
        },
        methods: {
            conectWebSocket: function() {
                /*window.location.href = "http://localhost:8080/";*/
                window.location.href = "http://106.54.55.188:8080/";
            }
        }
    };
</script>

<style scoped>
    .main {
        position: relative;
        top: 20px;
    }
    .message {
        position: relative;
        overflow:auto;
        top: 20px;
        width: 100%;
        height: 40%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        padding: 5px;
    }
</style>
