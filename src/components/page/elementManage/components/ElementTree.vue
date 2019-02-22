<template>
	<div>
	<div class="container m-b-20">
		<el-dropdown class="courses" trigger="click">
			<span class="el-dropdown-link">
			    {{studyCourses}}<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown" class="coursesDropdown">
				<el-dropdown-item class="coursesDropdown_item" v-for="item in courses" :data-studyid="item.id">
					<label>{{item.studyPeriod}}</label>
					<div class="coursesList">
		        		<el-button size="mini" v-for="course in item.courses" :data-courseid="course.id" @click="selectCourse(course.id,course.courseName,item.studyPeriod)">{{course.courseName}}</el-button>
		        	</div>
				</el-dropdown-item>
		        <!--<li class="courses" v-for="item in courses" :data-studyid="item.id">
		        	<label>{{item.studyPeriod}}</label>
		        	<ul>
		        		<li v-for="course in item.courses" :data-courseid="course.id">{{course.courseName}}</li>
		        	</ul>
		        </li>-->
	        </el-dropdown-menu>
	   </el-dropdown>
	</div>
	<div class="container">
		<!--<div class="text-color-blue p-tb-10">高中化学综合库</div>-->
		<el-tree
		  :data="data"
		  :props="defaultProps"
		  node-key="id"
		  accordion
		  @node-click="handleNodeClick">
		</el-tree>
	</div>
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
		        courses: [],
		        studyPeriod:'', // 初始默认 学级
		        courseName:'', // 初始默认 学课
		        courseId: 1, // 初始默认 学课ID
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
	      },
	      selectCourse(id,courseName,studyPeriod) {
	      	console.log(id)
	      	this.courseId = id;
	      	this.courseName = courseName;
	      	this.studyPeriod = studyPeriod;
	      	this.queryCoursesData();
	      },
	      queryCoursesData() {
	      	// 请求树
	        this.$axios.get('/api/app/knowledgeTree/tree',{
	    		params:{
	    			"courseId": this.courseId
	    		},
	    		headers:{
	    			'tokenId':localStorage.getItem("userToken")
	    		}
			}).then(res => {
	          	console.log(JSON.parse(JSON.stringify(res.data.data)));
	          	if(res.status == 200){
		          	this.data = JSON.parse(JSON.stringify(res.data.data));
	          	}
	        }).catch(error => {
	          	this.$message({
		          message: error,
		          type: 'warning'
		        });
	        });
	      }
	    },
	    computed: {
		    studyCourses: function () {
		      return this.studyPeriod + ' ' + this.courseName;
		    }
		},
	    mounted: function () {
	    	this.queryCoursesData();
	    	// 学科
			this.$axios.get('/api/app/study/period/tree',{
	    		params:{
	    			"haveCourse": "1",
	    			"haveGrade": "0"
	    		},
	    		headers:{
	    			'tokenId':localStorage.getItem("userToken")
	    		}
			}).then(res => {
//				this.$message('请求成功');
	          	console.log(JSON.parse(JSON.stringify(res.data.data)));
	          	if(res.status == 200){
		          	this.courses = JSON.parse(JSON.stringify(res.data.data));
		          	this.studyPeriod = this.courses[0].studyPeriod;
		          	this.courseName = this.courses[0].courses[0].courseName;
	        		console.log(this.courses)
	          	}
	        }).catch(error => {
	          	this.$message({
		          message: error.msg,
		          type: 'warning'
		        });
	        });
	        
	    }
	}
</script>

<style>
</style>