<template>
	<div class="p-lr-10">
		<!--<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"> 知识元管理</i> </el-breadcrumb-item>
            </el-breadcrumb>
       	</div>-->
        <div>
			<el-row :gutter="20">
				<el-col :span="5"><element-tree></element-tree></el-col>
				<el-col :span="19"><element-table></element-table></el-col>
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
		},
		data() {
	      	return {
		        data: [{
		          label: '一级 1',
		          children: [{
		            label: '二级 1-1',
		            children: [{
		              label: '三级 1-1-1'
		            }]
		          }]
		        }],
		        haveCourse: 1,
		        defaultProps: {
		          label: 'label',
		          children: 'children',
		        }
		    };
	    },
		mounted: function() {
		}
	}
</script>

<style>
</style>