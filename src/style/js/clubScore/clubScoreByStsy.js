import store from "../../../store/store";
import {
    checkScore,
} from "../../../utils/validate/validate"; //引入自定义的校验js
/**
 * 校验分数
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
const  checkisScore = (rule, value, callback) => {
    if(!value){
        return callback(new Error("评分不能为空不能为空"));
    }else{
        if (checkScore(value)) {
            callback();
        }else{
            return callback(new Error("评分需要在0-100之间"));
        }
    }
}
export default {

    name: 'tabs',
    data() {
        return {
            ratersPsccd: '0',
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
            value2: '44444',
            /**
             * table 列表菜单数据初始化
             */
            ListData: [],
            /**
             * 分页参数
             */
            pageParms: [
                {
                    total: '',
                    total2: '0',
                }
            ],
            /**
             * 添加表单初始化
             */
            addForm: {
                type: '',
                stCd: '',
                amount: '',
                amountType: '',
            },
            /**
             * 搜索按钮的参数初始化
             */
            params: [],
            /**
             * 状态数据字典初始化
             */
            statusCds: [],
            /**
             * 后台异常500 弹窗初始化
             */
            dialogVisible: false,
            errorMessage: '',
            /**
             * 添加对话框初始化
             */
            dialogTableVisible: false,
            dialogFormVisible: false,
            /**
             *  详情对话框初始化
             */
            detailFormVisible: false,
            detailFormVisible1: false,
            detailForm: {
                uuid: '',
                ratersAssociationCode: '',
                ratersAssociationName: '',
                ratersCode: '',
                ratersName: '',
                ratersOpin: '',
                score: '',
                createTime: '',
                updateTime: '',
            },
            /**
             * 更新对话框初始化
             */
            updateFormVisible: false,
            updateForm: {
                ratersAssociationCode: '',
                uuid: '',
                ratersAssociationName: '',
                score: '',
                ratersOpin: '',
            },
            /**
             * 设置el-form-item 的长度
             */
            formLabelWidth: '120px',
            /**
             * 分页参数设置
             */
            currentPage: '',
            pageSize: '',
            rules: {
                schoolYear: [{required: true, message: "请选择学年", trigger: "blur"}],
                uuid: [{required: true, message: "uuid不能为空", trigger: "blur"}],
                ratersAssociationCode: [{required: true, message: "评审对象编号不能为空", trigger: "blur"}],
                ratersAssociationName: [{required: true, message: "评审对象名称不能为空", trigger: "blur"}],
                semesters: [{required: true, message: "请选择学期", trigger: "blur"}],
                score: [{required: true, message: "请输入得分", trigger: "blur"},
                    { validator: checkisScore ,trigger: "blur" }],
                ratersOpin: [{required: true, message: "请输入评分意见", trigger: "blur"}],
            },
            /**
             * 数据字典初始化
             */
            stList: [],
            schoolYearList:[],
            semestersList:[],
            ratersPsccdList:[],
            isShowStList:false
        }
    },
    created () {
        /**
         * 页面创建时调用初始化方法
         */
        this.init("0");
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
         * 取消更新事件
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
                        .post("/api/scoreupdate", {
                            uuid:this.updateForm.uuid,
                            score:this.updateForm.score,
                            ratersPsccd:"ratersPsccd1",//设置成完成
                            ratersOpin: this.updateForm.ratersOpin,
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
                                this.init("0");
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
         * 详情页返回事件
         * @param detailForm
         * @constructor
         */
        DetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
            this.detailFormVisible1=false;
        },
        /**
         * 后台500弹出框确认函数
         */
        handleClose() {
             this.dialogVisible=false;
             //store.saveIDlist("token",null);
             //this.$router.push("/");
        },
        /**
         * 重置事件
         * @param ratersPsccd
         */
        reset(ratersPsccd){
            this.params={};
            this.search(ratersPsccd);
        },
        /**
         * 添加事件初始化
         */
        add(){
            this.dialogFormVisible = true;
            this.initDdct();
        },
        /**
         * 添加事件确定
         * @param addForm
         * @constructor
         */
        Add(addForm){
            this.$refs[addForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/scoreadd", {
                            stCd: this.addForm.stCd,
                            schoolYear: this.addForm.schoolYear,
                            emesters: this.addForm.semesters,
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
                                this.init('0');
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
         * 初始化数据字典
         */
        initDdct(){
            this.$axios
                .post("/api/scoreinit", {
                    userCode:store.fetchIDlist("userInfo").userCode
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.stList=successResponse.data.data.stList;
                        this.ratersPsccdList=successResponse.data.data.ratersPsccdList;
                        this.semestersList=successResponse.data.data.semestersList;
                        this.schoolYearList=successResponse.data.data.schoolYearList;
                        this.isShowStList=successResponse.data.data.isShowStList;
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
         * @param ratersPsccd
         */
        search(ratersPsccd){
            this.$axios
                    .post("/api/scorelist", {
                        semesters: this.params.semesters,
                        schoolYear: this.params.schoolYear,
                        stCd: this.params.stCd,
                        ratersPsccd:ratersPsccd,
                        ratersType:"ratersType1",
                        paramsTime: this.params.paramsTime,
                        userCode:store.fetchIDlist("userInfo").userCode,
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
                        if(ratersPsccd=='0'){
                            this.pageParms.total=successResponse.data.data.grid.total;
                        }else{
                            this.pageParms.total2=successResponse.data.data.grid.total;
                        }
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

                });
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
                        .post("/api/messagedelete", {
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
                            if (successResponse.data.status === 500) {

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
         * 评分事件
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
                    .post("/api/scoreDetail", {
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
                        if (successResponse.data.status === 500) {

                        }
                    })
                    .catch(failResponse => {

                    });
            }
        },
        /**
         * 详情事件
         * @param ratersPsccd
         */
        detail(ratersPsccd){
            let selectData='';
            if(ratersPsccd=='0'){
                selectData=this.$refs.multipleTable.selection;
            }else{
                selectData=this.$refs.multipleTables.selection;
            }
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
                    .post("/api/scoreDetail", {
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
                            if(ratersPsccd=='0'){
                                this.detailFormVisible=true;
                            }else{
                                this.detailFormVisible1=true;
                            }
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
         * 初始化方法
         * @param ratersPsccd
         */
        init(ratersPsccd){
            this.$axios
                .post("/api/scorelist", {
                    ratersPsccd:ratersPsccd,
                    userCode:store.fetchIDlist("userInfo").userCode,
                    ratersType:"ratersType1",
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.ListData=[];
                        this.ListData=successResponse.data.data.grid.list;
                        if(ratersPsccd=='0'){
                            this.pageParms.total=successResponse.data.data.grid.total;
                        }else{
                            this.pageParms.total2=successResponse.data.data.grid.total;
                        }

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
        handleSelectionChange(){},
        //tab切换
        handleClick(tab, event) {
            if(tab.name == 'first'){
                this.ratersPsccd='0'
                this.init(this.ratersPsccd)
            }else if(tab.name=='second'){
                this.ratersPsccd='1'
                this.init(this.ratersPsccd)
            }else if(tab.name=='third'){
            }
        },
        second(){
            console.log('我是配置管理');
        },
        third(){
            console.log('我是配置管理');
        },
        /**
         * 添加取消
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
            this.search('0');
        },
        /**
         * 页面当前页
         * @param val
         */
        handleCurrentChange(val){
            //this.currentPage=val;
            store.saveIDlist("currentPage",val);
            this.search('0');
        },
    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
    }
}
