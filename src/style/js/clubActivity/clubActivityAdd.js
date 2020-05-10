import store from "../../../store/store";
import {
    checkBailPayMoney
} from "../../../utils/validate/validate"; //引入自定义的校验js
const  checkIsBailPayMoney = (rule, value, callback) => {
    if(!value){
        return callback(new Error("活动资金不能为空"));
    }else{
        if (checkBailPayMoney(value)) {
            callback();
        }else{
            return callback(new Error("活动资金格式不正确"));
        }
    }
}
export default {
    /**
     * 强制刷新
     */
    inject:['reload'],
    data() {
        return {
            active: 0,
            /**
             * 基本信息表单
             */
            baseInfoForm: {
                activityName: '',
                activitySpace: '',
                activityType: '',
                foundsNum:'',
                startTime: '',
                endTime: '',
                activityDsc:'',
                activityTime:'',
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
             * 用户编号
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
             * 时间控件选择器
             */
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            /**
             * 活动类型参数初始化
             */
            activityTypeList:[],
            /**
             * 表单验证规则
             */
            rules: {
                activityName: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
                activitySpace: [{ required: true, message: "请输入活动地点", trigger: "blur" }],
                activityType: [{ required: true, message: "请选择活动类型", trigger: "blur" }],
                activityTime: [{ required: true, message: "请选择活动时间", trigger: "blur" }],
                activityDsc: [{ required: true, message: "请输入活动内容", trigger: "blur" }],
                foundsNum: [{ required: true, message: "请输入资金预算金额", trigger: "blur" },
                    { validator: checkIsBailPayMoney ,trigger: "blur" }],
                opinion: [{ required: true, message: "请输入申请理由", trigger: "blur" }],
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
             *  后台500 异常对话框
             */
            dialogVisible:false,
            errorMessage:'',
            /**
             * uuid
             */
            uuid:''
        };
    },
    created () {
        /**
         * 页面加载初始化
         */
        this.init();
    },
    methods: {
        /**
         * 后台500异常弹出框
         */
        handleClose() {
            this.dialogVisible=false;
            //store.saveIDlist("token",null);
            //this.$router.push("/");
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
                //this.reload();
                this.getFileList();
            }
            if (response.status === 400) {
                let warnMessage = response.description;
                this.$message({
                    message: warnMessage,
                    type: 'warning'
                })
                this.reload();
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
                alert('这是最后一步喽');
            }
        },
        step() {
            if (this.active-- <0) {
                alert('这是第一步呢');
            }
        },
        onSubmit() {
        },
        /**
         * 文件列表获取
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
                    if (successResponse.data.status === 500) {
                        this.errorMessage =successResponse.data.description;
                    }
                })
                .catch(failResponse => {});
        },
        /**
         * 文件详情事件
         * @param index
         * @param fileTableData
         */
        detailFile(index,fileTableData){
            //todo
            alert(fileTableData[index].uuid);
        },
        /**
         * 文件移除事件
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
         * 活动基本信息保存
         * @param baseInfoForm
         */
        baseInfoSave(baseInfoForm){
            this.$refs[baseInfoForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/clubActivityAdd", {
                            activityName:this.baseInfoForm.activityName,
                            activitySpace:this.baseInfoForm.activitySpace,
                            activityType:this.baseInfoForm.activityType,
                            foundsNum:this.baseInfoForm.foundsNum,
                            activityTime:this.baseInfoForm.activityTime,
                            activityDsc:this.baseInfoForm.activityDsc,
                            uuid:this.hideParms.uuid!=''?this.hideParms.uuid:null,
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
         *  活动申请理由保存
         * @param opinionForm
         */
        opinionSave(opinionForm){
            if(this.hideParms.sysBusinessCode===''){
                this.$message({
                    message: "请先完善基本信息！",
                    type: 'warning'
                })
                return ;
            }
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/clubActivitySetOpinion", {
                            activityName:this.baseInfoForm.activityName,
                            remark:this.opinionForm.opinion,
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
            this.$router.push("/clubActivity");
        },
        /**
         * 启动并发送事件
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
                            this.$router.push("/clubActivity");
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
        },
        /**
         * 添加的时候初始化
         */
        init(){
            this.$axios
                .post("/api/clubActivityAddInit", {
                    "dctKey":"activityType"
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.activityTypeList=[];
                        this.activityTypeList=successResponse.data.data.activityTypeList;
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
                        this.dialogVisible=true;
                    }
                })
                .catch(failResponse => {});
        },
    }
}
