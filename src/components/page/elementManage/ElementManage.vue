<template>
	<div class="p-lr-10">
		<!--<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"> 知识元管理</i> </el-breadcrumb-item>
            </el-breadcrumb>
       	</div>-->
        <div>
			<el-row :gutter="20">
				<el-col :span="6"><element-tree></element-tree></el-col>
				<el-col :span="18"><element-table></element-table></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import elementTree from './components/ElementTree.vue';
	import elementTable from './components/ElementTable.vue';
	export default{
		name: 'elementManage',
		components: {
			elementTree,elementTable
		}
	}
</script>

<style>
</style>