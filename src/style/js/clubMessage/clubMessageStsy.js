//引入存储数据的js
import store from "../../../store/store";
//引入表单验证
//import { validateLen, validateChart_ } from '../../../utils/validate/validate'
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
            ListData:[],
            pageParms:[
                {total:''}
            ],
            addForm: {
                messageStCd: '',
                messageDesc: '',
            },
            params:[],
            statusCds:[],
            dialogVisible: false,
            errorMessage:'',
           /* //添加对话框初始化*/
            dialogTableVisible: false,
            dialogFormVisible: false,
            //详情对话框
            detailFormVisible:false,
            detailForm:{
                uuid: '',
                messageSno: '',
                messageCd: '',
                messageStCd:'',
                messageName: '',
                messagePsccd: '',
                messageDesc:'',
                messagePscCode:'',
                messagePscName:'',
                messagePscOpin: '',
                createTime:'',
                updateTime:'',
                messagePsccdDdct:''
            },
            updateFormVisible: false,
            updateForm: {
                fundsCd: '',
                uuid: '',
                stCd: '',
                type: '',
                amount: '',
                amountType:'',
                messagePscCode:'',

            },
            formLabelWidth: '120px',

            //分页参数设置
            currentPage:'',
            pageSize:'',

            stList:[],
            rules: {
                messageStCd: [{ required: true, message: "请选择所属社团编号", trigger: "blur" }],
                messageDesc: [{ required: true, message: "请输入留言内容", trigger: "blur" }],
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
                        .post("/api/messageupdate", {
                            uuid:this.updateForm.uuid,
                            messagePsccd:"1",//设置成完成
                            messagePscOpin: this.updateForm.messagePscOpin,
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
        DetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
        },
        //对话框确定按钮
        handleClose() {
             this.dialogVisible=false;
             store.saveIDlist("token",null);
            this.$router.push("/");
        },
        reset(){
            this.params={};
            this.search();
        },//重置事件，将参数置空
        add(){
            this.dialogFormVisible = true;
            this.initDdct();
        },
        initDdct(){
            this.$axios
                .post("/api/messagesinit", {
                    userCode:store.fetchIDlist("userInfo").userCode,
                    jobNum:store.fetchIDlist("userInfo").jobNum
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
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
        search(){
            this.loading = true;
            this.$axios
                    .post("/api/messageslist", {
                        messageCd: this.params.messageCd,
                        messagePsccd: this.params.messagePsccd,
                        messageStCd: this.params.messageStCd,
                        paramsTime: this.params.paramsTime,
                        messageSno:store.fetchIDlist("userInfo").jobNum,
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
            }
            else
               {
                this.$axios
                    .post("/api/messagesDetail", {
                        uuid: selectData[0].uuid,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.detailForm=successResponse.data.data;
                            this.detailForm.createTime=this.dateFormate.dateformat(this.detailForm.createTime);
                            this.detailForm.updateTime=this.dateFormate.dateformat(this.detailForm.updateTime);
                            if(this.detailForm.messagePsccd=='0'){
                                this.detailForm.messagePsccdDdct="处理中";
                            }
                            if(this.detailForm.messagePsccd=='1'){
                                this.detailForm.messagePsccdDdct="已处理";
                            }
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
                .post("/api/messageslist", {
                    messageSno:store.fetchIDlist("userInfo").jobNum
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
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
        handleSelectionChange(){},
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
        AddCancle(addForm){
            this.$refs[addForm].resetFields();
            this.dialogFormVisible=false;
        },
        //分页事件 页面尺寸事件
        handleSizeChange(val){
            store.saveIDlist("pageSize",val);
            this.search();
        },
        // /页面当前页
        handleCurrentChange(val){
            // alert(val);
            //this.currentPage=val;
            store.saveIDlist("currentPage",val);
            this.search();
        },
        Add(addForm){
            this.$refs[addForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/messagesadd", {
                            messageStCd: this.addForm.messageStCd,//菜单名称
                            messageDesc: this.addForm.messageDesc,
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
                    //alert('error');
                    console.log("error submit!!");
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
