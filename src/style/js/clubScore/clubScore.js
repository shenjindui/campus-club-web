/**
 * 引入存储数据的js
 */
import store from "../../../store/store";
export default {
    name: 'tabs',
    data() {
        return {
            ratersPsccd: '1',
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
            ListData: [],
            pageParms: [
                {
                    total: '',
                    total2: '',
                }
            ],
            addForm: {
                type: '',
                stCd: '',
                amount: '',
                amountType: '',
            },
            params: [],
            statusCds: [],
            dialogVisible: false,
            errorMessage: '',
            //添加对话框初始化
            dialogTableVisible: false,
            dialogFormVisible: false,
            //详情对话框
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
            updateFormVisible: false,
            updateForm: {
                ratersAssociationCode: '',
                uuid: '',
                ratersAssociationName: '',
                score: '',
                ratersOpin: '',
            },
            formLabelWidth: '120px',
            //分页参数设置
            currentPage: '',
            pageSize: '',
            rules: {
            },
            //数据字典初始化
            stList: [],
            schoolYearList:[],
            semestersList:[],
            ratersPsccdList:[],
            isShowStList:false,
            /**
             * vue loading 加载效果
             */
            loading:true,
        }
    },
    created () {
        this.init("1");
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        this.statusCds = store.fetchIDlist("statusCd");
        this.initDdct();
    },
    methods: {
        UpdateCancle(updateForm){
            this.$refs[updateForm].resetFields();
            this.updateFormVisible=false;
        },
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
        DetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
            this.detailFormVisible1=false;
        },
        //对话框确定按钮
        handleClose() {
             this.dialogVisible=false;
             store.saveIDlist("token",null);
             this.$router.push("/");
        },
        reset(ratersPsccd){
            this.params={};
            this.search(ratersPsccd);
        },
        /**
         * 初始化
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
         * 搜索按钮事件
         * @param ratersPsccd
         */
        search(ratersPsccd){
            this.loading = true;
            this.$axios
                    .post("/api/scorelist", {
                        semesters: this.params.semesters,
                        schoolYear: this.params.schoolYear,
                        stCd: this.params.stCd,
                        ratersPsccd:ratersPsccd,
                        userCode:store.fetchIDlist("userInfo").userCode,
                        ratersTypes:'ratersType2,ratersType3',
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
                        if(ratersPsccd=='0'){
                            this.pageParms.total=successResponse.data.data.grid.total;
                        }else{
                            this.pageParms.total2=successResponse.data.data.grid.total;
                        }
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
                        if (successResponse.data.status === 500) { //后台异常时

                        }
                    })
                    .catch(failResponse => {});
            }
        },
        /**
         * 初始化
         * @param ratersPsccd
         */
        init(ratersPsccd){
            this.loading = true;
            this.$axios
                .post("/api/scorelist", {
                    ratersPsccd:ratersPsccd,
                    userCode:store.fetchIDlist("userInfo").userCode,
                    ratersTypes:'ratersType2,ratersType3',
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
        },
        third(){
        },
        //分页事件 页面尺寸事件
        handleSizeChange(ratersPsccd,val){
            store.saveIDlist("pageSize",val);
            this.search(ratersPsccd);
        },
        // /页面当前页
        handleCurrentChange(ratersPsccd,val){
            store.saveIDlist("currentPage",val);
            this.search(ratersPsccd);
        },
    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
    }
}
