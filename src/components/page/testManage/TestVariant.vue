<template>
	<div class="p-lr-10">
		<!--<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"> 变式题管理</i> </el-breadcrumb-item>
            </el-breadcrumb>
       	</div>-->
        <div>
			<el-row :gutter="20">
				<el-col :span="24"><test-list class=""></test-list></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import testList from './components/VariantList.vue';
	export default{
		name: 'testManage',
		components: {
			testList
		}
	}
</script>

<style>
</style>