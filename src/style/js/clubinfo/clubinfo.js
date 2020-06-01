//引入存储数据的js
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
             * 列表总数
             */
            pageParms:[
                {total:''}
            ],
            /**
             * 查询参数
             */
            params:[],
            /**
             * 状态列表初始化
             */
            statusCds:[],
            /**
             * 后台500异常弹出框
             */
            dialogVisible: false,
            errorMessage:'',
            /**
             * 设置el-form-item 的长度
             */
            formLabelWidth: '120px',
            /**
             * 表单验证规则
             */
            rules: {
            },
            /**
             * 分页参数设置
             */
            currentPage:'',
            pageSize:'',
            /**
             * 角色选择器
             */
            visible:false,
            stListData:[],
        }
    },
    created () {
        this.init();
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        this.statusCds = store.fetchIDlist("statusCd");
    },
    methods: {
        //对话框确定按钮
        handleClose() {
            this.dialogVisible=false;
            store.saveIDlist("token",null);
            this.$router.push("/");
        },
        /**
         * 重置事件将参数置空
         */
        reset(){
            this.params={}
        },
        /**
         * 搜索事件
         */
        search(){
            this.$axios
                .post("/api/clublist", {
                    stCd: this.params.stCd,
                    stName: this.params.stName,
                    statusCd: this.params.statusCd,
                    paramsTime: this.params.paramsTime,
                    stChargeSno: store.fetchIDlist("roleInfo").roleCode!='role-00001'?store.fetchIDlist("userInfo").jobNum:null,
                    currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                    pageSize:store.fetchIDlist("pageSize")
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.stListData=[];
                        this.stListData=successResponse.data.data.grid.list;
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
         * 页面加载初始化
         */
        init(){
            this.$axios
                .post("/api/clublist", {
                    stChargeSno: store.fetchIDlist("roleInfo").roleCode!='role-00001'?store.fetchIDlist("userInfo").jobNum:null,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.stListData=[];
                        this.stListData=successResponse.data.data.grid.list;
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
         * table页选中记录事件
         */
        handleSelectionChange(){},
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
            }else{
                this.$router.push({path:'/clubApprovalInfo',query:{uuid:selectData[0].uuid}});
            }
        },
        /**
         * 添加按钮事件
         */
        add(){
            this.$router.push({path:'/clubApproval'});
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
                if(selectData[0].statusCd==1){  //社团状态为0未生效
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
                          this.$router.push({path:'/clubApprovalUpdate',query:{uuid:selectData[0].uuid}});
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
