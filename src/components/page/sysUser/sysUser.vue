<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 用户基本信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`用户基本信息(${pageParms.total})`" name="first" v-show="true">
                    <!--//判断token是否过期合法的对话框-->
                    <el-dialog
                            title="提示"
                            :visible.sync="dialogVisible"
                            width="30%"
                    >
                        <!-- :before-close="handleClose()">-->
                        <span >{{errorMessage}}</span>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClose()">确 定</el-button>
                     </span>
                    </el-dialog>
                    <template v-if="message === 'first'">
                        <div class="handle-box">
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                            <el-button type="warning" icon="reset" @click="update()" plain>修改</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="ListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="UUID" width="200" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="userCode" label="用户编号" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="jobNum" label="工号" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="email" label="邮箱" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="mobile" label="手机号" width="110" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="qq" label="qq号" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="wechat"  label="微信号" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="sexCd" :formatter="common.formateSex" label="性别" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="realname"  label="真实姓名" width="100" align="center"  :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateFormate.dateformatUpdateTime" label="更新时间" align="center" :show-overflow-tooltip="true"></el-table-column>
                            </el-table>
                        </div>
                        <el-dialog title="用户信息详情" :visible.sync="detailFormVisible" @close="DetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="用户编号" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.userCode" placeholder="用户编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="工号" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.jobNum" placeholder="工号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="邮箱" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.email" placeholder="邮箱" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="手机号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.mobile" placeholder="手机号" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="qq号" :label-width="formLabelWidth">
                                             <el-input v-model="detailForm.qq" placeholder="qq号" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="微信号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.wechat" placeholder="微信号" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="真实姓名" :label-width="formLabelWidth">
                                            <el-input v-model="detailForm.realname" placeholder="真实姓名" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="登陆名" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.loginName" placeholder="登陆名" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="性别" :label-width="formLabelWidth">
                                            <el-select v-model="detailForm.sexCd" placeholder="请选择"  :label-width="formLabelWidth" :disabled="true" >
                                                <el-option v-for="item in sexCds" :key="item.value" :label="item.dctValNm" :value="item.value" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="创建时间" :label-width="formLabelWidth">
                                            <el-input v-model="detailForm.createTime" placeholder="创建时间" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="更新时间" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.updateTime" placeholder="更新时间" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="DetailCancle('detailForm')" plain>返回</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="用户信息修改页面" :visible.sync="updateFormVisible" @close="UpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="16">
                                        <el-form-item label="用户工号" :label-width="formLabelWidth" prop="jobNum">
                                            <el-input v-model="updateForm.jobNum" placeholder="系统唯一性校验" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                                            <el-input v-model.trim="updateForm.email" placeholder="邮箱"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="16">
                                        <el-form-item label="真实姓名" :label-width="formLabelWidth"  prop="realname" >
                                            <el-input v-model.trim="updateForm.realname" placeholder="真实姓名"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-form-item label="手机号" :label-width="formLabelWidth"  prop="mobile">
                                            <el-input v-model.trim="updateForm.mobile" placeholder="手机号"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="16">
                                        <el-form-item label="QQ号" :label-width="formLabelWidth" prop="qq">
                                            <el-input v-model.trim="updateForm.qq" placeholder="QQ号" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-form-item label="微信号" :label-width="formLabelWidth" prop="wechat">
                                            <el-input v-model.trim="updateForm.wechat" placeholder="微信号" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="16">
                                        <el-form-item label="性别" :label-width="formLabelWidth" prop="sexCd">
                                            <el-select v-model="updateForm.sexCd" placeholder="请选择"  :label-width="formLabelWidth">
                                                <el-option v-for="item in sexCds" :key="item.value" :label="item.dctValNm" :value="item.value" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <input v-model.trim="updateForm.uuid" :hidden="true"></input>
                                    <!--<el-col :span="16">
                                        <el-upload
                                                class="upload-demo"
                                                action="/api/updateFile"
                                                :headers="token"
                                                :data="{fileurpose: 4,userCode:updateForm.userCode,stCd:updateForm.userCode}"
                                                :limit="1"
                                                :show-file-list="false"
                                                 >
                                        </el-upload>
                                    </el-col>-->
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="UpdateCancle('updateForm')">取 消</el-button>
                                <el-button type="primary" @click="UpdateConfirm('updateForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script src="../../../style/js/sysUser/sysUser.js">
</script>
<style scoped>
    @import '../../../style/csss/common/common.css';
</style>

