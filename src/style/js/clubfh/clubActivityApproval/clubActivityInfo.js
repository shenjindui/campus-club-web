import store from "../../../../store/store";
import {
    checkBailPayMoney
} from "../../../../utils/validate/validate"; //引入自定义的校验js
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
            isShow:true,
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
        let pageView=this.$route.query.pageView;
        if(pageView!=null||pageView=='disabled'){
            this.isShow=false;
        }
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
        back(){
            this.$router.push("/clubfh/clubActivityApprove");
        },
        init(){
            this.$axios
                .post("/api/clubActivityDetail", {
                    activityId:this.$route.query.businessAssociationCode,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.baseInfoForm=successResponse.data.data;
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
        approverOpinionSave(opinionForm){ //审核意见保存
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/workFlowBusinessOpinionSave", {
                            approverOpinion:this.opinionForm.approverOpinion,
                            uuid:this.$route.query.uuid,
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
                                this.opinionForm.approverOpinion= successResponse.data.data.approverOpinion;
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
        refuse(opinionForm){
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/workFlowBusinessRefuse", {
                            approverOpinion:this.opinionForm.approverOpinion,
                            uuid:this.$route.query.uuid,
                            pcsStCode:'3',//流程编号不同过3
                            activityInfo:"activityInfo",
                            isBaseInfo:"isNotBaseInfo",
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
                                this.$router.push({path:'/clubjb/clubActivityApprove'});
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
        approvered(opinionForm){  //复核岗同意
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/fh/workFlowBusinessApprovered", {
                            approverOpinion:this.opinionForm.approverOpinion,
                            uuid:this.$route.query.uuid,
                            isBaseInfo:"isNotBaseInfo",
                            activityInfo:"activityInfo",
                            /*pcsStCode:'3',//流程编号不同过3*/
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
                                this.$router.push({path:'/clubfh/clubActivityApprove'});
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
        }
    }
}
