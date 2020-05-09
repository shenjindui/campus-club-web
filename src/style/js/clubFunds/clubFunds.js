import store from "../../../store/store";
import {
    checkBailPayMoney
} from "../../../utils/validate/validate"; //引入自定义的校验js
const  checkIsBailPayMoney = (rule, value, callback) => {
    if(!value){
        return callback(new Error("金额不能为空"));
    }else{
        if (checkBailPayMoney(value)) {
            callback();
        }else{
            return callback(new Error("金额格式不正确"));
        }
    }
}
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
            value1: '',
            value2: '',
            /**
             * table 列表菜单数据初始化
             */
            ListData:[],
            /**
             * 分页参数
             */
            pageParms:[
                {total:''}
            ],
            /**
             * 添加初始化
             */
            addForm: {
                type: '',
                stCd: '',
                amount: '',
                amountType: '',
            },
            /**
             * 搜索时的参数
             */
            params:[],
            /**
             * 状态初始化
             */
            statusCds:[],
            /**
             * 后台异常500 弹窗初始化
             */
            dialogVisible: false,
            errorMessage:'',
            /**
             * 添加对话框初始化
             */
            dialogTableVisible: false,
            dialogFormVisible: false,
            /**
             * 详情对话框初始化
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
             * 更新对话框初始化
             */
            updateFormVisible: false,
            updateForm: {
                fundsCd: '',
                uuid: '',
                stCd: '',
                type: '',
                amount: '',
                amountType:''
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
             * 金额操作列表初始化
             */
            amountTypeList:[],
            /**
             * 财务类型列表初始化
             */
            fundstypeList:[],
            /**
             * 社团信息列表
             */
            stList:[],
            rules: {
                type: [{ required: true, message: "请选择财务操作类型", trigger: "blur" }],
                stCd: [{ required: true, message: "请选择社团", trigger: "blur" }],
                amount: [{ required: true, message: "请输入金额", trigger: "blur" },
                    { validator: checkIsBailPayMoney ,trigger: "blur" }],
                amountType :[{ required: true, message: "请选择财务操作类型", trigger: "blur" }],
            },
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
        this.initDdct();
    },
    methods: {
        /**
         * 更新取消事件
         * @param updateForm
         * @constructor
         */
        UpdateCancle(updateForm){
            this.$refs[updateForm].resetFields();
            this.updateFormVisible=false;
        },
        /**
         * 更新事件
         * @param updateForm
         * @constructor
         */
        Update(updateForm){
            this.$refs[updateForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/fundsupdate", {
                            fundsCd:this.updateForm.fundsCd,
                            uuid:this.updateForm.uuid,
                            stCd: this.updateForm.stCd,//菜单名称
                            type: this.updateForm.type,
                            amount: this.updateForm.amount,
                            amountType: this.updateForm.amountType,
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
                            if (successResponse.data.status === 500) {
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
         * 详情取消事件
         * @param detailForm
         * @constructor
         */
        DetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
        },
        /**
         * 后台500时弹出框
         */
        handleClose() {
             this.dialogVisible=false;
            this.loading = false;
            // store.saveIDlist("token",null);
            //this.$router.push("/");
        },
        /**
         * 重置事件
         */
        reset(){
            this.params={};
            this.search();
        },
        /**
         * 添加初始化
         */
        add(){
            this.dialogFormVisible = true;
            this.initDdct();
        },
        /**
         * 页面加载初始化数据
         */
        initDdct(){
            this.$axios
                .post("/api/fundsaddinit", {
                    amountType: "amountType",
                    fundstype: "fundstype",
                    userCode:store.fetchIDlist("userInfo").userCode,
                    jobNum:store.fetchIDlist("userInfo").jobNum
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
            this.loading = true;
            this.$axios
                    .post("/api/fundslist", {
                        fundsCd: this.params.fundsCd,
                        stCd: this.params.stCd,
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
                this.$confirm('确定要删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //确定删除进行删除
                    this.$axios
                        .post("/api/fundsdelete", {
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
         * 系统支付测试事件
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
                        if (successResponse.data.status === 500) {
                        }
                    })
                    .catch(failResponse => {});
            }
        },
        /**
         * 修改事件
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
            }else if(selectData[0].fundsPsccd=='1'){ //已支付，不能修改
                this.$message({
                    message: "该条记录已支付，不能修改！",
                    type: 'warning'
                })
                return;
            }
            else{
                this.$axios
                    .post("/api/fundsdetail", {
                        uuid: selectData[0].uuid,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.updateForm=successResponse.data.data;
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
         * 详情事件
         */
        detail(){
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
                        }
                    })
                    .catch(failResponse => {});
            }
        },
        /**
         * 页面加载初始化
         */
        init(){
            this.loading = true;
            this.$axios
                .post("/api/fundslist", {
                    stChargeSno: store.fetchIDlist("roleInfo").roleCode!='role-00001'?store.fetchIDlist("userInfo").jobNum:null,
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
        /**
         * 根据列表选中的值的事件
         */
        handleSelectionChange(){},
        handleClick(tab, event) {
            if(tab.name == 'first'){
            }else if(tab.name=='second'){
                this.second();
            }else if(tab.name=='third'){
                 this.third();
            }
        },
        second(){
            console.log('我是配置管理');
        },
        third(){
            console.log('我是配置管理');
        },
        /**
         * 添加取消事件
         * @param addForm
         * @constructor
         */
        AddCancle(addForm){
            this.$refs[addForm].resetFields();
            this.dialogFormVisible=false;
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
        /**
         * 添加事件
         * @param addForm
         * @constructor
         */
        Add(addForm){
            this.$refs[addForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/fundsadd", {
                            type: this.addForm.type,//菜单名称
                            stCd: this.addForm.stCd,
                            amount: this.addForm.amount,
                            amountType: this.addForm.amountType,
                            userCode:store.fetchIDlist("userInfo").userCode
                        },{headers: {
                                'content-type': 'application/json',
                                "token":store.fetchIDlist("token")
                            }})
                        .then(successResponse => {
                            if (successResponse.data.status === 200) {
                                let successMessage = successResponse.data.description;
                                this.$message({
                                    message: "新增成功，并添加社员缴费信息记录",
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
    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
    }
}
