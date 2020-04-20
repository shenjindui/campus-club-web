<template>
    <div>
        <div class="maintain">
            <div class="leftMain">
                <el-steps :active="active" finish-status="success">
                    <el-step title="步骤 1"></el-step>
                    <el-step title="步骤 2"></el-step>
                    <el-step title="步骤 3"></el-step>
                </el-steps>
                <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
            </div>
            <!--//判断token是否过期合法的对话框-->
            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%"
            >
                <!-- :before-close="handleClose()">-->
                <span >{{errorMessage}}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClose()">确 定</el-button>
                     </span>
            </el-dialog>
            <div class="rightForm">
                <div>
                <el-button @click="show2 = !show2">Click Me</el-button>

                <div style="display: flex; margin-top: 20px; height: 100px;">
                    <transition name="el-zoom-in-center">
                        <div v-show="show2" class="transition-box">.el-zoom-in-center</div>
                    </transition>

                    <transition name="el-zoom-in-top">
                        <div v-show="show2" class="transition-box">.el-zoom-in-top</div>
                    </transition>

                    <transition name="el-zoom-in-bottom">
                        <div v-show="show2" class="transition-box">.el-zoom-in-bottom</div>
                    </transition>
                </div>
            </div>
            </div>
        </div>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                show2: true,
                active: 0,
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                }
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            next() {
                if (this.active++ > 2) this.active = 0;
            }
        }
    }
</script>
<style scoped>
    @import '../../../style/csss/clubActivity/clubActivity.css';/* 引入css文件*/

</style>
