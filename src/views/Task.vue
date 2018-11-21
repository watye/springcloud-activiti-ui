<template>
	<div id="Task">
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
            <el-table-column prop="name" label="节点名称" width="300"></el-table-column>
			<el-table-column prop="processInstanceId" label="流程实例" width="200"></el-table-column>
            <el-table-column prop="processDefinitionId" label="流程定义" width="200"></el-table-column>
			<el-table-column prop="suspended" label="运行状态" width="100" :formatter="formatSuspendedStatus"></el-table-column>
			<el-table-column prop="assignee" label="办理人" width="120"></el-table-column>
			<el-table-column prop="delegationState" label="代理状态" width="100" :formatter="formatDelegationStatus"></el-table-column>
			<el-table-column prop="createTime" label="创建日期" width="160"></el-table-column>
            <el-table-column prop="dueDate" label="到期日期" width="160"></el-table-column>
			<el-table-column prop="tenantId" label="租户"></el-table-column>
			<el-table-column label="更改办理人" width="100">
                <template slot-scope="scope">
                    <el-button type="primary" @click="updateAssignee(scope.row)" size="mini">更改办理人</el-button>
                </template>
            </el-table-column>
			<el-table-column label="删除" width="100">
                <template slot-scope="scope">
                    <el-button type="danger" @click="deleteTask(scope.row.id)" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <!--全删按钮-->
        <el-col :span="1" class="grid">
            <el-button type="danger" icon="el-icon-delete" size="mini" round>全删</el-button>
        </el-col>
        <br>
        <!--分页条-->
        <el-pagination background layout="prev, pager, next" @current-change="currentPageChanged" :current-page="page.start/pageSize+1" :page-size="pageSize" :total="page.total">
        </el-pagination>
	</div>
</template>

<script>
export default {
	name: 'Task',
	components: {
	},
	data() {
		return {
			page:{start:0,size:10},
			input: '',
			dialogVisible:false,
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
				this.http.get("/api/runtime/tasks",{params:this.getSearchParams()}).then(function(response) {
					_this.page = response;
                });
			},
			currentPageChanged(page){
				this.page.start = (page-1)*this.pageSize;
				this.loadData();
			},
			formatSuspendedStatus: function(item){
				return item.suspended?"暂停":"活动";
			},
			formatDelegationStatus: function(item){
				return item.delegationState;
			},
			updateAssignee(item){
				var _this = this;
				this.http.put("/api/runtime/tasks/"+item.id,{"assignee":"lwy"}).then(function(response) {
					_this.loadData();
					_this.$message({showClose: true,message: '操作成功',type: 'success'});
                });
			},
			//流程实例存在，不允许删除任务
			deleteTask(taskId){
				var _this = this;
				this.$prompt('','提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /[\w{10}]/,
					inputErrorMessage: '请填写原因',
					inputPlaceholder:'请填写原因',
					}).then(({ value }) => {
						_this.http.delete("/api/runtime/tasks/"+taskId+"?deleteReason="+value+"&?cascadeHistory=true").then(function(response) {
							_this.loadData();
							_this.$message({type: 'success',message: '删除成功!'});
						});
					});
			
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