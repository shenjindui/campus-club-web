
<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`角色列表(${pageParms.total})`" name="first" v-show="true">
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
                            <el-select v-model="params.statusCd" placeholder="角色状态" class="handle-select mr10">
                                <el-option
                                        v-for="item in statusCds"
                                        :key="item.dctVal"
                                        :label="item.dctValNm"
                                        :value="item.dctVal"/>
                            </el-select>
                            <el-input  placeholder="角色编号" class="handle-input mr10" v-model="params.roleCode"></el-input>
                            <el-input  placeholder="角色名称" class="handle-input mr10" v-model="params.roleName"></el-input>
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
                            <el-table :data="roleListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="角色UUID" width="180" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="roleCode" label="角色编号" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="roleName" label="角色名称" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="statusCd" :formatter="common.formateStatus" label="角色状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="remark" label="备注" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="createUser"  label="创建人" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateUser"  label="更新人" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateFormate.dateformatUpdateTime" label="更新时间"  align="center" :show-overflow-tooltip="true"></el-table-column>
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

                        <el-dialog title="角色详情" :visible.sync="detailFormVisible" @close="roleDetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="角色编号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.roleCode" placeholder="角色编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="角色UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="角色UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="角色名称" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.roleName" placeholder="角色名称" :disabled="true"></el-input>
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
                                <el-button type="primary" @click="roleDetailCancle('detailForm')" plain>返回</el-button>
                            </div>
                        </el-dialog>

                        <el-dialog title="添加角色" :visible.sync="dialogFormVisible" @close="roleAddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="角色名" :label-width="formLabelWidth"  prop="roleName">
                                            <el-input v-model.trim="addForm.roleName" placeholder="角色名" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth">
                                            <el-input v-model.trim="addForm.remark" placeholder="备注" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="roleAddCancle('addForm')">取 消</el-button>
                                <el-button type="primary" @click="roleAdd('addForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>

                        <el-dialog title="修改角色" :visible.sync="updateFormVisible" @close="roleUpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-input v-model.trim="updateForm.uuid" placeholder="uuid" v-show="false"></el-input>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="角色编号" :label-width="formLabelWidth" >
                                            <el-input v-model="updateForm.roleCode" placeholder="角色编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="角色UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="updateForm.uuid" placeholder="角色UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
                                            <el-input v-model.trim="updateForm.roleName" placeholder="角色名称"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth" >
                                            <el-input v-model="updateForm.remark" placeholder="备注" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="roleUpdateCancle('updateForm')">取 消</el-button>
                                <el-button type="primary" @click="roleUpdate('updateForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>



</template>

<script src="../../../style/js/role/role.js">
</script>
<style scoped>
    @import '../../../style/csss/role/role.css';/* 引入css文件*/
</style>

