//引入存储数据的js
import store from "../../../store/store";
//引入表单验证
//import { validateLen, validateChart_ } from '../../../utils/validate/validate'
export default {

    name: 'tabs',
    data() {
        return {
            ratersPsccd: '0',
            showHeader: false,
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
            /* //添加对话框初始化*/
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
                menuName: [
                    {required: true, message: "请输入菜单名称", trigger: "blur"}
                ],
                url: [{required: true, message: "请输入菜单URL", trigger: "blur"}],
                sort: [{required: true, message: "请输入菜单排序码", trigger: "blur"},
                    {
                        type: 'number', message: '请输入数字格式', trigger: 'blur', transform(value) {
                            return Number(value);
                        }
                    }
                ],
                leafFlagCd: [{required: true, message: "请选择", trigger: "blur"}],
                parentMenuCode: [{required: true, message: "请选择", trigger: "blur"}],

            },
            messagePsccdList: [
                {
                    Cd: '1',
                    Name: '已处理'
                },
                {
                    Cd: '0',
                    Name: '处理中'
                }
            ],
            //数据字典初始化
            stList: [],
            schoolYearList:[],
            semestersList:[],
            ratersPsccdList:[],
            isShowStList:false

        }


    },
    created () {
        this.init("0");
        //页面初始化清空分页参数
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        this.statusCds = store.fetchIDlist("statusCd");
        let token=store.fetchIDlist("token");
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
                    console.log("error submit!!");
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
        //对状态进行翻译
       formateStatus: function (row, column) {
            switch(row.messagePsccd){
                case '0':
                    return '处理中';
                    break;
                case '1':
                    return '已处理';
                    break;
                default:
                    return '未知错误';
            }
        },
        dateformatUpdateTime: function (row, column) {
            var date = new Date(row.updateTime).toJSON();
            return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
            replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },
        dateformatCreateTime: function (row, column) {
            var date = new Date(row.createTime).toJSON();
            return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
            replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },
        dateformats: function (date) {
            var date = new Date(date).toJSON();
            return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
            replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },
        reset(ratersPsccd){
            this.params={
            };
            this.search(ratersPsccd);
        },
        add(){
            this.dialogFormVisible = true;
            this.initDdct();
        },
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
                    //alert('error');
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        initDdct(){
            this.$axios
                .post("/api/scoreinit", {
                    userCode:store.fetchIDlist("userInfo").userCode
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
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
        search(ratersPsccd){
            this.$axios
                    .post("/api/scorelist", {
                        semesters: this.params.semesters,
                        schoolYear: this.params.schoolYear,
                        stCd: this.params.stCd,
                        ratersPsccd:ratersPsccd,
                        ratersType:'ratersType3',
                        paramsTime: this.params.paramsTime,
                        userCode:store.fetchIDlist("userInfo").userCode,
                        currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                        pageSize:store.fetchIDlist("pageSize")
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
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
                .catch(failResponse => {});
        }, //搜索按钮事件
        deletes(){
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
                        .post("/api/messagedelete", {
                            uuid: selectData[0].uuid,
                            flag:"0"
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
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });

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
                    .post("/api/scoreDetail", {
                        uuid: selectData[0].uuid,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
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
        detail(ratersPsccd){
            let selectData='';
            if(ratersPsccd=='0'){
                selectData=this.$refs.multipleTable.selection;
            }else{
                selectData=this.$refs.multipleTables.selection;
            }
            //const selectData=this.$refs.multipleTable.selection;
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
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.detailForm=successResponse.data.data;
                            this.detailForm.createTime=this.dateformats(this.detailForm.createTime);
                            this.detailForm.updateTime=this.dateformats(this.detailForm.updateTime);
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
        init(ratersPsccd){
            this.$axios
                .post("/api/scorelist", {
                    ratersPsccd:ratersPsccd,
                    ratersType:"ratersType3",
                    userCode:store.fetchIDlist("userInfo").userCode,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
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
            alert('2222');
            console.log('我是配置管理');
        },
        third(){
            alert('2222');
            console.log('我是配置管理');
        },
        AddCancle(addForm){
            this.$refs[addForm].resetFields();
            this.dialogFormVisible=false;
        },
        //分页事件 页面尺寸事件
        handleSizeChange(val){
            store.saveIDlist("pageSize",val);
            this.search('0');
        },
        // /页面当前页
        handleCurrentChange(val){
            // alert(val);
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
