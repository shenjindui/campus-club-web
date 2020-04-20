
<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i>数据字典管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`数据字列表(${pageParms.total})`" name="first" v-show="true">
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
                            <el-select v-model="params.statusCd" placeholder="数据字典状态" class="handle-select mr10">
                                <el-option
                                        v-for="item in statusCds"
                                        :key="item.dctVal"
                                        :label="item.dctValNm"
                                        :value="item.dctVal"/>
                            </el-select>
                            <el-input  placeholder="字典键" class="handle-input mr10" v-model="params.dctKey"></el-input>
                            <el-input  placeholder="字典值" class="handle-input mr10" v-model="params.dctVal"></el-input>
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
                            <el-table :data="ddctListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="字典UUID" width="180" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="dctKey" label="字典键" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="dctVal" label="字典值" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="dctValNm" label="字典值名称" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="dctTpCd" label="字典类型" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="dctTpNm" label="字典类型名称" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="statusCd" :formatter="formateStatus" label="字典状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="dctDsc" label="字典描述" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="dctSeq" label="字典排序码" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="remark" label="备注" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
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
                        <el-dialog title="数据字典详情" :visible.sync="detailFormVisible" @close="ddctDetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="字典键" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.dctKey" placeholder="字典键" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="字典UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="字典UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="字典值名称" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.dctValNm" placeholder="字典值名称" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="字典类型" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.dctTpCd" placeholder="字典类型" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="字典值" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.dctVal" placeholder="字典值" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.remark" placeholder="" :disabled="true" ></el-input>
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
                                <el-button type="primary" @click="ddctDetailCancle('detailForm')" plain>返回</el-button>
                            </div>
                        </el-dialog>

                        <el-dialog title="添加数据字典" :visible.sync="dialogFormVisible" @close="ddctAddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="字典键" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="addForm.dctKey" placeholder="字典键" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="字典值" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="addForm.dctVal" placeholder="字典值" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="字典值名称" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="addForm.dctValNm" placeholder="字典值名称" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="字典类型" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="addForm.dctTpCd" placeholder="字典类型" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="字典类型名称" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="addForm.dctTpNm" placeholder="字典类型名称" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth" prop="jobNum">
                                            <el-input v-model.trim="addForm.remark" placeholder="备注" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="ddctAddCancle('addForm')">取 消</el-button>
                                <el-button type="primary" @click="ddctAdd('addForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>

                        <el-dialog title="修改数据字典" :visible.sync="updateFormVisible" @close="ddctUpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-input v-model.trim="updateForm.uuid" placeholder="uuid" v-show="false"></el-input>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="字典键" :label-width="formLabelWidth"  prop="loginName" >
                                            <el-input v-model.trim="updateForm.dctKey" placeholder="字典键" clearable :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="字典值" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="updateForm.dctVal" placeholder="字典值" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="字典值名称" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="updateForm.dctValNm" placeholder="字典值名称" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="字典类型" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="updateForm.dctTpCd" placeholder="字典类型" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="字典类型名称" :label-width="formLabelWidth"  prop="loginName">
                                            <el-input v-model.trim="updateForm.dctTpNm" placeholder="字典类型名称" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth" prop="jobNum">
                                            <el-input v-model.trim="updateForm.remark" placeholder="备注" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="ddctUpdateCancle('updateForm')">取 消</el-button>
                                <el-button type="primary" @click="ddctUpdate('updateForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                        <!--

                       -->
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>



</template>

<script src="../../../style/js/ddct/ddct.js">
</script>
<style scoped>
    @import '../../../style/csss/ddct/ddct.css';/* 引入css文件*/
</style>

