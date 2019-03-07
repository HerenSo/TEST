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
		<div class="container">
			<el-tree
			  :data="data"
			  :props="defaultProps"
			  node-key="id"
			  default-expand-all
			  highlight-current
			  ref="tree"
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
		        local:"" // 是否缓存学科
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
				let selecteCourse = {
          			studyPeriod: this.studyPeriod,
          			courseName: this.courseName,
          			studyId: value[0],
          			courseId:value[1]
          		}
		        localStorage.setItem("selectedOptions",JSON.stringify(selecteCourse)); // 缓存学科选择状态
		      	this.queryCoursesData(); // 请求树
		    },
	        handleNodeClick(data) { // 树点击
		        let elParam = {
		        	id: this.courseId,
		        	parentId: data.id,
		        	studyCourses: this.studyCourses
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
	      }
	    },
	    mounted: function () {
	    	this.local = this.$route.query.localStorage; // 从子页面传过来，用于判断是否使用缓存
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
		          	if(this.local != 0){ // 判断是否使用缓存
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
		          	}else{
		          		let selecteCourse = JSON.parse(localStorage.getItem("selectedOptions"));
		          		this.courseId = selecteCourse.courseId;
			          	this.studyPeriod = selecteCourse.studyPeriod;
			          	this.studyId = selecteCourse.studyId;
			          	this.courseName = selecteCourse.courseName;
			          	this.selectedOptions = [this.studyId,this.courseId];
		          	}
		          	
		          	this.queryCoursesData(); // 请求树
	          	}
	        });
	        
	    }
	}
</script>

<style>
</style>