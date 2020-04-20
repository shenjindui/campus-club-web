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
                uuid:''

            },
            opinionForm:{
                opinion:''
            },
            formLabelWidth: '100px',
            fileTableData:[],
            /*fileTableData: [{
                date: '2016-05-02',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-04',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1517 弄',
                zip: 200333
            }, {
                date: '2016-05-01',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1519 弄',
                zip: 200333
            }, {
                date: '2016-05-03',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1516 弄',
                zip: 200333
            }],*/
            token: {token: store.fetchIDlist("token") },
            userCode:store.fetchIDlist("userInfo").userCode,
            hideParms:{
                uuid:'',
                stCd:'',
                sysBusinessCode:''
            },
            rules: {
                opinion: [
                    { required: true, message: "请填写申请理由", trigger: "blur" }
                ],
                /*url: [{ required: true, message: "请输入菜单URL", trigger: "blur" }],
                sort: [{ required: true, message: "请输入菜单排序码", trigger: "blur" },
                    { type: 'number', message: '请输入数字格式', trigger: 'blur', transform(value) {
                            return Number(value);
                        }}
                ],
                leafFlagCd :[{ required: true, message: "请选择", trigger: "blur" }],
                parentMenuCode :[{ required: true, message: "请选择", trigger: "blur" }],
*/
            },

            //工作流选择对话框
            workflowTableVisible:false,
            //审核人列表
            approverDataList:[],

            //异常对话框
            dialogVisible:false,
            errorMessage:''


        };
    },
    created () {
        //初始文件列表
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
            console.log(file);
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
                console.log(JSON.stringify(this.baseInfoForm))
                if (valid) {
                    console.log(JSON.stringify(baseInfoForm));
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
                    //alert('error');
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        opinionSave(opinionForm){  //申请理由保存
            console.log(this.baseInfoForm.uuid)
            this.$refs[opinionForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/clubSetOpinion", {
                            opinion:this.opinionForm.opinion,
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
            this.$router.push("/clubinfo");
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
