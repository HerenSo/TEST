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
			<el-dropdown class="courses p-tb-10" trigger="click" placement="bottom-start">
				<span class="el-dropdown-link text-color-blue ">
				    {{materialGrade}}<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown" class="material">
					<div class="">
						<label>教材：</label>
						<el-button type="text" :class="{button_primary:item.select}" v-for="(item,index) in material" :data-id="item.id" @click="selectMaterial(item.id,index)">{{item.materialName}}</el-button>
			        </div>
					<div class="">
						<label>分册：</label>
						<el-button type="text" :class="{button_primary:item.select}" v-for="(item,index) in fasciclesList" :data-id="item.id" @click="selectFascicle(item.id,index)">{{item.fascicleName}}</el-button>
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
		        data: [],
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
	      		this.queryMaterial();
//		      	this.queryCoursesData();
		    },
	      	handleNodeClick(data) {
		        let elParam = {
		        	id: this.courseId,
		        	parentId: data.id,
		        	materialId: this.materialId,
		        	gradeId: this.materialId,
		        	fasciclesId:this.fasciclesId,
		        	courseName:this.courseName
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
	          	console.log(this.fasciclesList)
		      	this.material[index].select = true; // 默认选中第一个
	      		for(let j = 0; j <this.fasciclesList.length; j++){
	          		this.fasciclesList[j].select = false;
	          	}
	          	this.fasciclesList[0].select = true; // 默认选中第一个
	          	this.materialName = this.material[index].materialName;
	          	this.fasciclesName = this.fasciclesList[0].fascicleName;
	          	this.fasciclesId = this.fasciclesList[0].id;
		        this.materialId = id;
	    		this.queryCoursesData(); // 请求树
	      	},
	      	selectFascicle(id,index) {
	      		for(let i = 0; i <this.fasciclesList.length; i++){
	          		this.fasciclesList[i].select = false;
	          }
	          	this.fasciclesList[index].select = true; // 默认选中第一个
	      		this.fasciclesName = this.fasciclesList[index].fascicleName;
	          	this.fasciclesId = this.fasciclesList[index].id;
	    		this.queryCoursesData(); // 请求树
	      	},
	     	queryMaterial() {
		     	// 教材
		     	this.$axios.get('app/study/course/material/tree',{
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
			          	}else{
			          		this.materialName = "暂无";
			          		this.fasciclesList = [];
			          	}
			          	if(this.fasciclesList.length > 0){
			          		this.fasciclesList[0].select = true; // 默认选中第一个
				          	this.fasciclesName = this.fasciclesList[0].fascicleName;
				          	this.fasciclesId = this.fasciclesList[0].id;
			          	}else{
			          		this.fasciclesName = "暂无";
//			          		this.fasciclesId = null;
			          	}
			          	console.log("this.fasciclesId="+this.fasciclesId)
			    		this.queryCoursesData(); // 请求树
			    	}
		        });
	     	},
	     	queryCoursesData() {
		      	// 请求树
		      	if(this.fasciclesId){
			        this.$axios.get('app/architectureTree/tree',{
			    		params:{
			    			"gradeId": this.fasciclesId,
			    			"materialId": this.materialId,
			    			"courseId": this.courseId
			    		}
					}).then(res => {
			          	if(res.status == 200 && res.data.code == '0000'){
				          	this.data = res.data.data;
		//		          	console.log(this.data);
				          	let data = {
				          		id:0 // 初始传 0
	//			          		parentId:this.data[0].parentId
				          	}
		//		          	console.log(this.data)
				          	this.handleNodeClick(data);// 初始传 0
			          	}
			       	});
		       	}
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
		          	this.queryMaterial(); // 请求教材
	          	}
	        });
	        
			
	    }
	}
</script>

<style>
</style>