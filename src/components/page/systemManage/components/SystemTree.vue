<template>
	<div class="container">
		<div class="text-color-blue p-tb-10">高中化学综合库</div>
		<el-tree
		  :data="data"
		  :props="defaultProps"
		  accordion
		  @node-click="handleNodeClick">
		</el-tree>
	</div>
</template>

<script>
	export default{
		name: 'systemTree',
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
		        }, {
		          label: '一级 2',
		          children: [{
		            label: '二级 2-1',
		            children: [{
		              label: '三级 2-1-1'
		            }]
		          }, {
		            label: '二级 2-2',
		            children: [{
		              label: '三级 2-2-1'
		            }]
		          }]
		        }, {
		          label: '一级 3',
		          children: [{
		            label: '二级 3-1',
		            children: [{
		              label: '三级 3-1-1'
		            }]
		          }, {
		            label: '二级 3-2',
		            children: [{
		              label: '三级 3-2-1'
		            }]
		          }]
		        }, {
		          label: '一级 3',
		          children: [{
		            label: '二级 3-1',
		            children: [{
		              label: '三级 3-1-1'
		            }]
		          }, {
		            label: '二级 3-2',
		            children: [{
		              label: '三级 3-2-1'
		            }]
		          }]
		        }, {
		          label: '一级 3',
		          children: [{
		            label: '二级 3-1',
		            children: [{
		              label: '三级 3-1-1'
		            }]
		          }, {
		            label: '二级 3-2',
		            children: [{
		              label: '三级 3-2-1'
		            }]
		          }]
		        }, {
		          label: '一级 3',
		          children: [{
		            label: '二级 3-1',
		            children: [{
		              label: '三级 3-1-1'
		            }]
		          }, {
		            label: '二级 3-2',
		            children: [{
		              label: '三级 3-2-1'
		            }]
		          }]
		        }],
		        have: {
		        	haveCourse: 1
		        },
		        defaultProps: {
		          children: 'children',
		          label: 'label'
		        }
		    };
	    },
	    methods: {
	      handleNodeClick(data) {
	        console.log(data);
	      }
	    },
	    mounted: function () {
	    	this.$axios.post('/api/app/study/period/tree',{
	          data: this.have,
	          beforeSend: this.global.reqHeader
	        }).then(res => {
	          console.log(res.data);
	          _this.$router.push('/dashboard');
	        }).catch(error => {
	          alert('账号或密码错误');
	          console.log(error);
	        });
	    }
	}
</script>

<style>
</style>