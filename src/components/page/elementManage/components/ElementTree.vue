<template>
	<div class="container">
		<div class="text-color-blue p-tb-10">高中化学综合库</div>
		<el-tree
		  :data="data"
		  :props="defaultProps"
		  node-key="id"
		  accordion
		  @node-click="handleNodeClick">
		</el-tree>
	</div>
</template>

<script>
	export default{
		name: 'elementTree',
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
		        have: {
		        	haveCourse: 1
		        },
		        defaultProps: {
		          label: 'label',
		          children: 'children',
		        }
		    };
	    },
	    methods: {
	      handleNodeClick(data) {
	        console.log(data);
	      }
	    },
	    mounted: function () {
	    	this.$axios.get('/api/app/knowledgeTree/tree',{
	    		params:{
	    			"courseId": "1"
	    			},
	    		headers:{
	    			'tokenId':localStorage.getItem("userToken")
	    			}
		}).then(res => {
	          console.log(JSON.parse(JSON.stringify(res.data.data)));
	          this.data = JSON.parse(JSON.stringify(res.data.data));
	        }).catch(error => {
	          console.log(error);
	        });
	    }
	}
</script>

<style>
</style>