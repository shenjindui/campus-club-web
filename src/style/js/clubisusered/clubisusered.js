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
            menuListData:[],
            pageParms:[
                {total:''}
            ],
            params:[],
            statusCds:[],
            dialogVisible: false,
            errorMessage:'',
            /* //添加对话框初始化*/
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
                menuName: '',
                url: '',
                sort: '',
                leafFlagCd: '',
                parentMenuCode: '',
                remark:''

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
           /* rules: {
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

            },*/

            //分页参数设置
            currentPage:'',
            pageSize:'',

            //角色选择器
            visible:false,
            stListData:[],
            // selectRoleCode:''
            isStatus:false

        }
    },
    created () {
        this.init();
        //页面初始化清空分页参数
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        // store.saveIDlist("currentPage",val);
        this.statusCds = store.fetchIDlist("statusCd");
        let token=store.fetchIDlist("token");
        //console.log("用户Token"+JSON.stringify(this.statusCds));
    },
    methods: {
        //对话框确定按钮
        handleClose() {
            this.dialogVisible=false;
            store.saveIDlist("token",null);
            this.$router.push("/");
        },
        //对状态进行翻译
        formateClubStatus: function (row, column) {
            switch(row.statusCd){
                case 0:
                    return '未生效';
                    break;
                case 1:
                    return '生效';
                    break;
                case 2:
                    return '失效';
                    break;
                default:
                    return '未知错误';
            }
        },
        //对工作流状态翻译
        workFlowStatus:function(row, column){
            switch(row.workflowCd){
                case 0:
                    return '待审核';
                    break;
                case 1:
                    return '审核中';
                    break;
                case 2:
                    return '审核通过';
                    break;
                case 3:
                    return '审核不通过';
                    break;
                default:
                    return '未知错误';
            }
        },
        //对时间进行格式化
        dateformat: function (row, column) {
            let d = new Date(row.createTime.substr(0, 19));//加入substr(0, 19)处理兼容ios报错NAN
            let year = d.getFullYear();       //年
            let month = d.getMonth() + 1;     //月
            let day = d.getDate();            //日
            let hh = d.getHours();            //时
            let mm = d.getMinutes();          //分
            let ss = d.getSeconds();           //秒
            let clock = year + "-";
            if (month < 10)
                clock += "0";
            clock += month + "-";
            if (day < 10)
                clock += "0";
            clock += day + " ";
            if (hh < 10)
                clock += "0";
            clock += hh + ":";
            if (mm < 10) clock += '0';
            clock += mm + ":";
            if (ss < 10) clock += '0';
            clock += ss;
            return (clock);
        },
        reset(){
            this.params={}
        },//重置事件，将参数置空
        search(){
            this.$axios
                .post("/api/clublist", {
                    stCd: this.params.stCd,
                    stName: this.params.stName,
                    statusCds: "1,2",
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
        }, //搜索按钮事件
        init(){
            this.$axios
                        .post("/api/clublist", {
                            statusCds: "1,2",
                        },{headers: {
                                'content-type': 'application/json',
                                "token":store.fetchIDlist("token")  //token换成从缓存获取
                            }})
                        .then(successResponse => {
                            if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
                        this.stListData=[];
                        this.stListData=successResponse.data.data.grid.list;
                        //this.total='';
                        //this.total=successResponse.data.data.grid.total;
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

        handleSelectionChange(){
            this.isStatus=true; //停用为true
            const selectData=this.$refs.multipleTable.selection;
            if(selectData[0].statusCd==2){  /* 1生效的 2失效的*/
                this.isStatus=false;
            }
        },
        uodateStatus(isStatus){
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
                this.$confirm('此操作将停用或启用社团, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios
                        .post("/api/uodateStatus", {
                            uuid:selectData[0].uuid,
                            isStatus:isStatus,
                            userCode:store.fetchIDlist("userInfo").userCode,
                            isWorkFlow:false
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
                                this.errorMessage =successResponse.data.description;
                                this.dialogVisible=true;
                            }
                        })
                        .catch(failResponse => {});
                }).catch(() => {
                });

            }
        }

    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
    }
}
