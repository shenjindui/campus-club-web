import store from "../../../store/store";

export default {
    //强制刷新
    inject:['reload'],
    data() {
        return {
            active: 0,
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
                createOpinion:''
            },
            formLabelWidth: '100px',
            token: {token: store.fetchIDlist("token") },
            userCode:store.fetchIDlist("userInfo").userCode,
            opinionForm:{},
            isShow:true,
            rules: {
                approverOpinion: [
                    { required: true, message: "请填写申请理由", trigger: "blur" }
                ],
            },
        };
    },
    created () {
        //初始文件列表
        this.init();

    },
    methods: {
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
        approverOpinionSave(){

        },
        onSubmit() {
            console.log('submit!');
        },
        init(){
            this.$axios
                .post("/api/userList", {
                    userCode:this.$route.query.userCode,
                    businessCode:this.$route.query.businessCode,
                    isWorkFlow:'true'
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.baseInfoForm=successResponse.data.data.grid.list[0];
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
            this.$router.push("/stmanager/myclubApprove");

        },
        refuse(opinionForm){
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/workFlowBusinessRefuse", {
                            approverOpinion:this.opinionForm.approverOpinion,
                            uuid:this.$route.query.uuid,
                            pcsStCode:'3',//流程编号不同过3
                            userCode:this.$route.query.userCode,
                            isBaseInfo:'Yes'
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
                                this.$router.push({path:'/clubjb/myclubApprove'});
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
        approver(opinionForm){
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/fh/workFlowBusinessApprovered", {
                            approverOpinion:this.opinionForm.approverOpinion,
                            uuid:this.$route.query.uuid,
                            userCode:this.$route.query.userCode,
                            isBaseInfo:'Yes'
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
                                this.$router.push({path:'/clubjb/myclubApprove'});
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
