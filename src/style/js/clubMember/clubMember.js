//引入存储数据的js
import store from "../../../store/store";
//引入表单验证
//import { validateLen, validateChart_ } from '../../../utils/validate/validate'
export default {

    name: 'tabs',
    data() {
        return {
            currentDate: new Date(),
            stMembers:[],
            detailFormVisible:false,
            detailForm:{
                memberCd: '',
                memberName: '',
                memberSno: '',
                major: '',
                stCd: '',
                remark:'',
                createTime:'',
                updateTime:''
            },
            params:[],
        }
    },
    created () {
        let userInfo=store.fetchIDlist("userInfo");
        this.init(userInfo.jobNum);
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        //
        this.statusCds = store.fetchIDlist("statusCd");
        let token=store.fetchIDlist("token");
        //console.log("用户Token"+JSON.stringify(this.statusCds));
    },
    methods: {
        dateformat: function (date) {
            var date = new Date(date).toJSON();
            return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
            replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },

        search(){
            this.$axios
                .post("/api/clubMemberList", {
                    memberSno: this.params.memberSno,
                    stChargeSno:store.fetchIDlist("userInfo").jobNum
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.stMembers=successResponse.data.data.grid.list;
                    }
                    if (successResponse.data.status === 400) {
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'warning'
                        })
                    }
                    if (successResponse.data.status === 500) { //后台异常时
                        this.errorMessage =successResponse.data.description;
                        let errorMessage = successResponse.data.description;
                        this.$message({
                            message: errorMessage,
                            type: 'warning'
                        })
                        this.dialogVisible=true;
                    }
                })
                .catch(failResponse => {});
        }, //搜索按钮事件
        info(memberCd){
            this.$axios
                .post("/api/clubMemberdetail", {
                    memberCd: memberCd,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.detailForm=successResponse.data.data;
                        this.detailForm.createTime=this.dateformat( this.detailForm.createTime);
                        this.detailForm.updateTime=this.dateformat( this.detailForm.updateTime);
                        this.detailFormVisible=true;

                    }
                    if (successResponse.data.status === 400) {
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'warning'
                        })
                    }
                    if (successResponse.data.status === 500) { //后台异常时

                    }
                })
                .catch(failResponse => {});
        },
        menuDetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
        },
        init(jobNum){
            this.$axios
                .post("/api/clubMemberList", {
                    stChargeSno: jobNum,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.stMembers=successResponse.data.data.grid.list;
                    }
                    if (successResponse.data.status === 400) {
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'warning'
                        })
                    }
                    if (successResponse.data.status === 500) { //后台异常时

                    }
                })
                .catch(failResponse => {});
        },
        handleClose() {
            this.dialogVisible=false;
            store.saveIDlist("token",null);
            this.$router.push("/");
        },
        reset(){
            let userInfo=store.fetchIDlist("userInfo");
            this.init(userInfo.jobNum);
            this.params={}
        },//重置事件，将参数置空
        edit(){
            const selectData=this.$refs.multipleTable.selection;
            console.log(selectData[0])
            if(selectData.length>1){
                this.$message({
                    message: "请最多选择一条",
                    type: 'warning'
                })
            }else if(selectData.length<1) {
                this.$message({
                    message: "请选择一条记录",
                    type: 'warning'
                })
            }else{
                this.$axios
                    .post("/api/roledetail", {
                        uuid: selectData[0].uuid,
                    },{headers: {
                            'content-type': 'application/json',
                            "token":store.fetchIDlist("token")  //token换成从缓存获取
                        }})
                    .then(successResponse => {
                        if (successResponse.data.status === 200) {
                            this.updateForm=successResponse.data.data;
                            this.updateFormVisible=true;
                            //this.initParentList();
                        }
                        if (successResponse.data.status === 400) {
                            let warnMessage = successResponse.data.description;
                            this.$message({
                                message: warnMessage,
                                type: 'warning'
                            })
                        }
                        if (successResponse.data.status === 500) { //后台异常时

                        }
                    })
                    .catch(failResponse => {});
            }
        },
        handleSelectionChange(){
            this.isStatus=true;
            const selectData=this.$refs.multipleTable.selection;
            if(selectData[0].statusCd==0){
                this.isStatus=false;
            }
        },
        //分页事件 页面尺寸事件
        handleSizeChange(val){
            store.saveIDlist("pageSize",val);
            this.search();
        },
        // /页面当前页
        handleCurrentChange(val){
            // alert(val);
            //this.currentPage=val;
            store.saveIDlist("currentPage",val);
            this.search();
        },
    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
    }
}
