<template>
	<div id="FlowDefinition">
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
            <el-table-column prop="name" label="流程定义名称" width="300" sortable></el-table-column>
            <el-table-column prop="key" label="流程定义键" width="220"></el-table-column>
			<el-table-column prop="deploymentId" label="发布状态" width="100" :formatter="formatDeployStatus"></el-table-column>
            <el-table-column prop="lastUpdateTime" label="修改日期"></el-table-column>
			<el-table-column label="发起流程" width="100">
                <template slot-scope="scope">
                    <el-button type="primary" @click="startProcessInstance(scope.row.key)" size="mini">发起流程</el-button>
                </template>
            </el-table-column>
			<el-table-column label="设计" width="100">
                <template slot-scope="scope">
                    <el-button type="primary" @click="designModel(scope.row.id)" size="mini">设计</el-button>
                </template>
            </el-table-column>
			<el-table-column label="发布" width="100">
                <template slot-scope="scope">
                    <el-button type="primary" @click="deployFlowDefinition(scope.row.id)" size="mini">发布</el-button>
                </template>
            </el-table-column>
            <el-table-column label="删除" width="100">
                <template slot-scope="scope">
                    <el-button type="danger" @click="deleteFlowDefinition(scope.row.id)" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <!--新增按钮-->
        <el-col :span="1" class="grid">
            <el-button type="success" @click="addFlowDefinition()" icon="el-icon-circle-plus-outline" size="mini" round>新增</el-button>
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
			<el-dialog title="新增模型" :visible.sync="dialogVisible" width="550px">
				<el-form :model="formData">
					<el-form-item label="模型名称" :label-width="'100px'">
						<el-input v-model="formData.name" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveFlowDefinition()">保 存</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FlowDefinition',
	components: {
	},
	data() {
		return {
			page:{start:0,size:2},
			input: '',
			dialogVisible:false,
			formData:{},
			formType:'addForm',
			pageSize:2
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
				this.http.get("/api/repository/models",{params:this.getSearchParams()}).then(function(response) {
					_this.page = response;
                });
			},
			currentPageChanged(page){
				this.page.start = (page-1)*this.pageSize;
				this.loadData();
			},
			formatDeployStatus: function(item){
				return item.deploymentId?"已发布":"待发布";
			},
			startProcessInstance(processDefinitionKey){
				var _this = this;
				this.http.get("/api/instance/start_process_instance_by_key?processDefinitionKey="+processDefinitionKey+"&businessKey=1").then(function(response) {
					_this.$message({type: 'success',message: '发起成功!'});
				});
			},
			designModel(id){
				window.open("http://localhost:9000/modeler.html?modelId="+id);
			},
			deleteFlowDefinition(id){
				var _this = this;
				this.$confirm('确认删除流程定义?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						_this.http.get("/api/model/delete_model?id="+id).then(function(response) {
							_this.loadData();
							_this.$message({type: 'success',message: '删除成功!'});
						}).catch(function(error) {
							console.log(error);
						});
					}).catch(() => {});
			},
			deployFlowDefinition(id){
				var _this = this;
				this.$confirm('确认发布流程定义?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						_this.http.get("/api/model/deploy_model?id="+id).then(function(response) {
							var data = response.data;
							if(!data.success){
								_this.$message({type: 'warning',message: data.message});
								return;
							}
							_this.loadData();
							_this.$message({type: 'success',message: '发布成功!'});
						}).catch(function(response) {
							_this.$message({type: 'warning',message: response.message});
						});
					}).catch(() => {});
			},
			addFlowDefinition(){
				this.formType = "addForm";
				this.dialogVisible = true;
				this.formData = {};
			},
			editFlowDefinition(row){
				this.formType = "editForm";
				this.dialogVisible = true;
				this.formData = row;
			},
			saveFlowDefinition(){
				var metaInfo = {};
				var url = "/api/model/add_model";
				if(this.formType=="editForm"){
					metaInfo = JSON.parse(this.formData.metaInfo);
					url = "/api/model/edit_model";
				}
				var _this = this;
				this.http.post(url,_this.formData).then(function(response) {
					_this.dialogVisible = false;
					_this.loadData();
					_this.$message({showClose: true,message: '保存成功',type: 'success'});
                }).catch(function(error) {
                    console.log(error);
                });
			}
        }
}

</script>