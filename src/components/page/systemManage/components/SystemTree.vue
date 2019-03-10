<template>
	<div>
		<div class="container m-b-20">
			<!--学科-->
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
			  highlight-current
			  :default-expanded-keys="currentKey"
			  auto-expand-parent
			  node-key="id"
			  expand-on-click-node
			  accordion
			  ref="tree"
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
		        data: [], // 知识元树数据
		        courses: [], // 学科列表
		        material: [], // 教材列表
		        studyPeriod:'', // 初始默认 学级
		        studyId: '',
		        courseName:'', // 初始默认 学课
		        courseId: null, // 初始默认 学课ID
		        fascicleId: null, // 分册ID
		        materialId: null, // 教材ID
		        materialName: '', // 教材名称
		        fasciclesName: '', // 分册名称
		        fasciclesList: [],// 教材列表
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
		        currentKey:[] // 当前选中的树节点
		    };
	    },
	    created (){
//			if(!this.$route.meta.isBack){
//			    this.queryCourse();
//			}
//			// 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
//			this.$route.meta.isBack=false
		},
	    mounted: function () {
			this.queryCourse(); // 请求学科
	    },
	    computed: {
		    studyCourses: function () { // 拼接学段学科名称
		      return this.studyPeriod + ' ' + this.courseName;
		    },
		    materialGrade: function () { // 拼接教材分册名称
		        return this.materialName + ' ' + this.fasciclesName;
		    }
		},
	    methods: {
	    	handleChange(value) { // 选学科
		        this.courseId = value[value.length-1];
				for(var i=0;i < this.courses.length;i++){
					for(var j=0;j<this.courses[i].courses.length;j++){
						if(this.courseId == this.courses[i].courses[j].id){
							this.studyPeriod = this.courses[i].studyPeriod;
							this.courseName = this.courses[i].courses[j].courseName;
							break;
						}
					}
				}
	      		this.queryMaterial(); // 请求教材
		    },
	      	selectMaterial(id,index){ // 选择教材
	          	this.fasciclesList = this.material[index].fascicles;
	          	for(let i = 0; i <this.material.length; i++){
	          		this.material[i].select = false;
	          	}
		      	this.material[index].select = true; // 默认选中第一个
	      		for(let j = 0; j <this.fasciclesList.length; j++){
	          		this.fasciclesList[j].select = false;
	          	}
	          	this.fasciclesList[0].select = true; // 默认选中第一个
	          	this.materialName = this.material[index].materialName;
	          	this.fasciclesName = this.fasciclesList[0].fascicleName;
	          	this.fascicleId = this.fasciclesList[0].id;
		        this.materialId = id;
	    		this.queryCoursesData(); // 请求树
	      	},
	      	selectFascicle(id,index) { // 选择分册
	      		for(let i = 0; i <this.fasciclesList.length; i++){
	          		this.fasciclesList[i].select = false;
	          }
	          	this.fasciclesList[index].select = true; // 默认选中第一个
	      		this.fasciclesName = this.fasciclesList[index].fascicleName;
	          	this.fascicleId = this.fasciclesList[index].id;
	    		this.queryCoursesData(); // 请求树
	      	},
	      	handleNodeClick(data) { // 树点击
		        let elParam = {
		        	id: this.courseId,
		        	parentId: data.id,
		        	materialId: this.materialId,
		        	gradeId: this.materialId,
		        	fascicleId:this.fascicleId,
		        	courseName:this.courseName
		        }
		        bus.$emit('elParam', elParam); // 传递参数给table
	      	},
	      	queryCourse() {
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
//			          	let selecteCourse = {
//		          			studyPeriod: this.studyPeriod,
//		          			courseName: this.courseName,
//		          			studyId: this.studyId,
//		          			courseId:this.courseId
//		          		}
//		          		localStorage.setItem("selectedOptions",JSON.stringify(selecteCourse));
				        this.queryMaterial(); // 请求教材
		          	}
		        });
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
				          	this.fascicleId = this.fasciclesList[0].id;
			          	}else{
			          		this.fasciclesName = "暂无";
			          		this.fascicleId = null;
			          	}
			          	console.log("this.fascicleId="+this.fascicleId)
				    	this.queryCoursesData(); // 请求树
			    	}
		        });
	     	},
	     	queryCoursesData() {
		      	// 请求树
		      	if(this.fascicleId){
			        this.$axios.get('app/architectureTree/tree',{
			    		params:{
			    			"fascicleId": this.fascicleId,
			    			"materialId": this.materialId,
			    			"courseId": this.courseId
			    		}
					}).then(res => {
			          	if(res.status == 200 && res.data.code == '0000'){
				          	this.data = res.data.data;
				          	let data = {
				          		id:0 // 初始传 0
	//			          		parentId:this.data[0].parentId
				          	}
				          	this.handleNodeClick(data);// 初始传 0
			          	}
			       	});
		       	}
	     	}
	    }
	}
</script>

<style>
</style>