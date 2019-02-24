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
		        </el-dropdown-menu>
		   </el-dropdown>
		</div>
		<div class="container">
			<el-dropdown class="courses p-tb-10" trigger="click">
				<span class="el-dropdown-link text-color-blue ">
				    {{materialGrade}}<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown" class="material">
					<div class="">
						<label>教材：</label>
						<el-button type="primary" v-if="item.select" v-for="(item,index) in material" :data-id="item.id" @click="selectMaterial(item.id,index)">{{item.materialName}}</el-button>
						<el-button type="text" v-if="!item.select" v-for="(item,index) in material" :data-id="item.id" @click="selectMaterial(item.id,index)">{{item.materialName}}</el-button>
			        </div>
					<div class="">
						<label>年级：</label>
						<el-button type="primary" v-if="item.select" v-for="item in gradeList" :data-id="item.id" @click="selectGrade(item.id,index)">{{item.gradeName}}</el-button>
						<el-button type="text" v-if="!item.select"  v-for="item in gradeList" :data-id="item.id" @click="selectGrade(item.id,index)">{{item.gradeName}}</el-button>
			        </div>
		        </el-dropdown-menu>
		   </el-dropdown>
			<el-tree
			  :data="data"
			  :props="defaultProps"
			  accordion
			  @node-click="handleNodeClick">
			</el-tree>
		</div>
	</div>
</template>

<script>
    import bus from '../../../common/bus';
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
		        }],
		        courses: [], // 学科列表
		        material: [], // 教材列表
		        studyPeriod:'', // 初始默认 学级
		        courseName:'', // 初始默认 学课
		        courseId: null, // 初始默认 学课ID
		        gradeId: null,
		        materialId: null,
		        materialName: '',
		        gradeName: '',
		        gradeList: [],// 年级列表
		        defaultProps: {
		          children: 'children',
		          label: 'label'
		        }
		    };
	    },
	    computed: {
		    studyCourses: function () {
		      return this.studyPeriod + ' ' + this.courseName;
		    },
		    materialGrade: function () {
		      return this.materialName + ' ' + this.gradeName;
		    }
		},
	    methods: {
	      handleNodeClick(data) {
	        let elParam = {
	        	id: data.id,
	        	parentId: data.parentId
	        }
	        bus.$emit('elParam', elParam)
	      },
	      selectCourse(id,courseName,studyPeriod) {
	      	console.log(id)
	      	this.courseId = id;
	      	this.courseName = courseName;
	      	this.studyPeriod = studyPeriod;
	      	this.queryMaterial();
	      	this.queryCoursesData();
	      },
	      selectMaterial(id,index){
          	this.gradeList = this.material[index].grades;
          	for(let i = 0; i <this.material.length; i++){
          		this.material[i].select = false;
          	}
	      	this.material[index].select = true; // 默认选中第一个
          	this.gradeList[0].select = true; // 默认选中第一个
          	this.materialName = this.material[index].materialName;
          	this.gradeName = this.gradeList[0].gradeName;
          	this.gradeId = this.gradeList[0].id;
	        this.materialId = id;
    		this.queryCoursesData(); // 请求树
	      },
	      selectGrade(id,index) {
	      	
	      },
	     queryMaterial() {
	     	// 教材
	     	this.$axios.get('/api/app/study/course/material/tree',{
	    		params:{
	    			"courseId": this.courseId,
	    			"haveGrade": "1"
	    		}
			}).then(res => {
	          	this.material = res.data.data;
	          	res.data.data[0].select = true; // 默认选中第一个
	          	this.gradeList = res.data.data[0].grades;
	          	res.data.data[0].grades[0].select = true; // 默认选中第一个
	          	this.materialName = this.material[0].materialName;
	          	this.gradeName = this.gradeList[0].gradeName;
	          	this.gradeId = this.gradeList[0].id;
		        this.materialId = this.material[0].id;
	    		this.queryCoursesData(); // 请求树
	        });
	     },
	     queryCoursesData() {
	      	// 请求树
	        this.$axios.get('/api/app/architectureTree/tree',{
	    		params:{
	    			"gradeId": this.gradeId,
	    			"materialId": this.materialId,
	    			"courseId": this.courseId
	    		}
			}).then(res => {
//	          	if(res.status == 200 && res.data.code == '0000'){
		          	this.data = res.data.data;
//	          	}
	       	});
	     }
	    },
	    mounted: function () {
	    	// 学科
			this.$axios.get('/api/app/study/period/tree',{
	    		params:{
	    			"haveCourse": "1",
	    			"haveGrade": "0"
	    		}
			}).then(res => {
	          	if(res.status == 200 && res.data.code == '0000'){
//		          	this.courses = JSON.parse(JSON.stringify(res.data.data));
		          	this.courses = res.data.data;
		          	this.courseId = this.courses[0].courses[0].id;
		          	this.studyPeriod = this.courses[0].studyPeriod;
		          	this.courseName = this.courses[0].courses[0].courseName;
		          	this.queryMaterial(); // 请求教材
	          	}
	        });
	        
			
	    }
	}
</script>

<style>
</style>