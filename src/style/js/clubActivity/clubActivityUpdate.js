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
    //强制刷新
    inject:['reload'],
    data() {
        return {
            active: 0,
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
            formDate : [],
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
            opinionForm:{
                opinion:''
            },
            formLabelWidth: '100px',
            fileTableData:[],
            token: {token: store.fetchIDlist("token") },
            userCode:store.fetchIDlist("userInfo").userCode,
            hideParms:{
                uuid:'',
                stCd:'',
                sysBusinessCode:''
            },
            rules: {
                activityName: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
                activitySpace: [{ required: true, message: "请输入活动地点", trigger: "blur" }],
                activityType: [{ required: true, message: "请选择活动类型", trigger: "blur" }],
                activityTime: [{ required: true, message: "请选择活动时间", trigger: "blur" }],
                activityDsc: [{ required: true, message: "请输入活动内容", trigger: "blur" }],
                foundsNum: [{ required: true, message: "请输入资金预算金额", trigger: "blur" },
                    { validator: checkIsBailPayMoney ,trigger: "blur" }],
            },

            //工作流选择对话框
            workflowTableVisible:false,
            //审核人列表
            approverDataList:[],

            //异常对话框
            dialogVisible:false,
            errorMessage:'',
            uuid:''


        };
    },
    created () {
        this.init();
    },
    methods: {
        //对话框确定按钮
        handleClose() {
            this.dialogVisible=false;
            store.saveIDlist("token",null);
            this.$router.push("/");
        },
        //对时间进行格式化
        dateformat: function (row, column) {
            let d = new Date(row.createTime.substr(0, 19));//加入substr(0, 19)处理兼容ios报错NAN
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
        //文件上传成功调用的事件
        fileUploadSuccess(response, file, fileList) {
            console.log(response);
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
            //alert('success');
        },
        //文件上传失败调用的事件
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
            console.log('submit!');
        },
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
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data.grid.list);
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
        //移除文件
        detailFile(index,fileTableData){
            alert(fileTableData[index].uuid);
        },
        deleteFile(index,fileTableData){
            this.$axios
                .post("/api/deleteFile", {
                    uuid:fileTableData[index].uuid,
                    userCode:store.fetchIDlist("userInfo").userCode,

                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
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
        baseInfoSave(baseInfoForm){
            this.$refs[baseInfoForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/clubActivityAdd", {
                            activityName:this.baseInfoForm.activityName,
                            activitySpace:this.baseInfoForm.activitySpace,
                            activityType:this.baseInfoForm.activityType,
                            foundsNum:this.baseInfoForm.foundsNum,
                            activityTime:this.formDate,
                            activityDsc:this.baseInfoForm.activityDsc,
                            uuid:this.hideParms.uuid!=''?this.hideParms.uuid:null,
                            userCode:store.fetchIDlist("userInfo").userCode
                        },{headers: {
                                'content-type': 'application/json',
                                "token":store.fetchIDlist("token")  //token换成从缓存获取
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
                                    // this.fullscreenLoading = false;
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
        opinionSave(opinionForm){  //申请理由保存
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/clubActivitySetOpinion", {
                            remark:this.opinionForm.opinion,
                            activityName:this.baseInfoForm.activityName,
                            uuid:this.baseInfoForm.uuid,
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
        back(){
            this.$router.push("/clubActivity");
        },
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
                                    "token": store.fetchIDlist("token")  //token换成从缓存获取
                                }
                            })
                            .then(successResponse => {
                                if (successResponse.data.status === 200) {
                                    console.log(successResponse.data.data.grid.list)
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
        init(){
            this.$axios
                .post("/api/clubActivityDetail", {
                    uuid:this.$route.query.uuid,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.baseInfoForm=successResponse.data.data;
                        this.baseInfoForm.activityTime = successResponse.data.data.activityTime
                        this.formDate = [successResponse.data.data.activityTime[0],successResponse.data.data.activityTime[1]]
                        this.opinionForm.opinion=successResponse.data.data.createOpinion;
                        this.hideParms.uuid=successResponse.data.data.uuid;
                        this.hideParms.stCd=successResponse.data.data.stCd;
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
        confirmAndSubmit(){  //提交审核确定按钮事件
            const selectData=this.$refs.approverListTable.selection;
            console.log(selectData[0])
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
                //console.log("选择的数据为;"+JSON.stringify(selectData[0]));
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
                            "token": store.fetchIDlist("token")  //token换成从缓存获取
                        }
                    })
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            // console.log(successResponse.data.data.grid.list)
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
