<template>
    <div>
        <div class="maintain">
            <div class="leftMain">
                <el-steps :active="active" direction="vertical" finish-status="success">
                    <el-step title="社团基本信息" icon="el-icon-edit"></el-step>
                    <el-step title="上传相关文件" icon="el-icon-upload"></el-step>
                    <el-step title="填写申请理由" icon="el-icon-edit"></el-step>
                </el-steps>
            </div>
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
            <div class="rightForm">
                <div class="baseInfoForm">
                    <el-form ref="baseInfoForm" :model="baseInfoForm" label-width="100px" :disabled="active===0?false:true">
                        <el-row :gutter="20" type="flex">
                            <el-col :span="9">
                                <el-form-item label="社团所属学校">
                                    <el-select v-model="baseInfoForm.schoolNo" placeholder="请选择学校">
                                        <el-option label="测试学校一" value="fjut00001"></el-option>
                                        <el-option label="测试学校二" value="fzu00001"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="社团所属学院">
                                    <el-select v-model="baseInfoForm.collegeNo" placeholder="请选择学院">
                                        <el-option label="国脉信息学院" value="guomai00001"></el-option>
                                        <el-option label="土木工程" value="tumu00002"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="社团所属性质" :label-width="formLabelWidth">
                                    <el-select v-model="baseInfoForm.stNature" placeholder="请选择社团性质">
                                        <el-option label="理论学习类" value="0"></el-option>
                                        <el-option label="兴趣爱好类" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" type="flex">
                            <el-col :span="9">
                                <el-form-item label="社团名称">
                                    <el-input v-model="baseInfoForm.stName" placeholder="社团名称" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="社团描述">
                                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="baseInfoForm.stDesc"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="备注">
                                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="baseInfoForm.remark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" type="flex">
                            <el-col :span="9">
                                <el-form-item label="社团负责人">
                                    <el-input v-model="baseInfoForm.stChargeName" placeholder="社团负责人" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="负责人手机号">
                                    <el-input v-model="baseInfoForm.stChargePhone" placeholder="负责人手机号" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="负责人学号" :label-width="formLabelWidth">
                                    <el-input v-model="baseInfoForm.stChargeSno" placeholder="负责人学号" clearable></el-input>
                                    <input type="hidden" v-model="hideParms.uuid"></input>
                                    <input type="hidden" v-model="hideParms.stCd"></input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>
                    <div slot="footer" class="baseInfoButtonGrops">
                        <el-button type="primary" @click="baseInfoSave('baseInfoForm')" plain>保存</el-button>
                        <el-button type="primary" @click="back()" plain>返回</el-button>
                        <el-button type="primary" @click="next" plain>下一步</el-button>
                    </div>
                </div>
                <div class="fileForm">
                    <div slot="footer" class="fileGroups">
                        <div class="fileUpload"><el-upload
                                class="file"
                                id="file"
                                action="/api/updateFile"
                                :headers="token"
                                :data="{fileurpose: 1,userCode:userCode,stCd:this.hideParms.stCd}"
                                :limit="1"
                                :show-file-list="false"
                                :on-success="fileUploadSuccess"
                                :on-error="fileUploadError"
                                multiple=""
                                list-type="picture"
                          >
                            <el-button  type="primary" plain>点击上传</el-button>
                        </el-upload>
                        </div>
                        <div class="setpStyle">
                            <el-button type="primary" @click="back()" plain class="setpStyle">返回</el-button>
                            <el-button type="primary" @click="step" plain class="setpStyle">上一步</el-button>
                            <el-button type="primary" @click="next" plain>下一步</el-button>
                        </div>

                    </div>
                    <div class="fileListTable">
                        <el-table :data="fileTableData" border class="table">
                            <el-table-column prop="uuid" label="文件UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                            <el-table-column prop="fileId" label="文件编号" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="fileNm" label="文件名称" width="170" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="fileTpCd" label="文件后缀" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="fileSize" label="文件大小" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="fileRte" label="保存路径"  width="200" align="center":show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="createTime" :formatter="dateformat" label="创建时间" width="165" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="updateTime" :formatter="dateformat" label="更新时间" align="165" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="deleteFile(scope.$index,fileTableData)" type="text" size="small">移除</el-button>
                                    <el-button @click.native.prevent="detailFile(scope.$index,fileTableData)" type="text" size="small">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                </div>
                <div class="opnionForm">
                    <el-form ref="opinionForm" :model="opinionForm" label-width="100px" :rules="rules">
                        <el-form-item label="申请理由" :label-width="formLabelWidth"  prop="opinion">
                            <el-input type="textarea" :rows="4" placeholder="请填写申请理由" v-model="opinionForm.opinion" maxlength="300" show-word-limit clearable>
                            </el-input>
                        </el-form-item>
                        <div class="submitStyle">
                            <el-button type="primary" @click="opinionSave('opinionForm')" plain>保存</el-button>
                            <el-button type="primary" @click="startAndSubmit('opinionForm')" plain>启动并提交审核</el-button>
                            <el-button type="primary" @click="back()" plain class="submitStyle">返回</el-button>
                        </div>
                        <el-dialog title="社团审核人列表" :visible.sync="workflowTableVisible">
                            <el-table :data="approverDataList" ref="approverListTable">
                                <el-table-column type="selection" width="28" align="center" ></el-table-column>
                                <el-table-column property="userCode" label="社团审核人用户编号" width="150"></el-table-column>
                                <el-table-column property="userName" label="社团审核人姓名" width="150"></el-table-column>
                                <el-table-column property="workFlowNodeCode" label="所属流程节点编号" width="180"></el-table-column>
                                <el-table-column property="jobNum" label="社团审核人工号" width="200"></el-table-column>
                            </el-table>
                            <div class="pagination">
                                <!-- :current-page="currentPage4"-->
                                <el-pagination
                                        small
                                        layout="prev, pager, next"
                                        :total="50">
                                </el-pagination>
                            </div>
                            <div class="submitStyle">
                                <el-button type="primary" @click="confirmAndSubmit()" plain>提交</el-button>
                                <el-button type="primary" @click="workflowTableVisible=false" plain class="submitStyle">取消</el-button>
                            </div>
                        </el-dialog>
                    </el-form>
                </div>
            </div>
        </div>

    </div>
</template>

<script src="../../../style/js/clubApproval/clubApproval.js">

</script>
<style scoped>
    @import '../../../style/csss/clubApproval/clubApproval.css';
</style>
