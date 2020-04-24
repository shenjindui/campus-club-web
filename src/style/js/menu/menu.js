import store from "../../../store/store";//引入存储数据的js
import {
    isInteger,
} from "../../../utils/validate/validate"; //引入自定义的校验js
/**
 * 校验菜单排序码格式
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
const  checkisDecimal = (rule, value, callback) => {
    if(!value){
        return callback(new Error("菜单排序码不能为空"));
    }else{
        if (isInteger(value)) {
            callback();
        }else{
            return callback(new Error("菜单排序码格式不正确"));
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
            value2: '44444',
            /**
             * table 列表菜单数据初始化
             */
            menuListData:[],
            /**
             * 分页参数初始化
             */
            pageParms:[
                {total:''}
            ],
            /**
             * 查询参数初始化
             */
            params:[],
            /**
             * 状态数据字典初始化
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
            addForm: {
                menuName: '',
                url: '',
                sort: '',
                leafFlagCd: '',
                parentMenuCode: '',
                remark:''
            },
            /**
             * 详情对话框
             */
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
            /**
             * 修改对话框
             */
            updateFormVisible: false,
            updateForm: {
                menuName: '',
                url: '',
                sort: '',
                leafFlagCd: '',
                parentMenuCode: '',
                remark:''

            },
            /**
             * 设置el-form-item 的长度
             */
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
            /**
             * 表单规则校验
             */
            rules: {
                menuName: [
                    { required: true, message: "请输入菜单名称", trigger: "blur" }
                ],
                url: [{ required: true, message: "请输入菜单URL", trigger: "blur" }],
                sort: [{ required: true, message: "请输入菜单排序码", trigger: "blur" },
                    { validator: checkisDecimal ,trigger: "blur" }],
                leafFlagCd :[{ required: true, message: "请选择", trigger: "blur" }],
                parentMenuCode :[{ required: true, message: "请选择", trigger: "blur" }],

            },
            /**
             * 一级菜单列表初始化
             */
            parentMenuCodes:[],
            /**
             * 分页参数设置
             */
            currentPage:'',
            pageSize:'',
            /**
             * 角色选择器
             */
            visible:false,
            roleListData:[],
            selectMenuData:[],
            //一级菜单
            small:true,
            parentListTotal:0,
            /**
             * vue loading 加载效果
             */
            loading:true,
        }
    },
    created () {
        this.init();
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        this.statusCds = store.fetchIDlist("statusCd");
        let token=store.fetchIDlist("token");
    },
    methods: {
        /**
         * 菜单修改取消操作，重置表单的值
         * @param updateForm
         */
        menuUpdateCancle(updateForm){
            this.$refs[updateForm].resetFields();
            this.updateFormVisible=false;
        },
        /**
         * 添加菜单取消操作时，重置表单的值
         * @param addForm
         */
        menuAddCancle(addForm){
            this.$refs[addForm].resetFields();
            this.dialogFormVisible=false;
        },
        /**
         * 详情菜单取消操作时
         * @param detailForm
         */
        menuDetailCancle(detailForm){
            this.detailFormVisible=false;
        },
        /**
         * 菜单添加回调函数
         * @param addForm
         */
        menuAdd(addForm){
            this.$refs[addForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/menuedit", {
                            menuName: this.addForm.menuName,
                            url: this.addForm.url,
                            sort: this.addForm.sort,
                            leafFlagCd: this.addForm.leafFlagCd,
                            parentMenuCode: this.addForm.parentMenuCode,
                            remark: this.addForm.remark,
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
                } else {
                    //alert('error');
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        /**
         * 后台500弹出框确认函数
         */
        handleClose() {
             this.dialogVisible=false;
             //store.saveIDlist("token",null);
             // this.$router.push("/");
        },
        /**
         * 重置按钮方法，将参数置空
         */
        reset(){
            this.params={};
            this.init();
        },
        /**
         * 搜索功能
         */
        search(){
            this.loading = true;
            this.$axios
                    .post("/api/menulist", {
                        menuCode: this.params.menuCode,
                        menuName: this.params.menuName,
                        statusCd: this.params.statusCd,
                        paramsTime: this.params.paramsTime,
                        currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                        pageSize:store.fetchIDlist("pageSize")
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
                        this.menuListData=[];
                        this.menuListData=successResponse.data.data.grid.list;
                        this.loading = false;
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
        }, //搜索按钮事件
        /**
         * 菜单分配给角色
         */
        apportion(){
            const selectMenuData=this.$refs.multipleTable.selection;
            this.selectMenuData=selectMenuData;
            let flag=-1;
            selectMenuData.forEach(function (c) {
                if(c.role_code!=null){
                    flag=1;
                }
            })
            if(selectMenuData.length<1) {
                this.$message({
                    message: "请至少选择一条记录",
                    type: 'warning'
                })
            }else{
                this.initRoleList();
                this.visible=true;
            }
            if(flag>0){
                this.$message({
                    message: "提示:已选择记录中存在已分配角色菜单!",
                    type: 'warning'
                })
            }
        },
        /**
         * 角色分配确定事件
         */
        comfirm(){
            this.loading = true;
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
                this.visible=false;
                this.$axios
                    .post("/api/menutorole", {
                        selectMenuData: JSON.stringify(this.selectMenuData),
                        selectRoleCode: selectData[0].roleCode,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            let warnMessage = successResponse.data.description;
                            this.$message({
                                message: warnMessage,
                                type: 'success'
                            })
                            this.loading = false;
                            this.search();

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
        /**
         * 编辑/修改时间
         */
        edit(){
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
                this.$axios
                    .post("/api/menudetail", {
                        uuid: selectData[0].uuid,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.updateForm=successResponse.data.data;
                            this.updateFormVisible=true;
                            this.loading = false;
                            this.initParentList();

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
                this.$axios
                    .post("/api/menudelete", {
                        uuid: selectData[0].uuid,
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
                            this.loading = false;
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
                    .post("/api/menudetail", {
                        uuid: selectData[0].uuid,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.detailForm=successResponse.data.data;
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
        /**
         * 页面加载初始化事件
         */
        init(){
            this.loading = true;
            this.$axios
                .post("/api/menulist", {
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
                        this.menuListData=[];
                        this.menuListData=successResponse.data.data.grid.list;
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
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'error'
                        })
                       /* this.errorMessage =successResponse.data.description;
                        this.$confirm('请不要重复刷新?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'info',
                                message: '请稍后重试'
                            });
                        }).catch(() => {

                        });*/
                    }
                })
                .catch(failResponse => {});
        },
        /**
         * 根据列表选中的值，判断按钮显示的是生效？失效
         */
        handleSelectionChange(){

        },
        //tab切换
        handleClick(tab, event) {
            console.log(tab, event);
            if(tab.name == 'first'){
                // 触发‘菜单列表’事件
              //  this.init();
            }else if(tab.name=='second'){
                // 触发‘用户管理’事件
                this.second();
            }else if(tab.name=='third'){
                 this.third();
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
        /**
         * 添加按钮初始化
         */
        add(){
            this.dialogFormVisible = true;
            this.initParentList(1);
        },
        /**
         * 初始化一级菜单
         * @param val
         */
        initParentList(val){
            this.loading = true;
            this.$axios
                .post("/api/menulist", {
                    parentMenuCode: '0',
                    statusCd: 1,
                    delInd:0,
                    currentPage: val==0?1:val,
                    pageSize:store.fetchIDlist("pageSize")
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.parentMenuCodes=successResponse.data.data.grid.list;
                        this.parentListTotal=successResponse.data.data.grid.total;
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
         * 菜单修改确认事件
         * @param updateForm
         */
        menuUpdate(updateForm){
            this.loading = true;
            this.$refs[updateForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/menuupdate", {
                            menuCode:this.updateForm.menuCode,
                            uuid:this.updateForm.uuid,
                            menuName: this.updateForm.menuName,//菜单名称
                            url: this.updateForm.url,
                            sort: this.updateForm.sort,
                            leafFlagCd: this.updateForm.leafFlagCd,
                            parentMenuCode: this.updateForm.parentMenuCode,
                            remark: this.updateForm.remark,
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
                                this.loading = false;
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
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        /**
         * 分页事件 页面尺寸事件
         * @param val
         */
        handleSizeChange(val){
            store.saveIDlist("pageSize",val);
            this.search();
        },
        parentCurrentChange(val){
            store.saveIDlist("currentPage",val);
            this.initParentList(val);
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
         * 菜单分配角色列表初始化角色列表
         */
        initRoleList(){
            this.loading = true;
            this.$axios
                .post("/api/rolelistAll", {
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data.grid.list);
                        this.roleListData=[];
                        this.roleListData=successResponse.data.data.grid.list;
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
    },
    //computed用来监控自己定义的变量，该变量不在data里面声明，
    // 直接在computed里面定义，然后就可以在页面上进行双向数据绑定展示出结果或者用作其他处理
   /* computed: {
        unreadNum(){
            return this.unread.length;
        }
    }*/
}
