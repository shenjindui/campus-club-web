/**
 * 引入存储数据的js
 */
import store from "../../../store/store";
export default {
    name: 'tabs',
    data() {
        return {
            message: 'first',
            showHeader: false,
            /**
             * 时间控件初始化
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
             * table列表值
             */
            ListData:[],
            /**
             * 分页参数
             */
            pageParms:[
                {total:''}
            ],
            /**
             * 查询参数
             */
            params:[],
            /**
             *
             */
            statusCds:[],
            /**
             * 系统500时弹出框
             */
            dialogVisible: false,
            errorMessage:'',
            /**
             * 添加对话框初始化
             */
            dialogTableVisible: false,
            dialogFormVisible: false,
            addForm: {
                workFlowName: '',
                workflowDesc:''
            },
            /**
             * 详情对话框初始化
             */
            detailFormVisible:false,
            detailForm:{
                workFlowCode: '',
                uuid:'',
                workFlowName: '',
                workFlowDesc:'',
                createTime:'',
                updateTime:'',
            },
            /**
             * 修改对话框初始化
             */
            updateFormVisible: false,
            updateForm: {
                workflowDesc: '',
                workFlowName:'',
                workFlowCode:'',
                uuid:''

            },
            /**
             * 设置el-form-item 的长度
             */
            formLabelWidth: '120px',
            /**
             * 表单提交的校验
             */
            rules: {
                workFlowName: [
                    { required: true, message: "请输入流程名称", trigger: "blur" }
                ],
                workflowDesc: [{ required: true, message: "请输入流程描述", trigger: "blur" }],
                sort: [{ required: true, message: "请输入菜单排序码", trigger: "blur" },
                    { type: 'number', message: '请输入数字格式', trigger: 'blur', transform(value) {
                            return Number(value);
                        }}
                ],
                leafFlagCd :[{ required: true, message: "请选择", trigger: "blur" }],
                parentMenuCode :[{ required: true, message: "请选择", trigger: "blur" }],

            },
            /**
             * 分页参数设置
             */
            currentPage:'',
            pageSize:'',
            /**
             * 生效失效按钮的显影初始化
             */
            isStatus:true,
        }
    },
    created () {
        this.init();
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        this.statusCds = store.fetchIDlist("statusCd");
    },
    methods: {
        /**
         * 修改取消事件
         * @param updateForm
         * @constructor
         */
        UpdateCancle(updateForm){
            this.$refs[updateForm].resetFields();
            this.updateFormVisible=false;
        },
        /**
         * 添加取消操作时，重置表单的值
         * @param addForm
         * @constructor
         */
        AddCancle(addForm){
            this.$refs[addForm].resetFields();
            this.dialogFormVisible=false;
        },
        /**
         * 详情取消操作时，重置表单的值
         * @param detailForm
         * @constructor
         */
        DetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
        },
        /**
         * 添加事件
         * @param addForm
         * @constructor
         */
        Add(addForm){
            this.$refs[addForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/workflowadd", {
                            workFlowName: this.addForm.workFlowName,//菜单名称
                            workflowDesc: this.addForm.workflowDesc,
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
                                this.dialogFormVisible=false;
                                this.init();
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
                    return false;
                }
            });
        },
        /**
         * 后台500对话框确定事件
         */
        handleClose() {
            this.dialogVisible=false;
            //store.saveIDlist("token",null);
           // this.$router.push("/");
        },
        /**
         * 重置事件
         */
        reset(){
            this.params={}
        },
        /**
         * 搜索事件
         */
        search(){
            this.$axios
                .post("/api/workflowList", {
                    workFlowCode:this.params.workFlowCode,
                    workFlowName: this.params.workFlowName,
                    statusCd: this.params.statusCd,
                    paramsTime: this.params.paramsTime,
                    currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                    pageSize:store.fetchIDlist("pageSize")
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.ListData=[];
                        this.ListData=successResponse.data.data.grid.list;
                        this.pageParms.total=successResponse.data.data.grid.total;
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
        /**
         * 修改编辑事件
         */
        edit(){
            const selectData=this.$refs.multipleTable.selection;
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
            }else{
                this.$axios
                    .post("/api/workflowdetail", {
                        uuid: selectData[0].uuid,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.updateForm=successResponse.data.data;
                            this.updateForm.workflowDesc=successResponse.data.data.workFlowDesc;
                            this.updateFormVisible=true;
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
            }
        },
        /**
         * 删除事件
         */
        deletes(){
            const selectData=this.$refs.multipleTable.selection;
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
            }else{
                this.$confirm('删除该工作流程, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios
                        .post("/api/workflowDelete", {
                            uuid: selectData[0].uuid,
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
                                    type: 'success'
                                })
                                this.init();
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });

            }
        },
        /**
         * 失效或生效事件
         * @param status
         */
        setStatus(status){
            const selectData=this.$refs.multipleTable.selection;
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
            }else{
                this.$confirm(status==1?'生效该工作流程, 是否继续?':"失效该工作流程, 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios
                        .post("/api/workflowStatus", {
                            uuid: selectData[0].uuid,
                            statusCd:status,
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
                                    type: 'success'
                                })
                                this.init();
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });

            }
        },
        /**
         * 详情事件
         */
        detail(){
            const selectData=this.$refs.multipleTable.selection;
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
            }
            else
            {
                this.$axios
                    .post("/api/workflowdetail", {
                        uuid: selectData[0].uuid,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.detailForm=successResponse.data.data;
                            this.detailForm.createTime=this.dateFormate.dateformat(this.detailForm.createTime);
                            this.detailForm.updateTime=this.dateFormate.dateformat(this.detailForm.updateTime);
                            this.detailFormVisible=true;
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
                    .catch(failResponse => {

                    });
            }
        },
        /**
         * 页面加载初始化
         */
        init(){
            this.$axios
                .post("/api/workflowList", {
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data.grid.list);
                        this.ListData=[];
                        this.ListData=successResponse.data.data.grid.list;
                        this.pageParms.total=successResponse.data.data.grid.total;
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
                .catch(failResponse => {

                });
        },
        handleSelectionChange(){
            this.isStatus=true;
            const selectData=this.$refs.multipleTable.selection;
            if(selectData[0].statusCd==0){
                this.isStatus=false;
            }
        },
        //tab切换
        handleClick(tab, event) {
            if(tab.name == 'first'){
            }else if(tab.name=='second'){
            }else if(tab.name=='third'){
            }
        },
        /**
         * 添加事件，弹框
         */
        add(){
            this.dialogFormVisible = true;
        },
        /**
         * 修改事件
         * @param updateForm
         * @constructor
         */
        Update(updateForm){
            this.$refs[updateForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/workflowpdate", {
                            workFlowName:this.updateForm.workFlowName,
                            workFlowCode: this.updateForm.workFlowCode,
                            workflowDesc: this.updateForm.workflowDesc,
                            uuid:this.updateForm.uuid,
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
                                this.updateFormVisible=false;
                                this.init();
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
                        .catch(failResponse => {

                        });
                } else {
                    return false;
                }
            });
        },
        /**
         * 分页事件 页面尺寸事件
         * @param val
         */
        handleSizeChange(val){
            store.saveIDlist("pageSize",val);
            this.search();
        },
        /**
         * 页面当前页
         * @param val
         */
        handleCurrentChange(val){
            store.saveIDlist("currentPage",val);
            this.search();
        },
    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
    }
}
