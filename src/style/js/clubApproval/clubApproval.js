/**
 * 引入存储的js
 */
import store from "../../../store/store";
import {
    validatePhone,isJobNum
} from "../../../utils/validate/validate"; //引入自定义的校验js
const  checkisPhone = (rule, value, callback) => {
    if(!value){
        return callback(new Error("手机号码不能为空"));
    }else{
        if (validatePhone(value)) {
            callback();
        }else{
            return callback(new Error("手机号码格式不正确"));
        }
    }
}
const  checkisJobNum = (rule, value, callback) => {
    if(!value){
        return callback(new Error("学号不能为空"));
    }else{
        if (isJobNum(value)) {
            callback();
        }else{
            return callback(new Error("学号格式不正确"));
        }
    }
}
export default {
    //强制刷新
    inject:['reload'],
    data() {
        return {
            active: 0,
            /**
             * 基本信息表单
             */
            baseInfoForm: {
                schoolNo: '',
                collegeNo: '',
                stNature: '',
                stName:'',
                stDesc: '',
                remark: '',
                stChargeName:'',
                stChargePhone:'',
                stChargeSno:'',
                stCd:'',
                uuid:''
            },
            /**
             * 意见表单
             */
            opinionForm:{
                opinion:''
            },
            /**
             * 设置el-form-item 的长度
             */
            formLabelWidth: '100px',
            /**
             * 文件列表
             */
            fileTableData:[],
            /**
             * token值
             */
            token: {token: store.fetchIDlist("token") },
            /**
             * 用户编码
             */
            userCode:store.fetchIDlist("userInfo").userCode,
            /**
             * 隐藏的参数
             */
            hideParms:{
                uuid:'',
                stCd:'',
                sysBusinessCode:''
            },
            /**
             * 表单校验规则
             */
            rules: {
                schoolNo: [{ required: true, message: "请选择社团所属学校", trigger: "blur" }],
                collegeNo: [{ required: true, message: "请选择社团所属学院", trigger: "blur" }],
                stNature: [{ required: true, message: "请选择社团所属性质", trigger: "blur" }],
                stName: [{ required: true, message: "请填写社团名称", trigger: "blur" }],
                stDesc: [{ required: true, message: "请填写社团描述", trigger: "blur" }],
                remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
                stChargeName: [{ required: true, message: "请填写社团负责人", trigger: "blur" }],
                stChargePhone: [{ required: true, message: "请填写负责人手机号", trigger: "blur" },
                    { validator: checkisPhone ,trigger: "blur" }],
                stChargeSno: [{ required: true, message: "请填写负责人学号", trigger: "blur" },
                    { validator: checkisJobNum ,trigger: "blur" }],
                opinion: [{ required: true, message: "请申请理由", trigger: "blur" }],

            },
            /**
             * 工作流选择对话框
             */
            workflowTableVisible:false,
            /**
             * 审核人列表
             */
            approverDataList:[],
            /**
             * 后台500异常对话框
             */
            dialogVisible:false,
            errorMessage:'',
            /**
             * 添加页面加载初始化
             */
            stNatureList:[],
            schoolCdList:[],
            collegeCdList:[],
        };
    },
    created () {
        this.init();
    },
    methods: {
        /**
         * 页面加载初始化
         */
        init(){
            this.$axios
                .post("/api/clubAddInit", {
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.stNatureList = successResponse.data.data.stNatureList;
                        this.collegeCdList = successResponse.data.data.collegeCdList;
                        this.schoolCdList = successResponse.data.data.schoolCdList;

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
        /**
         * 后台500 对话框确定按钮
         */
        handleClose() {
            this.dialogVisible=false;
            store.saveIDlist("token",null);
            this.$router.push("/");
        },
        /**
         * 文件上传成功调用的事件
         * @param response
         * @param file
         * @param fileList
         */
        fileUploadSuccess(response, file, fileList) {
            if (response.status === 200) {
                let successMessage = response.description;
                this.$message({
                    message: successMessage,
                    top: 200,
                    type: 'success',
                })
                this.getFileList();
            }
            if (response.status === 400) {
                let warnMessage = response.description;
                this.$message({
                    message: warnMessage,
                    type: 'warning'
                })
               // this.reload();
            }
            if (response.status === 500) { //后台异常时
                let warnMessage = response.description;
                this.$message({
                    message: warnMessage,
                    type: 'warning'
                })
            }
        },
        /**
         * 文件上传失败调用的事件
         * @param err
         * @param file
         * @param fileList
         */
        fileUploadError(err, file, fileList) {
            alert('系统异常,上传失败！');
        },
        next() {
            if (this.active++ > 2) {
            }
        },
        step() {
            if (this.active-- <0) {
            }
        },
        onSubmit() {
        },
        /**
         * 获取文件列表
         */
        getFileList(){
            this.$axios
                .post("/api/fileList", {
                    currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                    pageSize:store.fetchIDlist("pageSize"),
                    filePurpose:1,
                    stCd:this.hideParms.stCd,
                    userCode:store.fetchIDlist("userInfo").userCode,

                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.fileTableData=[];
                        this.fileTableData=successResponse.data.data.grid.list;
                        this.total='';
                        this.total=successResponse.data.data.grid.total;
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
        /**
         * 文件详情
         * @param index
         * @param fileTableData
         */
        detailFile(index,fileTableData){
            alert(fileTableData[index].uuid);
        },
        /** todo
         * 移除文件
         * @param index
         * @param fileTableData
         */
        deleteFile(index,fileTableData){
            this.$axios
                .post("/api/deleteFile", {
                    uuid:fileTableData[index].uuid,
                    userCode:store.fetchIDlist("userInfo").userCode,

                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        let successMessage = successResponse.data.description;
                        this.$message({
                            message: successMessage,
                            type: 'success'
                        })
                        this.getFileList();
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
        /**
         * 基本信息保存
         * @param baseInfoForm
         */
        baseInfoSave(baseInfoForm){
            this.$refs[baseInfoForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/clubAdd", {
                            schoolNo:this.baseInfoForm.schoolNo,
                            collegeNo:this.baseInfoForm.collegeNo,
                            stNature:this.baseInfoForm.stNature,
                            stName:this.baseInfoForm.stName,
                            stDesc:this.baseInfoForm.stDesc,
                            remark:this.baseInfoForm.remark,
                            stChargeName:this.baseInfoForm.stChargeName,
                            stChargePhone:this.baseInfoForm.stChargePhone,
                            stChargeSno:this.baseInfoForm.stChargeSno,
                            userCode:store.fetchIDlist("userInfo").userCode
                        },{headers: {
                                'content-type': 'application/json',
                                "token":store.fetchIDlist("token")
                            }})
                        .then(successResponse => {
                            if (successResponse.data.status === 200) {
                                this.hideParms.uuid=successResponse.data.data.uuid;
                                this.hideParms.stCd=successResponse.data.data.stCd;
                                this.hideParms.sysBusinessCode=successResponse.data.data.sysBusinessCode;
                                this.baseInfoForm=successResponse.data.data;
                                let successMessage = successResponse.data.description;
                                this.$message({
                                    message: successMessage,
                                    top:200,
                                    type: 'success',

                                })
                                this.dialogFormVisible=false;
                                this.init();
                                this.getFileList();

                            }
                            if (successResponse.data.status === 400) {
                                let warnMessage = successResponse.data.description;
                                this.$message({
                                    message: warnMessage,
                                    type: 'warning'
                                })
                            }
                            if (successResponse.data.status === 500) { //后台异常时
                                let warnMessage = successResponse.data.description;
                                this.$message({
                                    message: warnMessage,
                                    type: 'warning'
                                })
                                const loading = this.$loading({
                                    lock: true,
                                    text: 'Loading',
                                    spinner: 'el-icon-loading',
                                    background: 'rgba(0, 0, 0, 0.7)'
                                });
                                setTimeout(() => {
                                    loading.close();
                                }, 5000);
                                window.localStorage.clear();
                                this.$router.push("/");
                            }
                        })
                        .catch(failResponse => {});
                } else {
                    return false;
                }
            });
        },
        /**
         * 意见保存
         * @param opinionForm
         */
        opinionSave(opinionForm){  //申请理由保存
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/clubSetOpinion", {
                            opinion:this.opinionForm.opinion,
                            uuid:this.baseInfoForm.uuid,
                            userCode:store.fetchIDlist("userInfo").userCode
                        },{headers: {
                                'content-type': 'application/json',
                                "token":store.fetchIDlist("token")
                            }})
                        .then(successResponse => {
                            if (successResponse.data.status === 200) {
                                let successMessage = successResponse.data.description;
                                this.$message({
                                    message: successMessage,
                                    top:200,
                                    type: 'success',

                                })
                            }
                            if (successResponse.data.status === 400) {
                                let warnMessage = successResponse.data.description;
                                this.$message({
                                    message: warnMessage,
                                    type: 'warning'
                                })
                            }
                            if (successResponse.data.status === 500) { //后台异常时
                                let warnMessage = successResponse.data.description;
                                this.$message({
                                    message: warnMessage,
                                    type: 'warning'
                                })
                            }
                        })
                        .catch(failResponse => {});
                } else {
                    return false;
                }
            });
        },
        /**
         * 返回按钮事件
         */
        back(){
            this.$router.push("/clubinfo");
        },
        /**
         * 启动并发送
         * @param opinionForm
         */
        startAndSubmit(opinionForm){
            if(this.hideParms.sysBusinessCode===''){
                this.$message({
                    message: "请先完善基本信息！",
                    type: 'warning'
                })
            }else{
                this.$refs[opinionForm].validate(valid => {
                    if (valid) {
                        this.workflowTableVisible = true;
                        this.$axios
                            .post("/api/stApproverList", {
                                approverType:'0' //经办审核人标志
                            }, {
                                headers: {
                                    'content-type': 'application/json',
                                    "token": store.fetchIDlist("token")
                                }
                            })
                            .then(successResponse => {
                                if (successResponse.data.status === 200) {
                                    this.approverDataList = [];
                                    this.approverDataList = successResponse.data.data.grid.list;
                                    this.pageParms.total = successResponse.data.data.grid.total;
                                }
                                if (successResponse.data.status === 400) {
                                    let warnMessage = successResponse.data.description;
                                    this.$message({
                                        message: warnMessage,
                                        type: 'warning'
                                    })
                                }
                                if (successResponse.data.status === 500) { //后台异常时
                                    this.errorMessage = successResponse.data.description;
                                    this.dialogVisible = true;
                                }
                            })
                            .catch(failResponse => {
                            });
                    }
                });
            }
        },
        /**
         * 提交审核确定按钮事件
         */
        confirmAndSubmit(){
            const selectData=this.$refs.approverListTable.selection;
            if(selectData.length>1){
                this.$message({
                    message: "请最多选择一条",
                    type: 'warning'
                })
            }else if(selectData.length<1) {
                this.$message({
                    message: "请选择一条记录",
                    type: 'warning'
                })
            }else {
                this.$axios
                    .post("/api/workFlowBusinessAdd", {
                        workFlowCode: selectData[0].workFlowCode,
                        approverCode: selectData[0].workFlowApproverCode,
                        workFlowNodeCode: selectData[0].workFlowNodeCode,
                        userCode: selectData[0].userCode,
                        businessCode:this.hideParms.sysBusinessCode
                    }, {
                        headers: {
                            'content-type': 'application/json',
                            "token": store.fetchIDlist("token")
                        }
                    })
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.workflowTableVisible = false;
                            let successMessage = successResponse.data.description;
                            this.$message({
                                message: successMessage,
                                type: 'success'
                            })
                            this.$router.push("/clubinfo");
                            this.reload();

                        }
                        if (successResponse.data.status === 400) {
                            let warnMessage = successResponse.data.description;
                            this.$message({
                                message: warnMessage,
                                type: 'warning'
                            })
                        }
                        if (successResponse.data.status === 500) { //后台异常时
                            this.errorMessage = successResponse.data.description;
                            this.dialogVisible = true;
                        }
                    })
                    .catch(failResponse => {
                    });
            }
        }
    }
}
