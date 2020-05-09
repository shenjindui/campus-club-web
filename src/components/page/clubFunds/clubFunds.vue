
<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 社团财务管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`社团财务管理(${pageParms.total})`" name="first" v-show="true">
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
                            <el-input  placeholder="财务编号" class="handle-input mr10" v-model.trim="params.fundsCd"></el-input>
                           <!-- <el-input  placeholder="财务所属社团编号" class="handle-input mr10" v-model="params.stCd"></el-input>-->
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
                            <el-button type="primary" icon="search" @click="add()" plain>新增</el-button>
                            <el-button type="primary" icon="search" @click="edit()" plain>修改</el-button>
                            <el-button type="warning" icon="search" @click="deletes()" plain>删除</el-button>
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                            <el-button type="warning" icon="reset" @click="send()" plain>系统缴费测试</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="ListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="财务UUID" width="200" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="fundsCd" label="财务编号" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="stCd" label="财务所属社团编号" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="fundsAssociationCode" label="财务关联编号" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="typeDdct" label="财务操作类型" width="110" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="amountType" :formatter="common.formateAmountType" label="金额操作类型" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="amount"  label="金额" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="fundsPsccd"  label="是否支付" width="100" align="center" :formatter="common.formateFundsPsccd" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateFormate.dateformatUpdateTime" label="更新时间" align="center" :show-overflow-tooltip="true"></el-table-column>
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
                        <el-dialog title="添加财务信息" :visible.sync="dialogFormVisible" @close="AddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="财务操作类型" :label-width="formLabelWidth"  prop="type">
                                           <!-- <el-input v-model.trim="addForm.type" placeholder="财务操作类型" clearable></el-input>-->
                                            <el-select v-model="addForm.type" placeholder="财务操作类型" class="handle-select mr10">
                                                <el-option
                                                        v-for="item in fundstypeList"
                                                        :key="item.dctVal"
                                                        :label="item.dctValNm"
                                                        :value="item.dctVal"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="所属社团编号" :label-width="formLabelWidth" prop="stCd">
                                            <!--<el-input v-model.trim="addForm.stCd" placeholder="所属社团编号" clearable></el-input>-->
                                            <el-select v-model="addForm.stCd" placeholder="请选择社团" required="required">
                                                <el-option
                                                        v-for="item in stList"
                                                        :key="item.stCd"
                                                        :label="item.stName"
                                                        :value="item.stCd"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="金额" :label-width="formLabelWidth" prop="amount">
                                            <el-input v-model="addForm.amount" placeholder="金额" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="金额类型" :label-width="formLabelWidth" prop="amountType">
                                            <!--<el-input v-model="addForm.amountType" placeholder="金额类型" clearable ></el-input>-->
                                            <el-select v-model="addForm.amountType" placeholder="财务操作类型" class="handle-select mr10">
                                                <el-option
                                                        v-for="item in amountTypeList"
                                                        :key="item.dctVal"
                                                        :label="item.dctValNm"
                                                        :value="item.dctVal"/>
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
                        <el-dialog title="财务信息详情" :visible.sync="detailFormVisible" @close="DetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="财务UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="财务UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="财务编号" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.fundsCd" placeholder="财务编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="所属社团编号" :label-width="formLabelWidth">
                                            <el-select v-model="detailForm.stCd" placeholder="所属社团编号" required="required" :disabled="true">
                                                <el-option
                                                        v-for="item in stList"
                                                        :key="item.stCd"
                                                        :label="item.stName"
                                                        :value="item.stCd"/>
                                            </el-select>
                                            <!--<el-input v-model.trim="detailForm.stCd" placeholder="财务所属社团编号" :disabled="true"></el-input>-->
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="财务操作类型" :label-width="formLabelWidth" >
                                            <el-select v-model="detailForm.type" placeholder="财务操作类型" class="handle-select mr10" :disabled="true">
                                                <el-option
                                                        v-for="item in fundstypeList"
                                                        :key="item.dctVal"
                                                        :label="item.dctValNm"
                                                        :value="item.dctVal"/>
                                            </el-select>
                                            <!--<el-input v-model="detailForm.type" placeholder="财务操作类型" :disabled="true"></el-input>-->
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="金额" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.amount" placeholder="金额" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="金额类型" :label-width="formLabelWidth">
                                            <el-select v-model="detailForm.amountType" placeholder="财务操作类型" class="handle-select mr10" :disabled="true">
                                                <el-option
                                                        v-for="item in amountTypeList"
                                                        :key="item.dctVal"
                                                        :label="item.dctValNm"
                                                        :value="item.dctVal"/>
                                            </el-select>
                                            <!-- <el-input v-model="detailForm.amountType" placeholder="金额类型" :disabled="true" ></el-input>-->
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
                        <el-dialog title="修改财务" :visible.sync="updateFormVisible" @close="UpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="财务UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="updateForm.uuid" placeholder="财务UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="财务编号" :label-width="formLabelWidth">
                                            <el-input v-model.trim="updateForm.fundsCd" placeholder="财务编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="所属社团编号" :label-width="formLabelWidth" prop="stCd">
                                            <el-select v-model="updateForm.stCd" placeholder="所属社团编号" required="required" >
                                                <el-option
                                                        v-for="item in stList"
                                                        :key="item.stCd"
                                                        :label="item.stName"
                                                        :value="item.stCd"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="财务操作类型" :label-width="formLabelWidth" prop="amountType">
                                            <el-select v-model="updateForm.type" placeholder="财务操作类型" class="handle-select mr10" >
                                                <el-option
                                                        v-for="item in fundstypeList"
                                                        :key="item.dctVal"
                                                        :label="item.dctValNm"
                                                        :value="item.dctVal"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="金额" :label-width="formLabelWidth" prop="amount">
                                            <el-input v-model="updateForm.amount" placeholder="金额" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="金额类型" :label-width="formLabelWidth"  prop="amountType">
                                            <el-select v-model="updateForm.amountType" placeholder="金额类型" class="handle-select mr10">
                                                <el-option
                                                        v-for="item in amountTypeList"
                                                        :key="item.dctVal"
                                                        :label="item.dctValNm"
                                                        :value="item.dctVal"/>
                                            </el-select>
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

<script src="../../../style/js/clubFunds/clubFunds.js">
</script>
<style scoped>
    @import '../../../style/csss/common/common.css';
</style>

