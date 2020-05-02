import store from "../../../store/store";
import {
    validateEMail,
} from "../../../utils/validate/validate";
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
export default {
    data: function() {
        return {
            /**
             * 邮箱验证码
             */
            verificationCode:'',
            /**
             * 是否显示验证码
             */
            verificationCodeShow:false,
            msg: '',
            fullscreenLoading: false,
            /**
             * 图片滑动验证
             */
            text: '请往向右滑验证',
            /**
             * 图片滑动集合
             */
            imgs: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            /**
             *
             */
            ruleForm: {
                loginName: "",
                password: ""
            },
            /**
             * 注册表单
             */
            registerForm: {
                loginName: "",
                password: "",
                confirmpassword:"",
                email:""
            },
            /**
             * 重置表单
             */
            resetForm: {
                password: "",
                confirmpassword:"",
            },
            /**
             * 忘记密码表单
             */
            forgotForm: {
                loginName: "",
                email:""
            },
            /**
             * 表单提交校验
             */
            rules: {
                loginName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
                confirmpassword: [{ required: true, message: "请确认密码", trigger: "blur" }],
                email: [{ required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail ,trigger: "blur" }],
            },
            /**
             * tab页切换
             */
            tab:1,
            /**
             * vue loading 加载效果
             */
            loading:true,
            count: '',
            timer: null
        };
    },
    created () {
        this.checkTokenIsExit();
    },
    /**
     * 监听路由跳转
     */
    watch: {
        '$route'(to, from) {
            this.$router.go(0);
        }
    },
    methods: {
        /**
         * token校验
         */
        checkTokenIsExit(){
            var token=store.fetchIDlist("token");
            if(token!=null&&token!=''){
                this.$router.push("/dashboard");
            }
        },

        /**
         * 图片滑动验证失败
         */
        onFail(){
            this.msg = ''
        },
        /**
         * 图片滑动验证刷新
         */
        onRefresh(){
            this.msg = ''
        },
        handleChange(value) {
            console.log(value);
        },
        /**
         * 登陆按钮
         * @param formName
         */
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const loading = this.$loading({
                        lock: true,
                        text: '正在登陆中',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    setTimeout(() => {
                       // this.fullscreenLoading = false;
                        this.login(loading);
                    }, 2000);
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        /**
         * 登陆事件
         * @param loading
         */
        login(loading) {
            this.$axios
                .post("/api/login", {
                    loginName: this.ruleForm.loginName,
                    password: this.ruleForm.password
                })
                .then(successResponse => {
                    this.responseResult = JSON.stringify(successResponse.data);
                    this.responseResult = JSON.stringify(successResponse.data);
                    console.log(successResponse.data)
                    if (successResponse.data.status === 200) {
                        let successMessage = successResponse.data.description;
                        this.$message({
                            message: successMessage,
                            type: 'success'
                        })
                        store.saveIDlist("token",successResponse.data.data.token)
                        store.saveIDlist("menuList",successResponse.data.data.menuInfo);
                        store.saveIDlist("statusCd",successResponse.data.data.dctKeyInfo);
                        store.saveIDlist("userInfo",successResponse.data.data.userInfo);
                        store.saveIDlist("roleInfo",successResponse.data.data.roleInfo);
                        store.saveIDlist("addressResult",successResponse.data.data.addressResult);
                        store.saveIDlist("headPortrait",successResponse.data.data.headPortrait)
                        this.$router.push("/dashboard");
                        loading.close();
                    }
                    if (successResponse.data.status === 400) {
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'warning'
                        })
                        loading.close();
                    }
                    if (successResponse.data.status === 500) {
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'warning'
                        })
                        loading.close();
                    }
                })
                .catch(failResponse => {
                    this.$message({
                        message: "网络连接错误，请重试！",
                        type: 'warning'
                    })
                    loading.close();
                });
        },
        /**
         * 用户注册事件
         */
        user_register(){
            this.tab=2;
           /* alert(tab);
            this.$router.push("/login");
            location.reload();*/
        },
        /**
         * 用户返回按钮事件
         */
        user_back(){
            this.tab=1;
        },
        /**
         * 注册事件
         * @param formName
         */
        register(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(this.registerForm.password!=this.registerForm.confirmpassword){
                        this.$message({
                            message: "两次输入的密码不一致",
                            type: 'warning'
                        })
                    }else{
                        this.$axios
                            .post("/api/getDetail", {
                                loginName: this.registerForm.loginName
                            })
                            .then(successResponse => {
                                //console.log($.isEmptyObject(successResponse.data.data));
                                if (successResponse.data.status === 200 && (JSON.stringify(successResponse.data.data) == "{}")) {
                                    this.$axios
                                        .post("/api/register", {
                                            loginName: this.registerForm.loginName,
                                            password: this.registerForm.password,
                                            confirmpassword: this.registerForm.confirmpassword,
                                        })
                                        .then(successResponse => {
                                            this.responseResult = JSON.stringify(successResponse.data);
                                            console.log(successResponse.data)
                                            if (successResponse.data.status === 200) {
                                                let successMessage = successResponse.data.description;
                                                this.$message({
                                                    message: successMessage,
                                                    type: 'success'
                                                })
                                                this.tab=1;
                                                this.$router.push("/");
                                            }
                                            if (successResponse.data.status === 400) {
                                                let warnMessage = successResponse.data.description;
                                                this.$message({
                                                    message: warnMessage,
                                                    type: 'warning'
                                                })
                                            }
                                        });
                                }else{
                                    this.$message({
                                        message: "用户名已存在",
                                        type: 'warning'
                                    })
                                }

                            });
                    }
                } else {
                    return false;
                }
            });
        },
        /**
         * 忘记密码按钮
         */
        forgot_pass(){
           this.tab=3;
        },
        /**
         * 下一步按钮事件
         * @param forgotForm
         */
        next(forgotForm){
            this.$refs[forgotForm].validate(valid => {
                if (valid) {
                    this.$axios
                        .post("/api/getDetail", {
                            loginName: this.forgotForm.loginName
                        })
                        .then(successResponse => {
                            if (successResponse.data.status === 200 && (JSON.stringify(successResponse.data.data) != "{}")) {
                                this.tab = 4;
                            } else {
                                this.$message({
                                    message: "此用户名不存在",
                                    type: 'warning'
                                })
                            }

                        })
                        .catch(successResponse => {
                            this.$message({
                                message: "网络连接错误，请重试！",
                                type: 'warning'
                            })
                        });
                }
            });
        },
        /**
         * 重置密码
         * @param formName
         */
        reset(resetForm){
            this.$refs[resetForm].validate(valid => {
                if (valid) {
                    if (this.resetForm.password != this.resetForm.confirmpassword) {
                        this.$message({
                            message: "两次密码输入不一致",
                            type: 'warning'
                        })
                        return;
                    }
                    this.$axios
                        .post("/api/resetPass", {
                            loginName: this.forgotForm.loginName,
                            password: this.resetForm.password
                        })
                        .then(successResponse => {
                            this.responseResult = JSON.stringify(successResponse.data);
                            if (successResponse.data.status === 200) {
                                this.$message({
                                    message: "密码重置成功",
                                    type: 'success'
                                })
                                this.tab = 1;

                            } else {
                                this.$message({
                                    message: "失败",
                                    type: 'warning'
                                })
                            }
                        })
                        .catch(failResponse => {
                        });
                }
            });
        },

        /**
         * 下一步 ，校验验证码
         * @param formName
         */
        next2(formName){
            this.$axios
                .post("/api/checkCode", {
                    verificationCode: this.verificationCode,
                    loginName: this.forgotForm.loginName
                })
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.$message({
                            message: "验证成功",
                            type: 'success'
                        })
                        this.tab=5;
                    }
                    if (successResponse.data.status === 400) {
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'warning'
                        })
                    }
                    if (successResponse.data.status === 500) { //后台异常时
                        let errorMessage = successResponse.data.description;
                        this.$message({
                            message: errorMessage,
                            type: 'warning'
                        })
                    }
                })
                .catch(failResponse => {
                    this.$message({
                        message: "网络连接错误，请重试！",
                        type: 'warning'
                    })
                });
        },
        /**
         * 图片滑动验证成功
         */
        onSuccess(){
            this.msg = '验证成功',
                this.$message({
                    message: this.msg,
                    type: 'success'
                })
            //this.verificationCodeShow=true;
            this.sendMail();
            //this.getCode()
        },
        /**
         * 发送邮件
         */
        sendMail(){
            this.$axios
                .post("/api/forgetSendMail", {
                    loginName: this.forgotForm.loginName,
                    to: this.forgotForm.email
                })
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.$message({
                            message: "邮件发送成功,请及时输入验证码",
                            type: 'success'
                        })
                        this.verificationCodeShow=true;
                        this.getCode();
                    }
                    if (successResponse.data.status === 400) {
                        this.$message({
                            message: "邮件发送失败,请检查邮箱是否正确(目前只支持QQ邮箱)",
                            type: 'warning'
                        })
                    }
                })
                .catch(failResponse => {
                    this.$message({
                        message: "网络连接错误，请重试！",
                        type: 'warning'
                    })
                });
        },
        getCode(){
            const TIME_COUNT = 60;
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.show = false;
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count--;
                    } else {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.$message({
                            message: "验证码已过期，请重新点击上方刷新按钮获取验证码！",
                            type: 'warning'
                        })
                    }
                }, 1000)
            }
        }
    }
};
