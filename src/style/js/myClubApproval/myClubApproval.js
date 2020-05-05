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
            approvalListData:[],
            pageParms:[
                {total:''}
            ],
            pageParmsSecond:[
                {total:0}
            ],
            params:[],
            paramsSecond:[],
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
            parentMenuCodes:[],

            //分页参数设置
            currentPage:'',
            pageSize:'',
            firstVisiable:true,
            secondVisiable:false,
            //数据加载的效果
            approvalListDataLoading:true,
            approvaledListDataLoading:true,
        }
    },
    created () {
        this.init();
       // this.initApprovered();
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
        formateStatus: function (row, column) {
            switch(row.pcsStCode){
                case '1':
                    return '审核中';
                    break;
                case '2':
                    return '提交到下一环节(院校复核)';
                    break;
                case '3':
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
            this.params={};
            this.search();

        },//重置事件，将参数置空
        search(){
            this.approvalListDataLoading=true;
            this.$axios
                .post("/api/workFlowBusinessList", {
                    workFlowCode: this.params.workFlowCode,
                    businessCode: this.params.businessCode,
                    userCode:store.fetchIDlist("userInfo").userCode,
                    currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                    pageSize:store.fetchIDlist("pageSize"),
                    queryType:"st-",//社团申请
                    pcsStCode:'1'  //审核中的数据
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
                        this.approvalListData=[];
                        this.approvalListData=successResponse.data.data.grid.list;
                        this.total='';
                        this.total=successResponse.data.data.grid.total;
                        this.approvalListDataLoading=false;
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
                .post("/api/workFlowBusinessList", {
                    userCode:store.fetchIDlist("userInfo").userCode,
                    pcsStCode:'1',  //审核中的数据
                    queryType:"st-",//社团申请
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
                        this.approvalListData=[];
                        this.approvalListData=successResponse.data.data.grid.list;
                        this.pageParms.total=successResponse.data.data.grid.total;
                        this.pageParmsSecond.total='?';
                        this.approvalListDataLoading=false;//加载效果去掉
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
                .catch(failResponse => {
                    this.approvalListDataLoading=false;//加载效果去掉
                    this.$message({
                        message: "网络连接错误，请重试！",
                        type: 'warning'
                    })
                });
        },
        approver(){  //审核
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
                this.$router.push({path:'/clubjb/clubApproveInfo',query:{
                        uuid:selectData[0].uuid}});
            }
        },
        handleSelectionChange(){},
        //tab切换
        handleClick(tab, event) {
            console.log(tab, event);
            if(tab.name == 'first'){
                this.firstVisiable=true;
                this.secondVisiable=false;
                this.message='first';
            }else if(tab.name=='second'){
                // 触发‘用户管理’事件
                this.second();
            }else if(tab.name=='third'){
                this.third();
            }
        },
        second(){
            this.firstVisiable=false;
            this.secondVisiable=true;
            this.message='second';
            this.initApprovered();
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

        initApprovered(){
            this.$axios
                .post("/api/workFlowBusinessList", {
                    userCode:store.fetchIDlist("userInfo").userCode,
                    pcsStFlag:'pcsStFlag',  //已经办完标志,
                    queryType:"st-",//社团申请
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
                        this.approvaledListData=[];
                        this.approvaledListData=successResponse.data.data.grid.list;
                        this.pageParmsSecond.total=successResponse.data.data.grid.total;
                        this.approvaledListDataLoading=false;
                    }
                    if (successResponse.data.status === 400) {
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'warning'
                        })
                    }
                    if (successResponse.data.status === 500) { //后台异常时
                        /*let errorMessage =successResponse.data.description;
                        this.$message({
                            message: errorMessage,
                            type: 'warning'
                        })*/
                    }
                })
                .catch(failResponse => {
                    this.approvaledListDataLoading=false;//加载效果去掉
                    this.$message({
                        message: "网络连接错误，请重试！",
                        type: 'warning'
                    })
                });
        },
        info(){
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
                //console.log(JSON.stringify(selectData[0]))
                this.$router.push({path:'/clubjb/clubApproveInfo',query:{businessAssociationCode:selectData[0].businessAssociationCode,
                        uuid:selectData[0].uuid,pageView:'disabled'}});
            }
        }
    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
    }
}
