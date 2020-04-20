
<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 社团评分管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick">
                <el-tab-pane :label="`未完成(${pageParms.total})`" name="first" v-show="ratersPsccd=='0'">  <!--//展示未完成的-->
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
                    <template v-show="ratersPsccd=='0'">
                        <div class="handle-box">
                            <el-select v-model="params.stCd" placeholder="所属社团编号" v-show="isShowStList" >
                                <el-option
                                        v-for="item in stList"
                                        :key="item.stCd"
                                        :label="item.stName"
                                        :value="item.stName"/>
                            </el-select>
                            <el-select v-model="params.schoolYear" placeholder="评分学年" >
                                <el-option
                                        v-for="item in schoolYearList"
                                        :key="item.dctKey"
                                        :label="item.dctValNm"
                                        :value="item.dctTpCd"/>
                            </el-select>
                            <el-select v-model="params.semesters" placeholder="评分学期" >
                                <el-option
                                        v-for="item in semestersList"
                                        :key="item.dctKey"
                                        :label="item.dctValNm"
                                        :value="item.dctTpCd"/>
                            </el-select>
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
                            <el-button type="primary" icon="search" @click="search('0')">搜索</el-button>
                            <el-button type="primary" icon="reset" @click="reset('0')">重置</el-button>
                        </div>
                        <div class="handle-box">
                            <el-button type="primary" icon="search" @click="add()" plain>批新增评分信息</el-button>
                            <el-button type="warning" icon="search" @click="edit()" plain>评分</el-button>
                           <!-- <el-button type="warning" icon="search" @click="deletes()" plain>删除</el-button>-->
                            <el-button type="info" icon="reset" @click="detail('0')" plain>查看</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="ListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="评分UUID" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="stCd" label="社团编号" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="schoolYearDdct" label="评分学年" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="semestersDdct" label="评分学期" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersTypeDdct"  label="评审类型" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersAssociationCode" label="被评审对象编号"   width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersAssociationName"  label="被评审对象名称" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersCode"  label="评分人员编号" width="120" align="center"  :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersName"  label="评分人员名称" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="score"  label="得分" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersOpin"  label="评分意见" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateformatCreateTime" label="创建时间" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateformatUpdateTime" label="更新时间" align="center" :show-overflow-tooltip="true"></el-table-column>
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
                        </div>
                        <el-dialog title="添加评分信息" :visible.sync="dialogFormVisible" @close="AddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="所属社团编号" :label-width="formLabelWidth" prop="stCd" v-show="isShowStList">
                                            <el-select v-model="addForm.stCd" placeholder="请选择社团" required="required">
                                                <el-option
                                                        v-for="item in stList"
                                                        :key="item.stCd"
                                                        :label="item.stName"
                                                        :value="item.stCd"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="评分学年" :label-width="formLabelWidth" prop="stCd">
                                            <el-select v-model="addForm.schoolYear" placeholder="评分学年" >
                                                <el-option
                                                        v-for="item in schoolYearList"
                                                        :key="item.dctKey"
                                                        :label="item.dctValNm"
                                                        :value="item.dctTpCd"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="评分学期" :label-width="formLabelWidth" prop="amountType">
                                            <el-select v-model="addForm.semesters" placeholder="评分学期" >
                                                <el-option
                                                        v-for="item in semestersList"
                                                        :key="item.dctKey"
                                                        :label="item.dctValNm"
                                                        :value="item.dctTpCd"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="AddCancle('addForm')">取 消</el-button>
                                <el-button type="primary" @click="Add('addForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="评分信息详情" :visible.sync="detailFormVisible" @close="DetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="评分UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="评分UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="评审对象编号" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.ratersAssociationCode" placeholder="评审对象编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="评审对象名称" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.ratersAssociationName" placeholder="评审对象名称" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="评分人员编号" :label-width="formLabelWidth">
                                            <el-input v-model="detailForm.ratersCode" placeholder="评分人员编号" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                        <el-col :span="11">
                                            <el-form-item label="评分人员名称" :label-width="formLabelWidth">
                                                <el-input v-model.trim="detailForm.ratersName" placeholder="评分人员名称" :disabled="true"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="11">
                                            <el-form-item label="得分" :label-width="formLabelWidth">
                                                <el-input v-model.trim="detailForm.score" placeholder="" :disabled="true"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                <el-row :gutter="16" type="flex">
                                        <el-col :span="22">
                                            <el-form-item label="评分意见" :label-width="formLabelWidth">
                                                <el-input v-model.trim="detailForm.ratersOpin" placeholder="" :disabled="true"></el-input>
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
                        <el-dialog title="进行评分" :visible.sync="updateFormVisible" @close="UpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="评分UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="updateForm.uuid" placeholder="评分UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="评审对象编号" :label-width="formLabelWidth">
                                            <el-input v-model.trim="updateForm.ratersAssociationCode" placeholder="评审对象编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="评审对象名称" :label-width="formLabelWidth" >
                                            <el-input v-model="updateForm.ratersAssociationName" placeholder="评审对象名称" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="得分" :label-width="formLabelWidth">
                                            <el-input v-model="updateForm.score" placeholder="得分" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="22">
                                        <el-form-item label="请输入评分意见" :label-width="formLabelWidth">
                                            <el-input v-model.trim="updateForm.ratersOpin" placeholder="请输入评分意见"></el-input>
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
                <el-tab-pane :label="`已完成(${pageParms.total2})`" name="second" v-show="ratersPsccd=='1'">  <!--//展示完成的-->
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
                    <template v-show="ratersPsccd=='1'">
                        <div class="handle-box">
                            <el-select v-model="params.stCd" placeholder="所属社团编号" v-show="isShowStList" >
                                <el-option
                                        v-for="item in stList"
                                        :key="item.stCd"
                                        :label="item.stName"
                                        :value="item.stName"/>
                            </el-select>
                            <el-select v-model="params.schoolYear" placeholder="评分学年" >
                                <el-option
                                        v-for="item in schoolYearList"
                                        :key="item.dctKey"
                                        :label="item.dctValNm"
                                        :value="item.dctTpCd"/>
                            </el-select>
                            <el-select v-model="params.semesters" placeholder="评分学期" >
                                <el-option
                                        v-for="item in semestersList"
                                        :key="item.dctKey"
                                        :label="item.dctValNm"
                                        :value="item.dctTpCd"/>
                            </el-select>
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
                            <el-button type="primary" icon="search" @click="search('1')">搜索</el-button>
                            <el-button type="primary" icon="reset" @click="reset('1')">重置</el-button>
                        </div>
                        <div class="handle-box">
                            <el-button type="info" icon="reset" @click="detail('1')" plain>查看</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="ListData" border class="table" ref="multipleTables" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="评分UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="stCd" label="所属社团编号" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="schoolYearDdct" label="评分学年" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="semestersDdct" label="评分学期" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersAssociationCode" label="被评审对象编号"   width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersAssociationName"  label="被评审对象名称" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersCode"  label="评分人员编号" width="120" align="center"  :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersName"  label="评分人员名称" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersOpin"  label="评分意见" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="ratersTypeDdct"  label="评审类型" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="score"  label="得分" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateformatCreateTime" label="创建时间" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateformatUpdateTime" label="更新时间" align="center" :show-overflow-tooltip="true"></el-table-column>
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
                        </div>
                        <el-dialog title="评分信息详情" :visible.sync="detailFormVisible1" @close="DetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="评分UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="评分UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="评审对象编号" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.ratersAssociationCode" placeholder="评审对象编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="评审对象名称" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.ratersAssociationName" placeholder="评审对象名称" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="评分人员编号" :label-width="formLabelWidth">
                                            <el-input v-model="detailForm.ratersCode" placeholder="评分人员编号" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="评分人员名称" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.ratersName" placeholder="评分人员名称" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="得分" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.score" placeholder="" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="22">
                                        <el-form-item label="评分意见" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.ratersOpin" placeholder="" :disabled="true"></el-input>
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
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>



</template>

<script src="../../../style/js/clubScore/clubScoreByStsl.js">
</script>
<style scoped>
    @import '../../../style/csss/common/common.css';/* 引入css文件*/
</style>

