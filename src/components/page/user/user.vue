
<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`用户列表(${pageParms.total})`" name="first" v-show="true">
                    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
                        <span >{{errorMessage}}</span>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClose()">确 定</el-button>
                     </span>
                    </el-dialog><!--//判断token是否过期合法的对话框-->

                    <template v-if="message === 'first'">
                        <div class="handle-box">
                           <!-- {{statusCds}}-->
                            <el-select v-model="params.statusCd" placeholder="用户状态" class="handle-select mr10">
                                <el-option
                                        v-for="item in statusCds"
                                        :key="item.dctVal"
                                        :label="item.dctValNm"
                                        :value="item.dctVal"/>
                            </el-select>
                            <el-input  placeholder="用户工号" class="handle-input mr10" v-model="params.jobNum"></el-input>
                            <el-input  placeholder="用户登陆名" class="handle-input mr10" v-model="params.loginName"></el-input>
                            <el-date-picker
                                    v-model="params.paramsTime"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                            <el-button type="primary" icon="search" @click="search()">搜索</el-button>
                            <el-button type="primary" icon="reset" @click="reset()">重置</el-button>
                        </div>  <!--搜索条件-->

                        <div class="handle-box">  <!--操作按钮组合-->
                            <el-button type="primary" icon="search" @click="add()" plain>新增</el-button>
                            <el-button type="success" icon="reset" @click="edit()" plain>修改</el-button>
                            <el-button type="warning" icon="search" @click="deletes()" plain v-if="isStatus">失效</el-button>
                            <el-button type="warning" icon="search" @click="setStatus()" plain v-else>生效</el-button>
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="userListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="用户UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="userCode" label="用户编号" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="jobNum" label="用户工号" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="loginName" label="用户登录名" width="110" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="realName" label="真实姓名" width="110" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="password" label="用户密码" width="110" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="statusCd" :formatter="formateStatus" label="用户状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="departCode" label="所属部门编号" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="sexCd" :formatter="formateSex" label="用户性别" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="address" label="注册地址"  width="120" align="center":show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="email" label="邮箱"  width="120" align="center":show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="qq" label="QQ号" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="mobile" label="手机号" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="wechat" label="微信号" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="remark" label="备注" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateformat" label="创建时间" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createUser"  label="创建人" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateformat" label="更新时间" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateUser"  label="更新人" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                            </el-table>
                        </div>   <!--列表组件table-->

                        <div class="pagination">
                            <!-- :current-page="currentPage4"-->
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :page-sizes="[5, 10, 20, 50]"
                                    :page-size="100"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="pageParms.total">
                            </el-pagination>
                        </div>  <!--分页器组件-->

                        <el-dialog title="用户详情" :visible.sync="detailFormVisible" @close="userDetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="用户编号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.userCode" placeholder="用户编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="用户UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="用户UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="用户登录名" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.loginName" placeholder="用户登录名" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="用户工号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.jobNum" placeholder="用户工号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="真实姓名" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.realName" placeholder="真实姓名" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="登陆密码" :label-width="formLabelWidth">
                                            <el-input v-model="detailForm.password" placeholder="登陆密码" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="部门编号" :label-width="formLabelWidth" >
                                             <el-input v-model="detailForm.departCode" placeholder="部门编号" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.remark" placeholder="备注" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="QQ号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.qq" placeholder="QQ号" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="微信" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.wechat" placeholder="微信" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="创建时间" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.createTime" placeholder="创建时间" :disabled="true" ></el-input>
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
                                <el-button type="primary" @click="userDetailCancle('detailForm')" plain>返回</el-button>
                            </div>
                        </el-dialog>

                        <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="userAddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="用户名" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="addForm.loginName" placeholder="用户名" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="工(学)号" :label-width="formLabelWidth" prop="jobNum">
                                            <el-input v-model.trim="addForm.jobNum" placeholder="工(学)号" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                                            <el-input v-model="addForm.password" placeholder="密码" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="请确认密码" :label-width="formLabelWidth" prop="confirmpassword">
                                            <el-input v-model="addForm.confirmpassword" placeholder="请确认密码" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="realname">
                                            <el-input v-model="addForm.realname" placeholder="真实姓名" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
                                            <el-input v-model="addForm.mobile" placeholder="手机号" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="QQ" :label-width="formLabelWidth" prop="qq">
                                            <el-input v-model="addForm.qq" placeholder="QQ" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="微信" :label-width="formLabelWidth" prop="wechat">
                                            <el-input v-model="addForm.wechat" placeholder="微信" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="性别" :label-width="formLabelWidth"  prop="sexCd">
                                            <el-select v-model="addForm.sexCd" placeholder="请选择"  :label-width="formLabelWidth">
                                                <el-option v-for="item in sexCds" :key="item.value" :label="item.dctValNm" :value="item.value"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth">
                                            <el-input v-model="addForm.remark" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="userAddCancle('addForm')">取 消</el-button>
                                <el-button type="primary" @click="userAdd('addForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>

                        <el-dialog title="修改用户" :visible.sync="updateFormVisible" @close="userUpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-input v-model.trim="updateForm.uuid" placeholder="uuid" v-show="false"></el-input>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="用户名" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="updateForm.loginName" placeholder="用户名" :disabled="true" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="工(学)号" :label-width="formLabelWidth" prop="jobNum">
                                            <el-input v-model.trim="updateForm.jobNum" placeholder="工(学)号" :disabled="true" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                                            <el-input v-model="updateForm.password" placeholder="密码" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="请确认密码" :label-width="formLabelWidth" prop="confirmpassword">
                                            <el-input v-model="updateForm.confirmpassword" placeholder="请确认密码" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="realname">
                                            <el-input v-model="updateForm.realname" placeholder="真实姓名" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
                                            <el-input v-model="updateForm.mobile" placeholder="手机号" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="QQ" :label-width="formLabelWidth" prop="qq">
                                            <el-input v-model="updateForm.qq" placeholder="QQ" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="微信" :label-width="formLabelWidth" prop="wechat">
                                            <el-input v-model="updateForm.wechat" placeholder="微信" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="性别" :label-width="formLabelWidth"  prop="sexCd">
                                            <el-select v-model="updateForm.sexCd" placeholder="请选择"  :label-width="formLabelWidth">
                                                <el-option v-for="item in sexCds" :key="item.value" :label="item.dctValNm" :value="item.value"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth">
                                            <el-input v-model="updateForm.remark" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="userUpdateCancle('updateForm')">取 消</el-button>
                                <el-button type="primary" @click="userUpdate('updateForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>



</template>

<script src="../../../style/js/user/user.js">
</script>
<style scoped>
    @import '../../../style/csss/user/user.css';/* 引入css文件*/
</style>

