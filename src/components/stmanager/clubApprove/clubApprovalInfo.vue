<template >
    <div>
        <div class="maintain">
            <div class="leftMain">
                <el-steps :active="active" direction="vertical" finish-status="success">
                    <el-step title="申请人基本信息" icon="el-icon-edit"></el-step>
                    <el-step title="填写审核意见" icon="el-icon-edit"></el-step>
                </el-steps>
            </div>
            <div class="rightForm">
               <!-- {{baseInfoForm}}-->
                <div class="baseInfoForm">
                    <el-form ref="baseInfoForm" :model="baseInfoForm" label-width="100px" >
                        <el-row :gutter="20" type="flex">
                            <el-col :span="18">
                                <el-form-item label="头像">
                                    <img :src="baseInfoForm.headPortrait[0].fileRte" class="user-avator" alt="" style="margin-left: 250px"
                                         v-if="baseInfoForm.headPortrait!=null&&baseInfoForm.headPortrait.length>0">
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" type="flex">
                            <el-col :span="9">
                                <el-form-item label="申请人uuid">
                                    <el-input v-model="baseInfoForm.uuid" placeholder="申请人uuid"  readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="申请人工号">
                                    <el-input v-model="baseInfoForm.jobNum" placeholder="申请人工号" readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" type="flex">
                            <el-col :span="9">
                                <el-form-item label="申请人姓名">
                                    <el-input v-model="baseInfoForm.realname" placeholder="申请人姓名" readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="申请人性别">
                                    <el-input v-model="baseInfoForm.sexName" placeholder="申请人性别" readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" type="flex">
                            <el-col :span="9">
                                <el-form-item label="用户编号">
                                    <el-input v-model="baseInfoForm.userCode" placeholder="申请人QQ" readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="申请人微信号">
                                    <el-input v-model="baseInfoForm.wechat" placeholder="申请人微信号" readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" type="flex">
                            <el-col :span="9">
                                <el-form-item label="申请人手机号">
                                    <el-input v-model="baseInfoForm.mobile" placeholder="申请人手机号" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="申请理由">
                                    <el-input type="textarea" :rows="2" placeholder="申请理由" v-model="baseInfoForm.stDesc"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="baseInfoButtonGrops">
                        <el-button type="primary" @click="back()" plain>返回</el-button>
                        <el-button type="primary" @click="next" plain>下一步</el-button>
                    </div>
                </div>
                    <div class="opnionForms">
                        <el-form ref="opinionForm" :model="opinionForm" label-width="100px" :rules="rules" >
                            <el-form-item label="审核意见：" :label-width="formLabelWidth"  prop="approverOpinion">
                                <el-input type="textarea" :rows="4" placeholder="请填写审核意见" v-model="opinionForm.approverOpinion"
                                          maxlength="300" show-word-limit clearable v-if="isShow"></el-input>
                                <el-input type="textarea" :rows="4" placeholder="审核意见" v-model="baseInfoForm.suggestion"
                                          maxlength="300" show-word-limit clearable v-else disabled="true"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="submitStyle">
                            <el-button type="primary" @click="approverOpinionSave('opinionForm')" plain class="submitStyle" v-if="isShow">意见保存</el-button>
                            <el-button type="primary" @click="refuse('opinionForm')" plain class="submitStyle" v-if="isShow">拒绝</el-button>
                            <el-button type="primary" @click="approver('opinionForm')" plain class="submitStyle" v-if="isShow">同意</el-button>
                            <el-button type="primary" @click="back()" plain class="submitStyle">返回</el-button>
                        </div>
                    </div>

            </div>
        </div>

    </div>
</template>

<script src="../../../style/js/stmanager/clubApprovalInfo.js">

</script>
<style scoped>
    @import '../../../style/csss/clubApproval/clubApproval.css';/* 引入css文件*/
</style>
