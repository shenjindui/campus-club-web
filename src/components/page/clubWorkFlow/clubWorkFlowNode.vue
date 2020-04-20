<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i>系统工作流节点管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`工作流节点列表(${pageParms.total})`" name="first" v-show="true">
                    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
                        <span >{{errorMessage}}</span>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClose()">确 定</el-button>
                     </span>
                    </el-dialog>
                    <template v-if="message === 'first'">
                        <div class="handle-box">
                           <!-- {{statusCds}}-->
                            <el-select v-model="params.statusCd" placeholder="节点状态" class="handle-select mr10">
                                <el-option
                                        v-for="item in statusCds"
                                        :key="item.dctVal"
                                        :label="item.dctValNm"
                                        :value="item.dctVal"/>
                            </el-select>
                            <el-input  placeholder="节点编号" class="handle-input mr10" v-model="params.workFlowNodeCode"></el-input>
                            <el-input  placeholder="节点名称" class="handle-input mr10" v-model="params.workFlowNodeName"></el-input>
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
                                <el-table-column prop="uuid" label="节点UUID" width="180" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="workFlowNodeCode" label="节点编号" width="160" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="workFlowNodeName" label="节点名称" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="workFlowCode" label="节点所属工作流编号" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="workFlowName" label="节点所属工作流名称" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="statusCd" :formatter="formateStatus" label="节点状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="workFlowNodeTypeName"  label="节点层级" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="workFlowNodeDesc" label="节点描述" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="createUser"  label="创建人" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateformatCreateTime" label="创建时间" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateUser"  label="更新人" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateformatUpdateTime" label="更新时间"  align="center" :show-overflow-tooltip="true"></el-table-column>
                            </el-table>
                        </div>

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

                        <el-dialog title="节点详情" :visible.sync="detailFormVisible" @close="DetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="节点编号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.workFlowNodeCode" placeholder="节点编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="节点UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="节点UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="所属工作流编号" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.workFlowCode" placeholder="所属工作流编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="所属工作流名称" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.workFlowName" placeholder="所属工作流名称" :disabled="true" ></el-input>
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

                        <el-dialog title="添加工作流节点" :visible.sync="dialogFormVisible" @close="AddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <!--{{workFlowList}}-->
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="节点所属工作流" :label-width="formLabelWidth"  prop="workFlowCode">
                                            <!--<el-input v-model.trim="addForm.workFlowName" placeholder="工作流名称" clearable></el-input>-->
                                            <el-select v-model="addForm.workFlowCode" placeholder="节点所属工作流" class="handle-select mr10">
                                                <el-option
                                                        v-for="item in workFlowList"
                                                        :key="item.workFlowCode"
                                                        :label="item.workFlowName"
                                                        :value="item.workFlowCode">
                                                </el-option>
                                                <!--{{pageWorkFlowListParms.total}}
                                                <el-pagination
                                                        background
                                                        layout="prev, pager, next"
                                                        :total="pageWorkFlowListParms.total">
                                                </el-pagination>-->
                                                <el-pagination
                                                        @current-change="handleCurrentChanges"
                                                        background
                                                        :page-size="5"
                                                        layout="prev, pager, next"
                                                        :total="pageWorkFlowListParms.total">
                                                </el-pagination>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="节点所属层级" :label-width="formLabelWidth"  prop="workFlowNodeType">
                                            <el-select v-model="addForm.workFlowNodeType" placeholder="节点所属层级" class="handle-select mr10">
                                                <el-option
                                                        v-for="item in workFlowNodeTypeList"
                                                        :key="item.dctKey"
                                                        :label="item.dctValNm"
                                                        :value="item.dctTpCd">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="节点名称" :label-width="formLabelWidth" prop="workFlowNodeName">
                                            <el-input v-model.trim="addForm.workFlowNodeName" placeholder="节点名称" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="节点描述" :label-width="formLabelWidth" prop="workFlowNodeDesc">
                                            <el-input v-model.trim="addForm.workFlowNodeDesc" placeholder="节点描述" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="AddCancle('addForm')">取 消</el-button>
                                <el-button type="primary" @click="Add('addForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>

                        <el-dialog title="修改工作流节点" :visible.sync="updateFormVisible" @close="UpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-input v-model.trim="updateForm.uuid" placeholder="uuid" v-show="false"></el-input>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="节点编号" :label-width="formLabelWidth" >
                                            <el-input v-model="updateForm.workFlowNodeCode" placeholder="节点编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="节点UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="updateForm.uuid" placeholder="节点UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="16">
                                        <el-form-item label="所属工作流" :label-width="formLabelWidth" prop="workFlowName">
                                            <el-select v-model="updateForm.workFlowCode" placeholder="所属工作流" class="handle-select mr10">
                                                <el-option
                                                        v-for="item in workFlowList"
                                                        :key="item.workFlowCode"
                                                        :label="item.workFlowName"
                                                        :value="item.workFlowCode">
                                                </el-option>
                                                <el-pagination
                                                        @current-change="handleCurrentChanges"
                                                        background
                                                        :page-size="5"
                                                        layout="prev, pager, next"
                                                        :total="pageWorkFlowListParms.total">
                                                </el-pagination>
                                            </el-select>
                                          <!--  <el-input v-model.trim="updateForm.workFlowName" placeholder="所属工作流"  clearable></el-input>-->
                                        </el-form-item>
                                    </el-col>
                                    <el-col>
                                        <el-form-item label="节点所属层级" :label-width="formLabelWidth"  prop="workFlowNodeType">
                                            <el-select v-model="updateForm.workFlowNodeType" placeholder="节点所属层级" class="handle-select mr10">
                                                <el-option
                                                        v-for="item in workFlowNodeTypeList"
                                                        :key="item.dctKey"
                                                        :label="item.dctValNm"
                                                        :value="item.dctTpCd">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                   <!-- <el-col :span="11">
                                        <el-form-item label="工作流描述" :label-width="formLabelWidth" prop="workflowDesc">
                                            <el-input v-model="updateForm.workflowDesc" placeholder="工作流描述"  clearable></el-input>
                                        </el-form-item>
                                    </el-col>-->
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

<script src="../../../style/js/clubWorkFlow/clubWorkFlowNode.js">
</script>
<style scoped>
    @import '../../../style/csss/common/common.css';
</style>

