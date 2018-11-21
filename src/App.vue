<template>
	<div id="app">
		<el-container>
			<el-header style="padding:0">
				<!--导航条-->
				<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
						background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
					<el-menu-item index="1"><router-link to="/process_definition" tag="li">流程定义</router-link></el-menu-item>
					<el-menu-item index="2"><router-link to="/process_instance" tag="li">流程实例</router-link></el-menu-item>
          <el-menu-item index="3"><router-link to="/task" tag="li">任务</router-link></el-menu-item>
          <el-menu-item index="4"><router-link to="/user" tag="li">用户</router-link></el-menu-item>
          <el-menu-item index="5"><router-link to="/group" tag="li">用户组</router-link></el-menu-item>
					<el-submenu index="6">
						<template slot="title">我的工作台</template>
						<el-menu-item index="4-1">选项1</el-menu-item>
						<el-menu-item index="4-2">选项2</el-menu-item>
						<el-menu-item index="4-3"><router-link to="/" tag="li">home</router-link></el-menu-item>
					</el-submenu>
				</el-menu>
			</el-header>
			<el-container>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
export default {
  data() {
      return {
          //查询输入框数据
          input: '',
          //导航条默认选项
          activeIndex: '1'
      }
  },
  methods: {
     handleSelect(key, keyPath) {
        console.log(key, keyPath);
    },
    startHacking () {
      this.$notify({
        title: 'It works!',
        type: 'success',
        message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
        duration: 5000
      })
    },
    ajaxData () {
      var url = '/api/try/ajax/demo_get.php'; // 这里就是刚才的config/index.js中的/api
            this.http.get(url)
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
body,header{
	padding:0;
	margin:0;
}
</style>
