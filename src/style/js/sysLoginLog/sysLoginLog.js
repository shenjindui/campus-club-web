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
             * table列表绑定的数组值
             */
            loginLogListData:[],
            /**
             * 分页参数
             */
            pageParms:[
                {total:''}
            ],
            /**
             * 搜索时绑定的参数
             */
            params:[],
            /**
             * 后台异常弹出框
             */
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
                realname: '',
                loginName: '',
                userNum: '',
                browserName: '',
                browserVersion:'',
                email:'',
                loginIp:'',
                mac: '',
                osName:'',
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
        /**
         * 页面初始化清空分页参数
         */
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        this.statusCds = store.fetchIDlist("statusCd");
    },
    methods: {
        /**
         * 详情弹框取消事件
         * @param detailForm
         * @constructor
         */
        DetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
        },
        /**
         * 异常对话框确定按钮事件
         */
        handleClose() {
             this.dialogVisible=false;
            // store.saveIDlist("token",null);
           // this.$router.push("/");
        },
        /**
         * 重置事件 将参数置空
         */
        reset(){
            this.params={};
            this.search();
        },
        /**
         * 搜索按钮事件
         */
        search(){
            this.loading = true;
            this.$axios
                    .post("/api/loginLoglist", {
                        userNum: this.params.userNum,
                        browserName: this.params.browserName,
                        paramsTime: this.params.paramsTime,
                        currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                        pageSize:store.fetchIDlist("pageSize")
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.loginLogListData=[];
                        this.loginLogListData=successResponse.data.data.grid.list;
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
         * 删除事件
         */
        deletes(){
            this.loading = true;
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
                this.$confirm('确定要删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //确定删除进行删除
                    this.$axios
                        .post("/api/sysLoginLogdelete", {
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
                                this.loading = false;
                            }
                            if (successResponse.data.status === 500) { //后台异常时
                                let errorMessage = successResponse.data.description;
                                this.$message({
                                    message: errorMessage,
                                    type: 'warning'
                                })
                                this.loading = false;
                            }
                        })
                        .catch(failResponse => {

                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '用户已取消'
                    });
                    this.loading = false;
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
                    .post("/api/loginLogDetail", {
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
                            let errorMessage = successResponse.data.description;
                            this.$message({
                                message: errorMessage,
                                type: 'warning'
                            })
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
            this.loading = true;
            this.$axios
                .post("/api/loginLoglist", {
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.loginLogListData=[];
                        this.loginLogListData=successResponse.data.data.grid.list;
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
                .catch(failResponse => {

                });
        },
        /**
         *   tab切换事件
         */
        handleSelectionChange(){

        },
        //
        handleClick(tab, event) {
            if(tab.name == 'first'){
            }else if(tab.name=='second'){
            }else if(tab.name=='third'){
            }
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
