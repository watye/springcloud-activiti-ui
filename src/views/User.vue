<template>
	<div id="User">
	 	<!--搜索框-->
        <el-row>
            <el-col :span="3" class="grid">
                <el-input v-model="input" placeholder="请输入内容" size="mini"></el-input>
            </el-col>
            <el-col :span="1" class="grid">
                <el-button type="success" icon="el-icon-search" size="mini">搜索</el-button>
            </el-col>
        </el-row>
        <br>
        <!--表格数据及操作-->
        <el-table :data="page.data" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
            <!--勾选框-->
            <el-table-column type="selection" width="55">
            </el-table-column>
			<el-table-column prop="id" label="用户编号" width="200"></el-table-column>
            <el-table-column prop="firstName" label="姓名" width="300"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column label="操作" width="200">
				<template slot-scope="scope">
                    <el-button type="success" @click="editUserForm(scope.row)" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" @click="deleteUser(scope.row.id)" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <!--新增按钮-->
        <el-col :span="1" class="grid">
            <el-button type="success" @click="addUserForm()" icon="el-icon-circle-plus-outline" size="mini" round>新增</el-button>
        </el-col>
        <!--全删按钮-->
        <el-col :span="1" class="grid">
            <el-button type="danger" icon="el-icon-delete" size="mini" round>全删</el-button>
        </el-col>
        <br>
        <!--分页条-->
        <el-pagination background layout="prev, pager, next" @current-change="currentPageChanged" :current-page="page.start/pageSize+1" :page-size="pageSize" :total="page.total">
        </el-pagination>
		<div>
			<el-dialog title="新增用户" :visible.sync="dialogVisibleAdd" width="550px">
				<el-form :model="formData">
					<el-form-item label="Id" :label-width="'100px'">
						<el-input v-model="formData.id" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" :label-width="'100px'">
						<el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="姓名" :label-width="'100px'">
						<el-input v-model="formData.firstName" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" :label-width="'100px'">
						<el-input v-model="formData.email" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleAdd = false">取 消</el-button>
					<el-button type="primary" @click="addUserAction()">保 存</el-button>
				</span>
			</el-dialog>
			<el-dialog title="编辑用户" :visible.sync="dialogVisibleEdit" width="550px">
				<el-form :model="formData">
					<el-form-item label="姓名" :label-width="'100px'">
						<el-input v-model="formData.firstName" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" :label-width="'100px'">
						<el-input v-model="formData.email" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleEdit = false">取 消</el-button>
					<el-button type="primary" @click="editUserAction()">保 存</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default {
	name: 'User',
	components: {
	},
	data() {
		return {
			page:{start:0,size:10},
			input: '',
			dialogVisibleAdd:false,
			dialogVisibleEdit:false,
			formData:{},
			pageSize:10
		}
    },
	mounted:function(){
		this.loadData();
	},
	filters:{
		
	},
	methods: {
			getSearchParams(){
				return {start:this.page.start,size:this.pageSize}
			},
			loadData(){
				var _this = this;
				this.http.get("/api/identity/users",{params:this.getSearchParams()}).then(function(response) {
					_this.page = response;
                });
			},
			currentPageChanged(page){
				this.page.start = (page-1)*this.pageSize;
				this.loadData();
			},
			addUserForm(){
				this.dialogVisibleAdd = true;
				this.formData = {};
			},
			editUserForm(item){
				this.dialogVisibleEdit = true;
				this.formData = item;
			},
			//新增用户
			addUserAction(){
				var _this = this;
				this.http.post("/api/identity/users",_this.formData).then(function(response) {
					_this.dialogVisibleAdd = false;
					_this.loadData();
					_this.$message({showClose: true,message: '新增成功',type: 'success'});
                });
			},
			//保存用户
			editUserAction(){
				var _this = this;
				var data = {"firstName":_this.formData.firstName,"email":_this.formData.email};
				this.http.put("/api/identity/users/"+_this.formData.id,_this.formData).then(function(response) {
					_this.dialogVisibleEdit = false;
					_this.loadData();
					_this.$message({showClose: true,message: '保存成功',type: 'success'});
                });
			},
			//删除用户
			deleteUser(userId){
				var _this = this;
				this.$confirm('确认删除该用户?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						_this.http.delete("/api/identity/users/"+userId).then(function(response) {
							_this.loadData();
							_this.$message({type: 'success',message: '删除成功!'});
						});
					}).catch(() => {});
			}
			
        }
}

</script>