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
             * 列表数据值初始化
             */
            ListData:[],
            /**
             * 分页的参数
             */
            pageParms:[
                {total:''}
            ],
            /**
             * 添加的表单
             */
            addForm: {
                type: '',
                stCd: '',
                amount: '',
                amountType: '',
            },
            /**
             * 搜索的参数
             */
            params:[],
            /**
             * 状态的初始化
             */
            statusCds:[],
            /**
             * 后台500弹出框初始化
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
             * 金额类型初始化
             */
            amountTypeList:[],
            /**
             * 财务类型初始化
             */
            fundstypeList:[],
            /**
             * 社团列表初始化
             */
            stList:[],
            /**
             * 表单验证规则
             */
            rules: {
            },
        }
    },
    created () {
        this.init();
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        this.statusCds = store.fetchIDlist("statusCd");
        this.initDdct();
    },
    methods: {
        /**
         * 详情取消事件
         * @param detailForm
         * @constructor
         */
        DetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
        },
        /**
         * 后台500对话框确定按钮事件
         */
        handleClose() {
             this.dialogVisible=false;
             store.saveIDlist("token",null);
            this.$router.push("/");
        },
        /**
         * 重置事件 将参数置空
         */
        reset(){
            this.params={};
            this.search();
        },
        /**
         * 初始化字典值
         */
        initDdct(){
            this.$axios
                .post("/api/fundsaddinit", {
                    amountType: "amountType",
                    fundstype: "fundstype",
                    userCode:store.fetchIDlist("userInfo").userCode
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.amountTypeList=successResponse.data.data.amountTypeList;
                        this.fundstypeList=successResponse.data.data.fundstypeList;
                        this.stList=successResponse.data.data.stList;
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
         * 搜索事件
         */
        search(){
            this.$axios
                    .post("/api/fundslist", {
                        fundsCd: this.params.fundsCd,
                        stCd: this.params.stCd,
                        paramsTime: this.params.paramsTime,
                        currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                        pageSize:store.fetchIDlist("pageSize"),
                        fundsAssociationCode:store.fetchIDlist("userInfo").jobNum,
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
         * 支付按钮事件
         */
        send(){
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
                if(selectData[0].fundsPsccd=="1"){
                    this.$message({
                        message: "该条信息已支付，请勿多次支付！",
                        type: 'warning'
                    })
                    return ;
                }
                this.$axios
                    .post("/api/pay/alipay/payment", {
                        uuid: selectData[0].uuid,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")
                        }})
                    .then(successResponse => {
                        if (successResponse!=null) {
                            var newwindow = window.open("#","_blank");
                            newwindow.document.write(successResponse.data);
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
                    .post("/api/fundsdetail", {
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
                    .catch(failResponse => {});
            }
        },
        /**
         * 页面加载初始化
         */
        init(){
            this.$axios
                .post("/api/fundslist", {
                    fundsAssociationCode:store.fetchIDlist("userInfo").jobNum,
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
         * table选中事件
         */
        handleSelectionChange(){},
        /**
         * tab切换
         * @param tab
         * @param event
         */
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
