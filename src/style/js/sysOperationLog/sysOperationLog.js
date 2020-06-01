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
             * 列表数据对象
             */
            ListData:[],
            /**
             * 分页参数
             */
            pageParms:[
                {total:''}
            ],
            params:[],
            /**
             * 状态对象
             */
            statusCds:[],
            dialogVisible: false,
            errorMessage:'',
            /**
             * 添加对话框初始化
             */
            dialogTableVisible: false,
            dialogFormVisible: false,
            /**
             * 详情对话框
             */
            detailFormVisible:false,
            detailForm:{
                uuid: '',
                className: '',
                methodName: '',
                operationCode: '',
                userCode: '',
                remark:'',
                createTime:'',
                updateTime:''
            },
            /**
             * 设置el-form-item 的长度
             */
            formLabelWidth: '120px',
            /**
             * 分页参数设置
             */
            currentPage:'',
            pageSize:'',
            /**
             * vue loading 加载效果
             */
            loading:true,
        }
    },
    created () {
        this.init();
        store.saveIDlist("pageSize",null);//页面初始化清空分页参数
        store.saveIDlist("currentPage",null);//页面初始化清空分页参数
        this.statusCds = store.fetchIDlist("statusCd");
        let token=store.fetchIDlist("token");
    },
    methods: {
        /**
         * 详情点击取消按钮
         * @param detailForm
         */
        menuDetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
        },
        /**
         * 后台500弹出框确认函数
         */
        handleClose() {
             this.dialogVisible=false;
            store.saveIDlist("token",null);
            this.$router.push("/");
        },
        /**
         * 重置按钮事件
         */
        reset(){
            this.params={};
            this.search();
        },
        /**
         * 搜索事件
         */
        search(){
            this.loading = true;
            this.$axios
                    .post("/api/operationLoglist", {
                        userCode: this.params.userCode,
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
                        this.total='';
                        this.total=successResponse.data.data.grid.total;
                        this.loading = false;
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
                        let errorMessage = successResponse.data.description;
                        this.$message({
                            message: errorMessage,
                            type: 'warning'
                        })
                        this.dialogVisible=true;
                    }
                })
                .catch(failResponse => {});
        },
        /**
         * 删除按钮事件
         */
        deletes(){
            this.loading = true;
            const selectData=this.$refs.multipleTable.selection;
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
            }else{
                this.$confirm('确定要删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //确定删除进行删除
                    this.$axios
                        .post("/api/operationLogdelete", {
                            uuid: selectData[0].uuid,
                            flag:"0"
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
                                this.errorMessage =successResponse.data.description;
                                let errorMessage = successResponse.data.description;
                                this.$message({
                                    message: errorMessage,
                                    type: 'warning'
                                })
                                this.dialogVisible=true;
                            }
                        })
                        .catch(failResponse => {
                            this.$message({
                                message: "网络连接错误，请重试！",
                                type: 'warning'
                            })
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        /**
         * 详情按钮事件
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
                    .post("/api/operationLogDetail", {
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
                            this.errorMessage =successResponse.data.description;
                            let errorMessage = successResponse.data.description;
                            this.$message({
                                message: errorMessage,
                                type: 'warning'
                            })
                            this.dialogVisible=true;
                        }
                    })
                    .catch(failResponse => {});
            }
        },
        /**
         * 页面加载初始化列表
         */
        init(){
            this.loading = true;
            this.$axios
                .post("/api/operationLoglist", {
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.ListData=[];
                        this.ListData=successResponse.data.data.grid.list;
                        this.pageParms.total=successResponse.data.data.grid.total;
                        this.loading = false;
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
        handleSelectionChange(){},
        //tab切换
        handleClick(tab, event) {
            console.log(tab, event);
            if(tab.name == 'first'){
                // 触发‘菜单列表’事件
              //  this.init();
            }else if(tab.name=='second'){
                // 触发‘用户管理’事件
                this.second();
            }else if(tab.name=='third'){
                 this.third();
            }
        },
        second(){
            alert('2222');
            console.log('我是配置管理');
        },
        third(){
            alert('2222');
            console.log('我是配置管理');
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
