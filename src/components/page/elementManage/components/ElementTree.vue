<template>
	<div>
		<!--学科-->
		<div class="container m-b-20">
	        <el-cascader
			    expand-trigger="hover"
			    :options="courses"
			    v-model="selectedOptions"
			    :value="studyCourses"
			    :props="props"
			    @change="handleChange">
			</el-cascader>
		</div>
		<!--知识元树-->
		<!--:default-expanded-keys="treeExpandedKeys"-->
			  <!--@node-expand="treeExpand"-->
		<div class="container p-lr-10">
			<el-tree
			  ref="tree"
			  :data="data"
			  :props="defaultProps"
			  highlight-current
			  node-key="id"
			  expand-on-click-node
			  accordion
			  @node-click="handleNodeClick">
			</el-tree>
		</div>
	</div>
</template>

<script>
    import bus from '../../../common/bus';
	export default{
		name: 'elementTree',
		data() {
	      	return {
		        data: [], // 知识元树数据
		        courses: [],// 学科数据
		        studyPeriod:'', // 初始默认 学段
		        studyId: '', // 学段ID
		        courseName:'', // 初始默认 学课
		        courseId: null, // 初始默认 学课ID
		        defaultProps: { // 知识元树数据配置
		          children: 'children',
		          label: 'label'
		        }, 
		        props:{ // 学科数据配置
		        	label:'studyPeriod',
		        	value: 'id',
            		children: 'courses'
		        },
		        selectedOptions:[], // 学段学科选择绑定的ID
		        currentKey:'', // 当前选中的树节点
		        treeExpandedKeys: [] // 当前展开的树节点
		    };
	    },
	    computed: {
		    studyCourses: function () { // 拼接学段学科名称
		      return this.studyPeriod + ' ' + this.courseName;
		    }
		},
	    methods: {
			handleChange(value) { // 选学科
		        this.courseId = value[value.length-1];
		        this.studyPeriod = this.courses[0].studyPeriod;
				for(var i=0;i < this.courses.length;i++){
					for(var j=0;j<this.courses[i].courses.length;j++){
						if(this.courseId == this.courses[i].courses[j].id){
							this.studyPeriod = this.courses[i].studyPeriod;
							this.courseName = this.courses[i].courses[j].courseName;
							break;
						}
					}
				}
		      	this.queryCoursesData(); // 请求树
		    },
	        handleNodeClick(data) { // 树点击
	        	this.currentKey = data.id;
		        let elParam = {
		        	id: this.courseId,
		        	parentId: data.id,
		        	studyCourses: this.studyCourses,
		        	selectedOptions: this.selectedOptions
		        }
		        bus.$emit('elParam', elParam); // 传递参数给table
		    },
	      	queryCoursesData() {
		      	// 请求树
		        this.$axios.get('app/knowledgeTree/tree',{
		    		params:{
		    			"courseId": this.courseId
		    		}
				}).then(res => {
		          	if(res.status == 200 && res.data.code == '0000'){
			          	this.data = res.data.data;
			          	this.handleNodeClick({id:0});// 初始传 0
		          	}
		       });
		    },
		    setCurrentKey(key){
                const store = this.$refs.tree.store;
                const node = store.getNode(key);
                store.setCurrentNode(node);
                this.$refs.tree.currentNode = node;
                store.setCurrentNodeKey(key);
                store.currentNodeKey = key;
//  			data.unfold = true;
                this.$refs.tree.$emit("node-click", node.data, node, this.$refs.tree);
            },
            treeExpand(data, node, self) {
                this.treeExpandedKeys.push(data.id);
            }
	    },
	    mounted: function () {
	    	// 请求学科
			this.$axios.get('app/study/period/tree',{
	    		params:{
	    			"haveCourse": "1",
	    			"haveGrade": "0"
	    		}
			}).then(res => {
	          	if(res.status == 200 && res.data.code == '0000'){
		          	this.courses = res.data.data;
		          	for(var i=0; i < this.courses.length; i++){
		          		for(var j=0; j < this.courses[i].courses.length;j++){
		          			this.courses[i].courses[j].studyPeriod = this.courses[i].courses[j].courseName;
		          		}
		          	}
		          	this.courseId = this.courses[0].courses[0].id;
		          	this.studyPeriod = this.courses[0].studyPeriod;
		          	this.studyId = this.courses[0].id;
		          	this.courseName = this.courses[0].courses[0].courseName;
	          		this.selectedOptions = [this.studyId,this.courseId];
	          		let selecteCourse = {
	          			studyPeriod: this.studyPeriod,
	          			courseName: this.courseName,
	          			studyId: this.studyId,
	          			courseId:this.courseId
	          		}
	          		localStorage.setItem("selectedOptions",JSON.stringify(selecteCourse));
		          	
		          	this.queryCoursesData(); // 请求树
	          	}
	        });
	        
	    },
       	watch: {
			$route: {
				handler: function(val, oldVal){
	        		console.log(this.currentKey)
	        		let currentKey = this.currentKey;
			      	if( val.fullPath == "/elementManage?localStorage=0" || val.fullPath == "/testElement?localStorage=0"){
						this.queryCoursesData(); // 请求树
						this.setCurrentKey(currentKey);
						this.handleNodeClick({id:currentKey})
					}
			    },
			    // 深度观察监听
			    deep: true
			} 
        }
	}
</script>

<style>
	.el-tree{
		overflow-x: scroll;
		min-height: 178px;
	}
	.el-tree-node>.el-tree-node__children{
		overflow:inherit;
	}
</style>