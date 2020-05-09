import store from "../../../../store/store";
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
            value1: '',
            value2: '44444',
            newsListData:[],
            pageParms:[
                {total:''}
            ],
            params:[],
            clubList:[],
            statusCds:[],
            dialogVisible: false,
            errorMessage:'',
           /* //添加对话框初始化*/
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
                menuName: [
                    { required: true, message: "请输入菜单名称", trigger: "blur" }
                ],
                url: [{ required: true, message: "请输入菜单URL", trigger: "blur" }],
                sort: [{ required: true, message: "请输入菜单排序码", trigger: "blur" },
                       { type: 'number', message: '请输入数字格式', trigger: 'blur', transform(value) {
                            return Number(value);
                        }}
                ],
                leafFlagCd :[{ required: true, message: "请选择", trigger: "blur" }],
                parentMenuCode :[{ required: true, message: "请选择", trigger: "blur" }],

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
        }
    },
    created () {
        this.init();
        this.clublistinit();
        //页面初始化清空分页参数
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        // store.saveIDlist("currentPage",val);
        this.statusCds = store.fetchIDlist("statusCd");
        let token=store.fetchIDlist("token");
        //console.log("用户Token"+JSON.stringify(this.statusCds));
    },
    methods: {
        dateformat: function (row, column) {
            let date = new Date(row.publishTime).toJSON();
            return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
            replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },
        clublistinit(){
            this.$axios
                .post("/api/clublist", {

                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
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
        DetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
            this.init();
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
            this.params={};
            this.search();
        },//重置事件，将参数置空
        search(){
            this.loading = true;
            this.$axios
                    .post("/api/clubNewsLists", {
                        newsCd: this.params.newsCd,
                        newsStatus: '1',
                        paramsTime: this.params.paramsTime,
                        stSySno: store.fetchIDlist("roleInfo").roleCode!='role-00001'?store.fetchIDlist("userInfo").jobNum:null,
                        currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                        pageSize:store.fetchIDlist("pageSize")
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
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
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
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
                .post("/api/clubNewsLists", {
                    newsStatus: '1',
                    stSySno: store.fetchIDlist("roleInfo").roleCode!='role-00001'?store.fetchIDlist("userInfo").jobNum:null,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
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
              //  this.init();
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
        //分页事件 页面尺寸事件
        handleSizeChange(val){
            store.saveIDlist("pageSize",val);
            this.search();
        },
        // /页面当前页
        handleCurrentChange(val){
            //this.currentPage=val;
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
