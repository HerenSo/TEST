<template>
	<div class="p-lr-10">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"> 知识元审核</i> </el-breadcrumb-item>
            </el-breadcrumb>
       	</div>
        <div>
			<el-row :gutter="20">
				<el-col :span="24"><elementcheck-table></elementcheck-table></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import elementcheckTable from './components/ElementcheckTable.vue';
	export default{
		name: 'elementCheck',
		components: {
			elementcheckTable
		}
	}
</script>

<style>
</style>