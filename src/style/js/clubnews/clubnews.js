//引入存储数据的js
import store from "../../../store/store";
export default {
    name: 'news',
    data() {
        return {
            editorOption: {
                placeholder: '请输入公告内容'
            },
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
            newsListData:[],
            pageParms:[
                {total:''}
            ],
            //total:'',
            params:[],
            clubList:[],
            statusCds:[],
            dialogVisible: false,
            errorMessage:'',
            //添加对话框初始化
            dialogTableVisible: false,
            dialogFormVisible: false,
            addForm: {
                newsTitle: '',
                newsDesc: '',
                newsStCd:''

            },
            //详情对话框
            detailFormVisible:false,
            detailForm:{
                menuName: '',
                url: '',
                sort: '',
                leafFlagCd: '',
                parentMenuCode: '',
                remark:'',
                createTime:'',
                updateTime:''
            },
            //修改对话框
            updateFormVisible: false,
            updateForm: {
                newsStCd: '',
                newsTitle: '',
                newsDesc: '',
                uuid: '',
            },
            formLabelWidth: '120px',
            yesOrNoCds:[
                {
                    value: '1',
                    dctValNm: '是'
                },
                {
                    value: '0',
                    dctValNm: '否'
                }
            ],
            rules: {
                noticeStCd: [{ required: true, message: "请选择社团", trigger: "blur" }],
                newsTitle: [{ required: true, message: "请输入新闻标题", trigger: "blur" }],
                newsDesc: [{ required: true, message: "请输入内容", trigger: "blur" }],
            },
            parentMenuCodes:[],

            //分页参数设置
            currentPage:'',
            pageSize:'',

            //角色选择器
            visible:false,
            roleListData:[],
            selectMenuData:[],
            isStatus:true,
            /**
             * vue loading 加载效果
             */
            loading:true,
            isShow:true
        }
    },
    created () {
        if(((store.fetchIDlist("roleInfo").roleCode!='role-00001'&&
            store.fetchIDlist("roleInfo").roleCode!='role-00007'))==false) {
            this.isShow = false;
        }
        this.init();
        this.clublistinit();
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        this.statusCds = store.fetchIDlist("statusCd");
    },
    methods: {
           clublistinit(){
            this.$axios
                .post("/api/clublist", {
                    stChargeSno: (store.fetchIDlist("roleInfo").roleCode!='role-00001'&&
                        store.fetchIDlist("roleInfo").roleCode!='role-00007')==true
                        ?store.fetchIDlist("userInfo").jobNum:null,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.clubList=[];
                        this.clubList=successResponse.data.data.grid.list;
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
        UpdateCancle(updateForm){
            this.$refs[updateForm].resetFields();
            this.updateFormVisible=false;
        },
        AddCancle(addForm){
            this.$refs[addForm].resetFields();
            this.dialogFormVisible=false;
        },
        DetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
            this.init();
        },
        Add(addForm){
            this.$refs[addForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/newsadd", {
                            newsStCd: this.addForm.newsStCd,
                            newsTitle: this.addForm.newsTitle,
                            newsDesc: this.addForm.newsDesc,
                            fundsAssociationCode:store.fetchIDlist("userInfo").userCode,
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
        handleClose() {
             this.dialogVisible=false;
             store.saveIDlist("token",null);
             this.$router.push("/");
        },
        handleSelectionChange(){
            this.isStatus=true;
            const selectData=this.$refs.multipleTable.selection;
            if(selectData[0].newsStatus==0){
                this.isStatus=false;
            }
        },
        reset(){
            this.params={}
        },//重置事件，将参数置空
        search(){
            this.loading = true;
            this.$axios
                    .post("/api/clubnewslists", {
                        newsCd: this.params.newsCd,
                        newsStatus: this.params.newsStatus,
                        paramsTime: this.params.paramsTime,
                        stChargeSno: (store.fetchIDlist("roleInfo").roleCode!='role-00001'&&
                            store.fetchIDlist("roleInfo").roleCode!='role-00007')==true
                            ?store.fetchIDlist("userInfo").jobNum:null,
                        currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                        pageSize:store.fetchIDlist("pageSize")
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.newsListData=[];
                        this.newsListData=successResponse.data.data.grid.list;
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
        }, //搜索按钮事件
        comfirm(){
            const selectData=this.$refs.roleListTable.selection;
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
               // this.selectRoleCode=selectData.roleCode;
                this.visible=false;
                this.$axios
                    .post("/api/menutorole", {
                        selectMenuData: JSON.stringify(this.selectMenuData),
                        selectRoleCode: selectData[0].roleCode,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            let warnMessage = successResponse.data.description;
                            this.$message({
                                message: warnMessage,
                                type: 'success'
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
            }
        },
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
                    .post("/api/newsdetail", {
                        uuid: selectData[0].uuid,
                        userCode:store.fetchIDlist("userInfo").userCode,
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
                    this.$axios
                        .post("/api/newsdelete", {
                            uuid: selectData[0].uuid,
                        }, {
                            headers: {
                                'content-type': 'application/json',
                                "token": store.fetchIDlist("token")
                            }
                        })
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
                        .catch(failResponse => {
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        setStatus(newsStatus){
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
                this.$confirm(newsStatus==1?'生效'+'该数据, 是否继续?':'失效'+'该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //确定删除进行删除
                    this.$axios
                        .post("/api/newsupdate", {
                            uuid: selectData[0].uuid,
                            newsStatus:newsStatus,
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
                    /*this.$message({
                        type: 'info',
                        message: '已取消'
                    });*/
                });

            }
        },
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
                    .post("/api/newsdetail", {
                        uuid: selectData[0].uuid,
                        userCode:store.fetchIDlist("userInfo").userCode,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.detailForm=successResponse.data.data;
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
        init(){
            this.loading = true;
            this.$axios
                .post("/api/clubnewslists", {
                    stChargeSno: (store.fetchIDlist("roleInfo").roleCode!='role-00001'&&
                        store.fetchIDlist("roleInfo").roleCode!='role-00007')==true
                        ?store.fetchIDlist("userInfo").jobNum:null,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.newsListData=[];
                        this.newsListData=successResponse.data.data.grid.list;
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
        //tab切换
        handleClick(tab, event) {
            if(tab.name == 'first'){
            }else if(tab.name=='second'){
            }else if(tab.name=='third'){
            }
        },
        add(){
            this.dialogFormVisible = true;
            this.initParentList();
        },
        Update(updateForm){
            this.$refs[updateForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/newsupdate", {
                            newsStCd: this.updateForm.newsStCd,
                            newsTitle: this.updateForm.newsTitle,
                            newsDesc: this.updateForm.newsDesc,
                            userCode:store.fetchIDlist("userInfo").userCode,
                            uuid:this.updateForm.uuid,
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
                        .catch(failResponse => {});
                } else {
                    return false;
                }
            });
        },
        //分页事件 页面尺寸事件
        handleSizeChange(val){
            store.saveIDlist("pageSize",val);
            this.search();
        },
        // /页面当前页
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
