import store from "../../../store/store";
import Schart from 'vue-schart';
import bus from '../../../components/common/bus';
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
    name: 'dashboard',
    data() {
        return {
            userInfo:{
                realname: '',
                usercode:'',
                lastLoginTime:'',
                lastLoginAddress:'',
                headPortrait:'',
                jobNum: ''
            },
            formLabelWidth: '120px',
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
            roleCode:'',
            jobNum:'',
            initResult:[],
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

            },
            token: {token: store.fetchIDlist("token") },
            imageUrl: '',
            todoList: [{
                title: '今天要修复100个bug',
                status: false,
            },
                {
                    title: '今天要修复100个bug',
                    status: false,
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: false,
                }, {
                    title: '今天要修复100个bug',
                    status: false,
                },
                {
                    title: '今天要修复100个bug',
                    status: true,
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: true,
                }
            ],
            data: [{
                name: '2018/09/04',
                value: 1083
            },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
            options: {
                title: '最近七天每天的用户访问量',
                showValue: false,
                fillColor: 'rgb(45, 140, 240)',
                bottomPadding: 30,
                topPadding: 30
            },
            options2: {
                title: '最近七天用户访问趋势',
                fillColor: '#FC6FA1',
                axisColor: '#008ACD',
                contentColor: '#EEEEEE',
                bgColor: '#F5F8FD',
                bottomPadding: 30,
                topPadding: 30
            }
        }
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.userInfo.realname /*=== 'admin' ? '超级管理员' : '普通用户'*/;
        },

 },
    mounted () {
        let userInfo2=store.fetchIDlist("userInfo");
        if ('WebSocket' in window) {
            var userCode=userInfo2.userCode;
            this.websocket = new WebSocket('ws://localhost:8889/push/websocket/'+userCode);
            this.initWebSocket()
        } else {
            alert('当前浏览器 不支持')
        }
    },
    beforeDestroy () {
        this.onbeforeunload()
    },
    created(){
        let menuList=store.fetchIDlist("menuList");
        let userInfo2=store.fetchIDlist("userInfo");
        let roleInfo=store.fetchIDlist("roleInfo");
        let headPortrait=store.fetchIDlist("headPortrait");
        let headPortraits=store.fetchIDlist("headPortraits");
        //console.log(JSON.stringify(userInfo2));
        //let addressResult=store.fetchIDlist("addressResult");
        this.userInfo.realname=userInfo2.realname;
        this.userInfo.usercode=userInfo2.userCode;
        this.userInfo.jobNum=userInfo2.jobNum;
        this.userInfo.lastLoginTime= this.dateformat(userInfo2.lastLoginTime);
        this.handleListener();
        this.changeDate();
        ///this.userInfo.lastLoginAddress=addressResult.address;
        if(headPortrait.length<1){
            this.userInfo.headPortrait='';
        }else{
            this.userInfo.headPortrait=headPortrait[0].fileRte;
        }
        if(headPortraits!=null&&headPortraits!=''){
            this.userInfo.headPortrait=headPortraits;
        }
        this.openNotify(this.userInfo.headPortrait);
        this.roleCode = roleInfo.roleCode;
        this.init(this.roleCode);//初始化页面数据

    },
    activated(){
        this.handleListener();
    },
    deactivated(){
        window.removeEventListener('resize', this.renderChart);
        bus.$off('collapse', this.handleBus);
    },
    methods: {
        init(roleCode){
            this.$axios
                .post("/api/initUserInfo", {
                    roleCode:roleCode,
                    userCode:store.fetchIDlist("userInfo").userCode,
                    jobNum:store.fetchIDlist("userInfo").jobNum
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.initResult=[];
                        this.initResult=successResponse.data.data;
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
         * 更新用户基本信息
         * @param updateForm
         * @constructor
         */
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
        checkUserInfo(){
            this.updateFormVisible=true;
        },
        //用户信息完善取消
        UpdateCancle(updateForm){
            this.$refs[updateForm].resetFields();
            this.updateFormVisible=false;
        },
        initWebSocket () {
            // 连接错误
            this.websocket.onerror = this.setErrorMessage

            // 连接成功
            this.websocket.onopen = this.setOnopenMessage

            // 收到消息的回调
            this.websocket.onmessage = this.setOnmessageMessage

            // 连接关闭的回调
            this.websocket.onclose = this.setOncloseMessage

            // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = this.onbeforeunload
        },
        setErrorMessage () {
            console.log('WebSocket连接发生错误   状态码：' + this.websocket.readyState)
        },
        setOnopenMessage () {
            console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
        },
        setOnmessageMessage (event) {
            // 根据服务器推送的消息做自己的业务处理
            console.log('服务端返回：' + event.data+"----")
            if(event.data!=''||event.data!=null||event.data!='{}'){
                this.$notify.info({
                    title: '系统提示',
                    message: '您有未缴纳的社费信息,请及时前往缴纳！',
                });
            }
        },
        setOncloseMessage () {
            console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
        },
        onbeforeunload () {
            this.closeWebSocket()
        },
        closeWebSocket () {
            this.websocket.close()
        },
        openNotify(headPortrait) {
            if(headPortrait==''||headPortrait==null){
                this.$notify.info({
                    title: '消息',
                    message: '您的个人头像信息还未完善,请及时完善！',
                    /*offset: 100*/
                });
            }
        },
        handleAvatarSuccess(res, file) {
            this.userInfo.headPortrait=res.data.result.fileRte;
            store.saveIDlist("headPortraits",this.userInfo.headPortrait);
            //alert(this.userInfo.headPortrait);
            if(res.status==200){
                this.$message({
                    message: '上传成功',
                    type: 'success'
                })
            }
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        dateformat: function (date) {
            var date = new Date(date).toJSON();
            return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
            replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },
        changeDate(){
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
            })
        },
        handleListener(){
            bus.$on('collapse', this.handleBus);
            // 调用renderChart方法对图表进行重新渲染
            window.addEventListener('resize', this.renderChart)
        },
        handleBus(msg){
            setTimeout(() => {
                this.renderChart()
            }, 300);
        },
        renderChart(){
            this.$refs.bar.renderChart();
            this.$refs.line.renderChart();
        },
    }
}

