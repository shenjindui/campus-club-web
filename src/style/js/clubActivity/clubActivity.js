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
             * 列表table数据
             */
            menuListData:[],
            /**
             * 分页参数
             */
            pageParms:[
                {total:''}
            ],
            /**
             * 搜索参数
             */
            params:[],
            /**
             * 状态列表初始化
             */
            statusCds:[],
            /**
             * 后台500弹出框
             */
            dialogVisible: false,
            errorMessage:'',
            /**
             * 设置el-form-item 的长度
             */
            formLabelWidth: '120px',
            /**
             * 分页参数设置
             */
            currentPage:'',
            pageSize:'',
            visible:false,
            activityListData:[],
        }
    },
    created () {
        /**
         * 页面初始化函数
         */
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
         * 后台500弹出框确定函数
         */
        handleClose() {
            this.dialogVisible=false;
            store.saveIDlist("token",null);
            this.$router.push("/");
        },
        /**
         * 重置函数将参数置空
         */
        reset(){
            this.params={};
            this.init();
        },
        /**
         * 搜索事件函数
         */
        search(){
            this.$axios
                .post("/api/clubActivityList", {
                    activityId: this.params.activityId,
                    activityName: this.params.activityName,
                    paramsTime: this.params.paramsTime,
                    currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                    pageSize:store.fetchIDlist("pageSize")
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.activityListData=[];
                        this.activityListData=successResponse.data.data.grid.list;
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
                        let errorMessage = successResponse.data.description;
                        this.$message({
                            message: errorMessage,
                            type: 'warning'
                        })
                        this.dialogVisible=true;
                    }
                })
                .catch(failResponse => {

                });
        },
        /**
         * 页面初始化加载的函数
         */
        init(){
            this.$axios
                .post("/api/clubActivityList", {
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.activityListData=[];
                        this.activityListData=successResponse.data.data.grid.list;
                        this.pageParms.total=successResponse.data.data.grid.total;
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
                        this.dialogVisible=true;
                    }
                })
                .catch(failResponse => {});
        },
        /**
         *  table列表选中的事件
         */
        handleSelectionChange(){},
        /**
         * tab切换时的事件
         * @param tab
         * @param event
         */
        handleClick(tab, event) {
            if(tab.name == 'first'){
            }else if(tab.name=='second'){
                this.second();
            }else if(tab.name=='third'){
                this.third();
            }
        },
        second(){
        },
        third(){
        },
        /**
         * 分页事件
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
        /**
         * 查看事件
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
            }else{
                this.$router.push({path:'/clubActivityInfo',query:{uuid:selectData[0].uuid}});
            }
        },
        /**
         * 添加事件
         */
        add(){
            this.$router.push({path:'/clubActivityAdd'});
        },
        /**
         * 编辑事件
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
                console.log(selectData[0])
                if(selectData[0].statusCd==1){
                    this.$message({
                        message: "该记录已生效，若要修改，请先申请失效，重新提交审核！",
                        type: 'warning'
                    })
                }else{
                    if(selectData[0].workflowCd==1||selectData[0].workflowCd==2){
                        this.$message({
                            message: "该记录处于流程中，不允许修改！",
                            type: 'warning'
                        })
                    }else{
                        this.$router.push({path:'/clubActivityUpdate',query:{uuid:selectData[0].uuid}});
                    }
                }
            }
        }
    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
    }
}
