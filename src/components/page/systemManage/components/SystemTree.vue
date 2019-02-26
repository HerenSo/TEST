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
						<label>分册：</label>
						<el-button type="primary" v-if="item.select" v-for="item in fasciclesList" :data-id="item.id" @click="selectFascicle(item.id,index)">{{item.fascicleName}}</el-button>
						<el-button type="text" v-if="!item.select"  v-for="item in fasciclesList" :data-id="item.id" @click="selectFascicle(item.id,index)">{{item.fascicleName}}</el-button>
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
		        studyId: '',
		        courseName:'', // 初始默认 学课
		        courseId: null, // 初始默认 学课ID
		        fasciclesId: null,
		        materialId: null,
		        materialName: '',
		        fasciclesName: '',
		        fasciclesList: [],// 教材列表
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
		    },
		    materialGrade: function () {
		    	console.log(this.materialName + ' ' + this.fasciclesName)
		        return this.materialName + ' ' + this.fasciclesName;
		    }
		},
	    methods: {
	    	handleChange(value) {
		        console.log(value);
		        this.courseId = value[value.length-1];
//		        this.studyPeriod = this.courses[0].studyPeriod;
//	          	this.courseName = this.courses[0].courses[0].courseName;
	      		this.queryMaterial();
		      	this.queryCoursesData();
		    },
	      	handleNodeClick(data) {
		        let elParam = {
		        	id: data.id,
		        	parentId: data.parentId,
		        	materialId: this.materialId,
		        	gradeId: this.fasciclesId
		        }
		        bus.$emit('elParam', elParam);
	      	},
//	      	selectCourse(id,courseName,studyPeriod) {
////	      		console.log(id)
//		      	this.courseId = id;
//		      	this.courseName = courseName;
//		      	this.studyPeriod = studyPeriod;
//		      	this.queryMaterial();
//		      	this.queryCoursesData();
//	      	},
	      	selectMaterial(id,index){
	          	this.fasciclesList = this.material[index].fascicles;
	          	for(let i = 0; i <this.material.length; i++){
	          		this.material[i].select = false;
	          	}
		      	this.material[index].select = true; // 默认选中第一个
	          	this.fasciclesList[0].select = true; // 默认选中第一个
	          	this.materialName = this.material[index].materialName;
	          	this.fasciclesName = this.fasciclesList[0].fasciclesName;
	          	this.fasciclesId = this.fasciclesList[0].id;
		        this.materialId = id;
	    		this.queryCoursesData(); // 请求树
	      	},
	      	selectFascicle(id,index) {
	      	
	      	},
	     	queryMaterial() {
		     	// 教材
		     	this.$axios.get('/api/app/study/course/material/tree',{
		    		params:{
		    			"courseId": this.courseId,
		    			"haveFascicle": "1"
		    		}
				}).then(res => {
					if(res.status == 200 && res.data.code == '0000'){
			          	this.material = res.data.data;
			          	if(this.material.length > 0){
			          		res.data.data[0].select = true; // 默认选中第一个
				        	this.materialId = this.material[0].id;
				          	this.materialName = this.material[0].materialName;
			          		this.fasciclesList = this.material[0].fascicles;
			          	}
			          	if(this.fasciclesList.length > 0){
			          		this.fasciclesList[0].select = true; // 默认选中第一个
				          	this.fasciclesName = this.fasciclesList[0].fascicleName;
				          	this.fasciclesId = this.fasciclesList[0].id;
			          	}
			    		this.queryCoursesData(); // 请求树
			    	}
		        });
	     	},
	     	queryCoursesData() {
		      	// 请求树
		        this.$axios.get('/api/app/architectureTree/tree',{
		    		params:{
		    			"gradeId": this.fasciclesId || 1,
		    			"materialId": this.materialId,
		    			"courseId": this.courseId
		    		}
				}).then(res => {
		          	if(res.status == 200 && res.data.code == '0000'){
			          	this.data = res.data.data;
	//		          	console.log(this.data);
			          	let data = {
			          		id:this.data[0].id,
			          		parentId:this.data[0].parentId
			          	}
	//		          	console.log(this.data)
			          	this.handleNodeClick(data);
		          	}
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
		          	this.queryMaterial(); // 请求教材
	          	}
	        });
	        
			
	    }
	}
</script>

<style>
</style>