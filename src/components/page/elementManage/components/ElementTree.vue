<template>
	<div>
	<div class="container m-b-20">
		<!--<el-dropdown class="courses" trigger="click">
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
	        </el-dropdown-menu>
	   </el-dropdown>-->
        <el-cascader
		    expand-trigger="hover"
		    :options="courses"
		    v-model="selectedOptions"
		    :value="studyCourses"
		    :props="props"
		    @change="handleChange">
		</el-cascader>
	</div>
	<div class="container">
		<!--<div class="text-color-blue p-tb-10">高中化学综合库</div>-->
		<el-tree
		  :data="data"
		  :props="defaultProps"
		  node-key="id"
		  highlight-current
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
		        data: [],
		        courses: [],
		        studyPeriod:'', // 初始默认 学级
		        studyId: '',
		        courseName:'', // 初始默认 学课
		        courseId: null, // 初始默认 学课ID
		        defaultProps: {
		          children: 'children',
		          label: 'label'
		        },
		        props:{
		        	label:'studyPeriod',
		        	value: 'id',
            		children: 'courses'
		        },
		        selectedOptions:[]
		    };
	    },
	    computed: {
		    studyCourses: function () {
		      return this.studyPeriod + ' ' + this.courseName;
		    }
		},
	    methods: {
			handleChange(value) { // 选学科
		        console.log(value);
		        this.courseId = value[value.length-1];
		        console.log("学科ID="+this.courseId);
//		        this.studyPeriod = this.courses[0].studyPeriod;
				for(var i=0;i < this.courses.length;i++){
					for(var j=0;j<this.courses[i].courses.length;j++){
						if(this.courseId == this.courses[i].courses[j].id){
							this.studyPeriod = this.courses[i].studyPeriod;
							this.courseName = this.courses[i].courses[j].courseName;
							break;
						}
					}
				}
//	          	this.courseName = this.courses[0].courses[0].courseName;
		      	this.queryCoursesData();
		    },
	        handleNodeClick(data) { // 树点击
		        let elParam = {
		        	id: this.courseId,
		        	parentId: data.id,
		        	studyCourses: this.courseName
		        }
		        bus.$emit('elParam', elParam);
		    },
//	      selectCourse(id,courseName,studyPeriod) {
//	      	console.log(id)
//	      	this.courseId = id;
//	      	this.courseName = courseName;
//	      	this.studyPeriod = studyPeriod;
//	      	this.queryCoursesData();
//	      },
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
	    	// 学科
			this.$axios.get('app/study/period/tree',{
	    		params:{
	    			"haveCourse": "1",
	    			"haveGrade": "0"
	    		}
			}).then(res => {
	          	if(res.status == 200 && res.data.code == '0000'){
//		          	this.courses = JSON.parse(JSON.stringify(res.data.data));
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
		          	this.queryCoursesData();
	          	}
	        });
	        
	    }
	}
</script>

<style>
</style>