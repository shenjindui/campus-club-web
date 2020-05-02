<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 系统登陆日志管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick">
                <el-tab-pane :label="`系统登陆日志列表(${pageParms.total})`" name="first" v-show="true">
                    <el-dialog
                            title="提示"
                            :visible.sync="dialogVisible"
                            width="30%"
                            >
                        <span >{{errorMessage}}</span>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClose()">确 定</el-button>
                     </span>
                    </el-dialog>
                    <template v-if="message === 'first'">
                        <div class="handle-box">
                            <el-input  placeholder="用户编号" class="handle-input mr10" v-model.trim="params.userNum"></el-input>
                            <el-input  placeholder="浏览器名称" class="handle-input mr10" v-model.trim="params.browserName"></el-input>
                            <el-date-picker
                                    v-model="params.paramsTime"
                                    type="datetimerange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                            <el-button type="primary" icon="search" @click="search()">搜索</el-button>
                            <el-button type="primary" icon="reset" @click="reset()">重置</el-button>
                        </div>
                        <div class="handle-box">
                            <el-button type="warning" icon="search" @click="deletes()" plain>删除</el-button>
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="loginLogListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="日志UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="realname" label="登陆真实姓名" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="loginName" label="登陆用户名" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="userNum" label="登陆用户编号" width="110" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="browserName" label="浏览器名称" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="browserVersion"  label="浏览器版本" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="email" label="邮箱" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="loginIp" label="登录IP"  width="120" align="center":show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="mac" label="MAC地址" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="mobile" label="手机号" width="80" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="osName" label="操作系统名称" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间" width="115" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateFormate.dateformatUpdateTime" label="更新时间" align="center" :show-overflow-tooltip="true"></el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :page-sizes="[5, 10, 20, 50]"
                                    :page-size="100"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="pageParms.total">
                            </el-pagination>
                        </div>
                        <!-- //详情的对话框 begin-->
                        <el-dialog title="登陆日志详情" :visible.sync="detailFormVisible" @close="DetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="日志UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="日志UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="登陆真实姓名" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.realname" placeholder="登陆真实姓名" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="登陆用户名" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.loginName" placeholder="登陆用户名" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="登陆用户编号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.userNum" placeholder="登陆用户编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="浏览器名称" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.browserName" placeholder="浏览器名称" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="浏览器版本" :label-width="formLabelWidth">
                                             <el-input v-model="detailForm.browserVersion" placeholder="浏览器版本" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="邮箱" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.email"  :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="登录IP" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.loginIp" :disabled="true" placeholder="登录IP"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="MAC地址" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.mac" placeholder="MAC地址" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="操作系统名称" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.osName" :disabled="true" placeholder="操作系统名称"></el-input>
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
                        <!-- //详情的对话框 end-->
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script src="../../../style/js/sysLoginLog/sysLoginLog.js">
</script>
<style scoped>
    @import '../../../style/csss/common/common.css';/* 引入css文件*/
</style>

