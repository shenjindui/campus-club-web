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
                schoolName: '',
                collegeName: '',
                stChargeName: '',
                stName: '',
                stCd: '',
                remark:'',
                createTime:'',
                updateTime:'',
                stDesc:''
            },
            params:[],
            roleInfo:[],
        }
    },
    created () {
        let userInfo=store.fetchIDlist("userInfo");
        this.roleInfo=store.fetchIDlist("roleInfo");
        this.init(userInfo.jobNum);
        store.saveIDlist("pageSize",null);
        store.saveIDlist("currentPage",null);
        //
        this.statusCds = store.fetchIDlist("statusCd");
        let token=store.fetchIDlist("token");
        //console.log("用户Token"+JSON.stringify(this.statusCds));
    },
    methods: {
        add(){
            this.$router.push({path:'/clubApproval'});
        },
        dateformat: function (date) {
            var date = new Date(date).toJSON();
            return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
            replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },
        alerts(){
            this.$message({
                message: "你已经提交申请,请不要重复提交",
                type: 'warning'
            })
        },
        join(stCd){
            this.$axios
                .post("/api/joinclub", {
                    stCd: stCd,
                    userCode:store.fetchIDlist("userInfo").userCode
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")  //token换成从缓存获取
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.$message({
                            message: "申请成功",
                            type: 'success'
                        })
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
        search(){
            this.$axios
                .post("/api/clublist", {
                    stCd: this.params.stCd,
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
        info(stCd){
            this.$axios
                .post("/api/clubdetail", {
                    stCd: stCd,
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
        },
        menuDetailCancle(detailForm){
            this.$refs[detailForm].resetFields();
            this.detailFormVisible=false;
        },
        init(){
            this.$axios
                .post("/api/clublist", {
                    userCode:store.fetchIDlist("userInfo").userCode
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
                            type: 'error'
                        })
                        this.dialogVisible=true;
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
