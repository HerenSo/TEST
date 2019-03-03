<template>
	<div class="p-lr-10">
		<!--<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"> 体系结构审核</i> </el-breadcrumb-item>
            </el-breadcrumb>
       	</div>-->
        <div>
			<el-row :gutter="20">
				<el-col :span="5"><system-tree class=""></system-tree></el-col>
				<el-col :span="19"><test-list></test-list></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import systemTree from '../systemManage/components/SystemTree.vue';
	import systemtypeTable from './components/TestList.vue';
	export default{
		name: 'testSystem',
		components: {
			systemTree,systemtypeTable
		}
	}
</script>

<style>
</style>