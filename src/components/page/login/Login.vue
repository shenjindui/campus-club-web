<template>
  <div class="login-container">
    <div class="login-header">
    </div>
    <div class="login-wrap">
      <div class="ms-login">
        <div v-show="tab==1">
          <div class="ms-title">校园社团管理登陆系统</div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
            <el-form-item prop="loginName">
              <el-input v-model="ruleForm.loginName" placeholder="用户名">
                <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="login">
                <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </div>
            <div class="login-btn-next">
              <p class="login-text-reg"><a href="javascript:void(0)" @click="user_register">注册</a></p>
              <p class="login-text-fgt"><a href="javascript:void(0)" @click="forgot_pass">忘记密码?</a></p>
              <p class="login-tips">Tips : 用户名或密码输错超过5次账号将被锁定。</p>
            </div>
          </el-form>
        </div> <!--登陆页面-->
        <div v-show="tab==2">
          <div class="ms-title">校园社团管理系统注册页面</div>
          <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="0px" class="ms-content">
            <el-form-item prop="loginName">
              <el-input v-model="registerForm.loginName" placeholder="用户名">
                <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
              </el-input>
            </el-form-item>
              <el-form-item prop="email">
                  <el-input v-model="registerForm.email" placeholder="邮箱">
                      <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                  </el-input>
              </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" placeholder="密码" v-model="registerForm.password">
                <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmpassword">
              <el-input type="password" placeholder="确认密码" v-model="registerForm.confirmpassword">
                <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="register('registerForm')">注册</el-button>
            </div>
            <div class="login-btn-next">
              <p class="login-text-fgt"><a href="javascript:void(0)" @click="user_back">已有账号返回登陆</a></p>
              <p class="login-tips">Tips : 请输入两次密码注册成功请及时完善信息</p>
            </div>
          </el-form>
        </div> <!--注册页面-->
          <div v-show="tab==3">
              <div class="ms-title">校园社团管理系统找回密码页面</div>
              <el-form :model="forgotForm" :rules="rules" ref="forgotForm" label-width="0px" class="ms-content">
                  <el-form-item prop="loginName">
                      <el-input v-model="forgotForm.loginName" placeholder="用户名">
                          <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                      </el-input>
                  </el-form-item>
                  <el-form-item prop="email">
                      <el-input type="email" placeholder="邮箱" v-model="forgotForm.email">
                          <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                      </el-input>
                  </el-form-item>
                  <div class="login-btn">
                      <el-button type="primary" @click="next('forgotForm')">下一步</el-button>
                  </div>
                  <div class="login-btn-next">
                      <p class="login-text-fgt"><a href="javascript:void(0)" @click="user_back">已有账号返回登陆</a></p>
                  </div>
              </el-form>
          </div> <!--忘记密码页面-->
          <div v-show="tab==4">
              <div>
                  <slide-verify :l="42" :r="10" :w="380" :h="155" @success="onSuccess" @fail="onFail"
                                  @refresh="onRefresh"
                                  :slider-text="text">
                  </slide-verify>
                 <!-- <div>
                      {{msg}}
                  </div>-->
                  <div>
                      <el-input type="email" placeholder="请输入邮箱验证码" v-model="verificationCode" v-if="verificationCodeShow">
                          <template slot="append">{{count}}</template>
                      </el-input>
                     <!-- <span v-if="verificationCodeShow" class="count"> </span>-->
                  </div>
                  <div class="login-btn">
                      <el-button type="primary" @click="next2(verificationCode)">下一步</el-button>
                  </div>
              </div>

          </div>  <!--验证码或快-->
          <div v-show="tab==5">
              <div class="ms-title">校园社团管理系统重置密码页面</div>
                  <el-form :model="resetForm" :rules="rules" ref="resetForm" label-width="0px" class="ms-content">
                      <el-form-item prop="password">
                      <el-input type="password" placeholder="密码" v-model="resetForm.password">
                          <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                      </el-input>
                  </el-form-item>
                  <el-form-item prop="confirmpassword">
                      <el-input type="password" placeholder="确认密码" v-model="resetForm.confirmpassword">
                          <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                      </el-input>
                  </el-form-item>
                  <div class="login-btn">
                      <el-button type="primary" @click="reset('resetForm')">提交重置</el-button>
                  </div>
                  <div class="login-btn-next">
                      <p class="login-text-fgt"><a href="javascript:void(0)" @click="user_back()">已有账号返回登陆</a></p>
                  </div>
              </el-form>
          </div> <!--忘记密码页面-->

      </div>
    </div>
    <div class="login-footer">
      <div class="login-footer-left">
         <p> 账号规则：登陆可以使用用户名登陆，完善信息后学生登录账号</p>
         <p> 可为学号，其他人员登录账号可为工号</p>
         <p> 咨询电话：0591-22863333</p>
      </div>
      <div class="login-footer-right">
        <p> 忘记密码：用户忘记密码并且无法找回的，可携带本人有效身份证件到</p>
        <p> 福建工程学院互联网经贸学院，由管理员登记后予以修改</p>
          <p> 系统作者：软件1602_沈金堆（3168907225）</p>
      </div>
    </div>
  </div>

</template>

<script src="../../../style/js/login/login.js">
  /* 引入js文件*/
</script>

<style scoped>
  @import '../../../style/csss/login/login.css';/* 引入css文件*/
</style>
