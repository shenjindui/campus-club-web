import store from "../../../../store/store";
import loading from "../../../../utils/loading/loading";
export default {
    //强制刷新
    inject:['reload'],
    data() {
        return {
            active: 0,
            isShow:true,
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
                //approverOpinion:'' //审核意见
            },
            opinionForm:{
                approverOpinion:''
            },
            formLabelWidth: '100px',
            fileTableData:[],
            token: {token: store.fetchIDlist("token") },
            userCode:store.fetchIDlist("userInfo").userCode,
            rules: {
                approverOpinion: [
                    { required: true, message: "请填写理由", trigger: "blur" }
                ],
            },
            workflowTableVisible:false,
            loadingworkflow:true,
            hideParms:{
                uuid:'',
                stCd:'',
                sysBusinessCode:''
            },

        };
    },
    created () {
        loading.startLoading();
        //初始文件列表
        let pageView=this.$route.query.pageView;
        if(pageView!=null){
            this.isShow=false;
        }
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
        onSubmit() {
            console.log('submit!');
        },
        getFileList(){
            this.$axios
                .post("/api/fileList", {
                    currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                    pageSize:store.fetchIDlist("pageSize"),
                    filePurpose:1,
                    stCd:this.baseInfoForm.stCd,
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
        init(){
            this.$axios
                .post("/api/clubdetail", {
                    stCd:this.$route.query.businessAssociationCode,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.baseInfoForm=successResponse.data.data;
                        console.log(JSON.stringify(successResponse.data.data))
                        this.hideParms.sysBusinessCode=successResponse.data.data.businessCode;
                        this.getFileList();
                        loading.endLoading();
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
            this.$router.push("/clubjb/myclubApprove");
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
        approverNext(opinionForm){ //发送到下一岗位审批
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.workflowTableVisible = true;
                    this.$axios
                        .post("/api/stApproverList", {
                            approverType:'1'//复核人标志
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
                                this.loadingworkflow=false
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
        },
        confirmAndSubmit(){  //提交审核确定按钮事件
            console.log("------sss"+this.hideParms.sysBusinessCode);
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
                    .post("/api/fh/workFlowBusinessAdd", {
                        workFlowCode: selectData[0].workFlowCode,
                        approverCode: selectData[0].workFlowApproverCode,
                        workFlowNodeCode: selectData[0].workFlowNodeCode,
                        userCode: selectData[0].userCode,
                        approverOpinion:this.opinionForm.approverOpinion,
                        uuid:this.$route.query.uuid,
                        /*pcsStCode:'2',//流程编号同过2*/
                    }, {
                        headers: {
                            'content-type': 'application/json',
                            "token": store.fetchIDlist("token")  //token换成从缓存获取
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
                            this.$router.push("/clubjb/myclubApprove");
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
        }//提交
    }
}
