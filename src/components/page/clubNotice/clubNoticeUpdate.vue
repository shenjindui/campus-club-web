<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 公告管理</el-breadcrumb-item>
                <el-breadcrumb-item>公告修改编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :model="addForm" ref="addForm" :rules="rules">
                <div class="plugins-tips">
                    校园社团公告修改
                </div>
                <el-row  label-width="80px" :gutter="16" type="flex">
                    <el-col :span="24">
                        <el-form-item label="公告所属社团编号：" style="margin-left: auto">
                            <el-select v-model="addForm.noticeStCd" placeholder="请选择社团" required="required" :disabled="true">
                                <el-option
                                        v-for="item in clubList"
                                        :key="item.stCd"
                                        :label="item.stName"
                                        :value="item.stCd"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input type="text" :rows="1" placeholder="请输入内容" v-model="addForm.remark"
                                      style="width: 90%;" readonly="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row  label-width="80px" :gutter="16" type="flex">
                    <el-col :span="24">
                        <el-form-item label="公告发布人编号：" style="margin-left: auto">
                            <el-input type="text" :rows="1" placeholder="请输入内容" v-model="addForm.publisher"
                                      style="width: 70%;" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="公告发布人时间：">
                            <el-input type="text" :rows="1" placeholder="请输入内容" v-model="addForm.releaseTime"
                                      style="width: 78%;" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row  label-width="80px" :gutter="16" type="flex">
                    <el-col :span="24">
                        <el-form-item label="公告编号：" style="margin-left: auto">
                            <el-input type="text" :rows="1" placeholder="请输入内容" v-model="addForm.noticeCd"
                                      style="width: 70%;" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="公告访问量：">
                            <el-input type="text" :rows="1" placeholder="请输入内容" v-model="addForm.trafficVolume"
                                      style="width: 78%;color: red" :disabled="true" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row  label-width="80px">
                    <quill-editor ref="myTextEditor" v-model="addForm.noticeDesc" :options="editorOption"
                                  required="required"></quill-editor>
                </el-row>
                <el-button class="editor-btn" type="primary" @click="submit('addForm')">保存</el-button>
                <el-button class="editor-btn1" type="primary" @click="back">返回</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import store from "../../../store/store";
    export default {
        name: 'editor',
        data: function(){
            return {
                editorOption: {
                    placeholder: '请输入公告内容'
                },
                clubList:[],
                params:[
                ],
                addForm: {
                    noticeStCd: '',
                    noticeDesc: '',
                    remark:'',
                    publisher: '',
                    trafficVolume: '',
                    noticeCd:'',
                },
                rules: {
                    noticeDesc: [{ required: true, message: "请输入内容", trigger: "blur" }],
                    noticeStCd :[{ required: true, message: "请选择", trigger: "blur" }],

                },
            }
        },
        created () {
            this.init();
        },
        components: {
            quillEditor
        },
        methods: {
            dateformat: function (row) {
                let d = new Date(row.substr(0, 19));//加入substr(0, 19)处理兼容ios报错NAN
                let year = d.getFullYear();       //年
                let month = d.getMonth() + 1;     //月
                let day = d.getDate();            //日
                let hh = d.getHours();            //时
                let mm = d.getMinutes();          //分
                let ss = d.getSeconds();           //秒
                let clock = year + "-";
                if (month < 10)
                    clock += "0";
                clock += month + "-";
                if (day < 10)
                    clock += "0";
                clock += day + " ";
                if (hh < 10)
                    clock += "0";
                clock += hh + ":";
                if (mm < 10) clock += '0';
                clock += mm + ":";
                if (ss < 10) clock += '0';
                clock += ss;
                return (clock);
            },
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            init(){
                this.$axios
                    .post("/api/clubNoticesDetail", {
                        uuid:this.$route.query.uuid
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.addForm=successResponse.data.data;
                            this.addForm.releaseTime=this.dateformat(successResponse.data.data.releaseTime);
                        }
                        if (successResponse.data.status === 400) {
                            let warnMessage = successResponse.data.description;
                            this.$message({
                                message: warnMessage,
                                type: 'warning'
                            })
                        }
                        if (successResponse.data.status === 500) { //后台异常时
                            this.errorMessage =successResponse.data.description;
                        }
                    })
                    .catch(failResponse => {});
            },
            back(){
                this.$router.push("/clubnoticeList");
            },
            submit(addForm){
                this.$refs[addForm].validate(valid => {
                    if (valid) {
                        this.$axios
                            .post("/api/clubnoticesupdate", {
                                uuid:this.$route.query.uuid,
                                noticeStCd: this.addForm.noticeStCd,
                                noticeDesc: this.addForm.noticeDesc,
                                remark: this.addForm.remark,
                                userCode:store.fetchIDlist("userInfo").userCode
                            },{headers: {
                                    'content-type': 'application/json',
                                    "token":store.fetchIDlist("token")  //token换成从缓存获取
                                }})
                            .then(successResponse => {
                                if (successResponse.data.status === 200) {
                                    let successMessage = successResponse.data.description;
                                    this.$message({
                                        message: successMessage,
                                        top:200,
                                        type: 'success',

                                    })
                                    this.$router.push("/clubnoticeList");
                                   // location.reload();
                                }
                                if (successResponse.data.status === 400) {
                                    let warnMessage = successResponse.data.description;
                                    this.$message({
                                        message: warnMessage,
                                        type: 'warning'
                                    })
                                }
                                if (successResponse.data.status === 500) { //后台异常时
                                }
                            })
                            .catch(failResponse => {});
                    } else {
                        //alert('error');
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
        margin-left: 470px;
    }
    .editor-btn1{
        margin-top: 20px;
        margin-left: 50px;
    }
</style>
