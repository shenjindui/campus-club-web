import store from "../../../store/store";

export default {
    data: function() {
        return {
            msg: '',
            fullscreenLoading: false,
            text: '向右滑->',
            imgs: {
                type: Array,
                default: () => []
            },
            ruleForm: {
                loginName: "",
                password: ""
            },
            registerForm: {
                loginName: "",
                password: "",
                confirmpassword:"",
                email:""
            },
            resetForm: {
                password: "",
                confirmpassword:"",
            },

            forgotForm: {
                loginName: "",
                email:""
            },
            rules: {
                loginName: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
                confirmpassword: [{ required: true, message: "请确认密码", trigger: "blur" }],
                email :[{ required: true, message: "请输入邮箱", trigger: "blur" }]
            },
            tab:1
        };
    },
    created () {
        this.checkTokenIsExit();
    },
    //监听路由跳转
    watch: {
        '$route'(to, from) {
            this.$router.go(0);
        }
    },
    methods: {
        checkTokenIsExit(){  //token校验
            var token=store.fetchIDlist("token");
            if(token!=null&&token!=''){
                this.$router.push("/dashboard");
            }

        },

        onSuccess(){
            this.msg = '验证成功',
                this.tab=5;
        },
        onFail(){
            this.msg = ''
        },
        onRefresh(){
            this.msg = ''
        },
        handleChange(value) {
            console.log(value);
        },
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
        user_register(){
            this.tab=2;
           /* alert(tab);
            this.$router.push("/login");
            location.reload();*/
        },
        user_back(){
            this.tab=1;
        },
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
                    console.log("error submit!!");
                    return false;
                }
            });
        },  /*注册功能*/
        forgot_pass(){
           this.tab=3;
        },
        next(){
            this.$axios
                .post("/api/getDetail", {
                    loginName: this.forgotForm.loginName
                })
                .then(successResponse => {
                    console.log(successResponse.data);
                    if (successResponse.data.status === 200 && (JSON.stringify(successResponse.data.data) != "{}")) {
                        this.tab=4;
                    }else{
                        this.$message({
                            message: "用户名不存在",
                            type: 'warning'
                        })
                    }

                });
        },
        reset(formName){ //重置密码
            this.$axios
                .post("/api/resetPass", {
                    loginName: this.forgotForm.loginName,
                    password: this.resetForm.password
                })
                .then(successResponse => {
                    this.responseResult = JSON.stringify(successResponse.data);
                    console.log(successResponse.data)
                    if (successResponse.data.status === 200) {
                        this.$message({
                            message: "重置成功",
                            type: 'success'
                        })
                        this.tab=1;

                    }else{
                        this.$message({
                            message: "失败",
                            type: 'warning'
                        })
                    }
                })
                .catch(failResponse => {});
        }

    }
};
