<template>
	<div class="p-lr-10">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"> 知识元审核</i> </el-breadcrumb-item>
            </el-breadcrumb>
       	</div>
        <div>
			<el-row :gutter="20">
				<el-col :span="5"><element-tree></element-tree></el-col>
				<el-col :span="19"><elementcheck-table></elementcheck-table></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import elementTree from './components/ElementTree.vue';
	import elementcheckTable from './components/ElementcheckTable.vue';
	export default{
		name: 'elementCheck',
		components: {
			elementTree,elementcheckTable
		}
	}
</script>

<style>
</style>