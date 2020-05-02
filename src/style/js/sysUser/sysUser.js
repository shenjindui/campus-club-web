//引入存储数据的js
import store from "../../../store/store";
import {
    checkRealName,
    isDecimal,
    isJobNum,
    validateEMail,
    validatePhone,
    validateQQ, validateWechat
} from "../../../utils/validate/validate";

/**
 * 校验工号  例如 3168907225
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
const  checkJobNum = (rule, value, callback) => {
    if(!value){
        return callback(new Error("工号不能为空"));
    }else{
        if (isJobNum(value)) {
            callback();
        }else{
            return callback(new Error("工号格式不正确"));
        }
    }
}
/**
 * 校验邮箱
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
const  checkEmail = (rule, value, callback) => {
    if(!value){
        return callback(new Error("邮箱不能为空"));
    }else{
        if (validateEMail(value)) {
            callback();
        }else{
            return callback(new Error("邮箱格式不正确"));
        }
    }
}
const  checkName = (rule, value, callback) => {
    if(!value){
        return callback(new Error("姓名不能为空"));
    }else{
        if (checkRealName(value)) {
            callback();
        }else{
            return callback(new Error("姓名格式不正确"));
        }
    }
}
const  checkMobile = (rule, value, callback) => {
    if(!value){
        return callback(new Error("手机号不能为空"));
    }else{
        if (validatePhone(value)) {
            callback();
        }else{
            return callback(new Error("手机号格式不正确"));
        }
    }
}
const  checkQQ = (rule, value, callback) => {
    if(!value){
        return callback(new Error("QQ号不能为空"));
    }else{
        if (validateQQ(value)) {
            callback();
        }else{
            return callback(new Error("QQ号格式不正确"));
        }
    }
}
const  checkWechat = (rule, value, callback) => {
    if(!value){
        return callback(new Error("微信号不能为空"));
    }else{
        if (validateWechat(value)) {
            callback();
        }else{
            return callback(new Error("微信号格式不正确"));
        }
    }
}
export default {
    inject:['reload'],
    name: 'tabs',
    data() {
        return {
            message: 'first',
            showHeader: false,
            value1: '',
            ListData:[],
            pageParms:[
                {total:''}
            ],
            params:[],
            statusCds:[],
            dialogVisible: false,
            errorMessage:'',
            dialogTableVisible: false,
            dialogFormVisible: false,
            //详情对话框
            detailFormVisible:false,
            detailForm:{
                uuid: '',
                realname: '',
                loginName: '',
                userNum: '',
                browserName: '',
                browserVersion:'',
                email:'',
                loginIp:'',
                mac: '',
                osName:'',
                createTime:'',
                updateTime:''
            },
            formLabelWidth: '120px',
            rules: {
                jobNum: [{ required: true, message: "请输入工号", trigger: "blur" },
                    { validator: checkJobNum ,trigger: "blur" }],
                email: [{ required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail ,trigger: "blur" }],
                realname: [{ required: true, message: "请输入真实姓名", trigger: "blur" },
                    { validator: checkName ,trigger: "blur" }],
                mobile: [{ required: true, message: "请输入手机号", trigger: "blur" },
                    { validator: checkMobile ,trigger: "blur" }],
                qq: [{ required: true, message: "请输入QQ号", trigger: "blur" },
                    { validator: checkQQ ,trigger: "blur" }],
                wechat: [{ required: true, message: "请输入微信号", trigger: "blur" },
                    { validator: checkWechat ,trigger: "blur" }],
                sexCd: [{ required: true, message: "请选择性别", trigger: "blur" },
                    ],
            },
            sexCds:[
                {
                    value: '1',
                    dctValNm: '男'
                },
                {
                    value: '0',
                    dctValNm: '女'
                }
            ],
            updateFormVisible: false,
            updateForm: {
                jobNum: '',
                email:'',
                realname:'',
                mobile:'',
                userCode:'',
                qq:'',
                wechat:''

            },

        }
    },
    created () {
        this.init();
    },
    methods: {
        update(){
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
                    .post("/api/userdetails", {
                        loginName: selectData[0].loginName,
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
        //用户信息完善取消
        UpdateCancle(updateForm){
            this.$refs[updateForm].resetFields();
            this.updateFormVisible=false;
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
        //对状态进行翻译
       formateStatus: function (row, column) {
            switch(row.statusCd){
                case '0':
                    return '失效';
                    break;
                case '1':
                    return '生效';
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
        dateformats: function (date) {
            var date = new Date(date).toJSON();
            return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
            replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },
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
                    .post("/api/userdetails", {
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
            this.$axios
                .post("/api/userList", {
                    userCode:store.fetchIDlist("userInfo").userCode,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        console.log(successResponse.data.data);
                        this.ListData=[];
                        this.ListData=successResponse.data.data.grid.list;
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
        Update(updateForm){
            this.$refs[updateForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/userPerfect", {
                            jobNum:this.updateForm.jobNum,
                            email: this.updateForm.email,
                            realname: this.updateForm.realName,
                            mobile:this.updateForm.mobile,
                            qq: this.updateForm.qq,
                            wechat:this.updateForm.wechat,
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
                                store.saveIDlist("userInfo",successResponse.data.data);
                                this.reload()

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
                                this.updateFormVisible=false;
                            }
                        })
                        .catch(failResponse => {});
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        formateSex: function (row, column) {
            switch(row.sexCd){
                case '0':
                    return '女';
                    break;
                case '1':
                    return '男';
                    break;
                default:
                    return '未知错误';
            }
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
        handleSelectionChange(){
            this.isStatus=true;
            const selectData=this.$refs.multipleTable.selection;
            if(selectData[0].statusCd==0){
                this.isStatus=false;
            }
        },
        UpdateConfirm(updateForm){
            this.$refs[updateForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/userPerfect", {
                            jobNum:this.updateForm.jobNum,
                            email: this.updateForm.email,
                            realname: this.updateForm.realname,
                            sexCd: this.updateForm.sexCd,
                            mobile:this.updateForm.mobile,
                            qq: this.updateForm.qq,
                            wechat:this.updateForm.wechat,
                            uuid:this.updateForm.uuid,
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
                                store.saveIDlist("userInfo",successResponse.data.data);
                                this.reload();

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
                                this.updateFormVisible=false;
                            }
                        })
                        .catch(failResponse => {});
                } else {
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
