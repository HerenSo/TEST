<template>
	<div class="p-lr-10">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"> 体系结构审核</i> </el-breadcrumb-item>
            </el-breadcrumb>
       	</div>
        <div>
			<el-row :gutter="20">
				<el-col :span="24"><systemtype-table></systemtype-table></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import systemtypeTable from './components/SystemtypeTable.vue';
	export default{
		name: 'systemType',
		components: {
			systemtypeTable
		}
	}
</script>

<style>
</style>