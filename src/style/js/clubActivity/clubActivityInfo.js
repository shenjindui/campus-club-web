import store from "../../../store/store";
import {
    checkBailPayMoney
} from "../../../utils/validate/validate"; //引入自定义的校验js
const  checkIsBailPayMoney = (rule, value, callback) => {
    if(!value){
        return callback(new Error("活动资金不能为空"));
    }else{
        if (checkBailPayMoney(value)) {
            callback();
        }else{
            return callback(new Error("活动资金格式不正确"));
        }
    }
}
export default {
    /**
     * 强制刷新
     */
    inject:['reload'],
    data() {
        return {
            active: 0,
            /**
             * 基本信息表单
             */
            baseInfoForm: {
                activityName: '',
                activitySpace: '',
                activityType: '',
                foundsNum:'',
                startTime: '',
                endTime: '',
                activityDsc:'',
                activityTime:'',
                stChargeSno:'',
                stCd:'',
                uuid:''
            },
            /**
             * 时间控件选择器
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
            /**
             * 意见表单
             */
            opinionForm:{
                opinion:''
            },
            /**
             * 设置el-form-item 的长度
             */
            formLabelWidth: '100px',
            /**
             * 文件列表数据
             */
            fileTableData:[],
            /**
             * token值
             */
            token: {token: store.fetchIDlist("token") },
            /**
             * 用户编号
             */
            userCode:store.fetchIDlist("userInfo").userCode,
            /**
             * 隐藏的参数
             */
            hideParms:{
                uuid:'',
                stCd:'',
                sysBusinessCode:''
            },
            /**
             * 表单验证规则
             */
            rules: {
                activityName: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
                activitySpace: [{ required: true, message: "请输入活动地点", trigger: "blur" }],
                activityType: [{ required: true, message: "请选择活动类型", trigger: "blur" }],
                activityTime: [{ required: true, message: "请选择活动时间", trigger: "blur" }],
                activityDsc: [{ required: true, message: "请输入活动内容", trigger: "blur" }],
                foundsNum: [{ required: true, message: "请输入资金预算金额", trigger: "blur" },
                    { validator: checkIsBailPayMoney ,trigger: "blur" }],
            },
            /**
             * 工作流选择对话框
             */
            workflowTableVisible:false,
            /**
             * 审核人列表
             */
            approverDataList:[],
            /**
             * 后台500异常对话框
             */
            dialogVisible:false,
            errorMessage:'',
            uuid:''
        };
    },
    created () {
        this.init();
        this.initDdct();
    },
    methods: {
        /**
         * 后台500对话框确定按钮
         */
        handleClose() {
            this.dialogVisible=false;
            //store.saveIDlist("token",null);
            //this.$router.push("/");
        },
        next() {
            if (this.active++ > 2) {
            }
        },
        step() {
            if (this.active-- <0) {
            }
        },
        onSubmit() {
        },
        /**
         * 文件列表
         */
        getFileList(){
            this.$axios
                .post("/api/fileList", {
                    currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                    pageSize:store.fetchIDlist("pageSize"),
                    filePurpose:1,
                    stCd:this.hideParms.stCd,
                    userCode:store.fetchIDlist("userInfo").userCode,

                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data.grid.list);
                        this.fileTableData=[];
                        this.fileTableData=successResponse.data.data.grid.list;
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
                    }
                })
                .catch(failResponse => {});
        },
        /**
         * 返回事件
         */
        back(){
            this.$router.push("/clubActivity");
        },
        /**
         * 页面加载初始化字典数据
         */
        initDdct(){
            this.$axios
                .post("/api/clubActivityAddInit", {
                    "dctKey":"activityType"
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.activityTypeList=[];
                        this.activityTypeList=successResponse.data.data.activityTypeList;
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
         * 页面加载初始化数据
         */
        init(){
            this.$axios
                .post("/api/clubActivityDetail", {
                    uuid:this.$route.query.uuid,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.baseInfoForm=successResponse.data.data;
                        this.getFileList();
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
                    }
                })
                .catch(failResponse => {});
        },
    }
}
