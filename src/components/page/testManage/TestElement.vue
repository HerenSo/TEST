<template>
	<div class="p-lr-10">
		<!--<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"> 试题管理</i> </el-breadcrumb-item>
            </el-breadcrumb>
       	</div>-->
        <div>
			<el-row :gutter="20">
				<el-col :span="5"><element-tree></element-tree></el-col>
				<el-col :span="19"><test-list class=""></test-list></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import elementTree from '../elementManage/components/ElementTree.vue';
	import testList from './components/TestList.vue';
	export default{
		name: 'testManage',
		components: {
			elementTree,testList
		}
	}
</script>

<style>
</style>