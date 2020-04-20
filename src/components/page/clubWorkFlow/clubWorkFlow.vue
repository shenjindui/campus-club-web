
<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i>系统工作流管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`工作流列表(${pageParms.total})`" name="first" v-show="true">
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
                            <el-select v-model="params.statusCd" placeholder="工作流状态" class="handle-select mr10">
                                <el-option
                                        v-for="item in statusCds"
                                        :key="item.dctVal"
                                        :label="item.dctValNm"
                                        :value="item.dctVal"/>
                            </el-select>
                            <el-input  placeholder="工作流编号" class="handle-input mr10" v-model="params.workFlowCode"></el-input>
                            <el-input  placeholder="工作流名称" class="handle-input mr10" v-model="params.workFlowName"></el-input>
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

                        <div class="handle-box">
                            <el-button type="primary" icon="search" @click="add()" plain>新增</el-button>
                            <el-button type="success" icon="reset" @click="edit()" plain>修改</el-button>
                            <el-button type="warning" icon="search" @click="deletes()" plain >删除</el-button>
                            <el-button type="warning" icon="search" @click="setStatus('0')" plain v-if="isStatus">失效</el-button>
                            <el-button type="warning" icon="search" @click="setStatus('1')" plain v-else>生效</el-button>
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="ListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="工作流UUID" width="180" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="workFlowCode" label="工作流编号" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="workFlowName" label="工作流名称" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="statusCd" :formatter="formateStatus" label="工作流状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="workFlowDesc" label="工作流描述" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="createUser"  label="创建人" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateformat" label="创建时间" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateUser"  label="更新人" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateformat" label="更新时间"  align="center" :show-overflow-tooltip="true"></el-table-column>
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

                        <el-dialog title="工作流详情" :visible.sync="detailFormVisible" @close="DetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="工作流编号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.workFlowCode" placeholder="工作流编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="工作流UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="工作流UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="工作流名称" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.workFlowName" placeholder="工作流名称" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="工作流描述" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.workFlowDesc" placeholder="工作流描述" :disabled="true" ></el-input>
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
                                <el-button type="primary" @click="DetailCancle('detailForm')" plain>返回</el-button>
                            </div>
                        </el-dialog>

                        <el-dialog title="添加工作流" :visible.sync="dialogFormVisible" @close="AddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="工作流名称" :label-width="formLabelWidth"  prop="workFlowName">
                                            <el-input v-model.trim="addForm.workFlowName" placeholder="工作流名称" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="工作流描述" :label-width="formLabelWidth" prop="workflowDesc">
                                            <el-input v-model.trim="addForm.workflowDesc" placeholder="工作流描述" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="AddCancle('addForm')">取 消</el-button>
                                <el-button type="primary" @click="Add('addForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>

                        <el-dialog title="修改工作流" :visible.sync="updateFormVisible" @close="UpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-input v-model.trim="updateForm.uuid" placeholder="uuid" v-show="false"></el-input>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="工作流编号" :label-width="formLabelWidth" >
                                            <el-input v-model="updateForm.workFlowCode" placeholder="工作流编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="工作流UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="updateForm.uuid" placeholder="工作流UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="工作流名称" :label-width="formLabelWidth" prop="workFlowName">
                                            <el-input v-model.trim="updateForm.workFlowName" placeholder="工作流名称"  clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="工作流描述" :label-width="formLabelWidth" prop="workflowDesc">
                                            <el-input v-model="updateForm.workflowDesc" placeholder="工作流描述"  clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="UpdateCancle('updateForm')">取 消</el-button>
                                <el-button type="primary" @click="Update('updateForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>



</template>

<script src="../../../style/js/clubWorkFlow/clubWorkFlow.js">
</script>
<style scoped>
    @import '../../../style/csss/common/common.css';
</style>

