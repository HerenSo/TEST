<template>
	<div class="container">
        <div class="test_list">
        	<ul>
				
				<el-card>
					<div class="test_content">
						<div class="test_html" v-html="question.questionHtml" v-if="question.questionHtml"></div>
					</div>
					<div class="test_info">
						<span>难度系数:{{question.diffculty}}</span><span>使用次数:{{question.dataStatus}}</span><span>题型:{{question.questionTypeName}}</span><span>更新:{{question.updateTime}}</span>
					</div>
				</el-card>
				<h4 style="padding-top: 20px;">变式题列表
					<el-button type="danger" icon="el-icon-delete" @click="allDelete" style="margin-left: 20px;" v-if="tableData.length > 0">全部删除</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="add" style="margin-left: 20px;">去绑定</el-button>
				</h4>
        		<li v-for="item in tableData" v-if="tableData.length > 0">
        			<div class="test_content">
        				<div class="test_html" v-html="item.questionHtml" ref="item.id" id="item.id"></div>
        			</div>
        			<div class="test_info">
        				<span>难度系数:{{item.diffculty}}</span><span>使用次数:{{item.dataStatus}}</span><span>题型:{{item.questionTypeName}}</span><span>更新:{{item.updateTime}}</span>
        				<div class="handle">
                    		<el-button type="text" class="text-color-danger" icon="el-icon-lx-delete" @click="handleDelete(item.id)">删除</el-button>
        				</div>
        			</div>
        		</li>
        	</ul>
        	<div class="text-center p-tb-20" v-if="tableData.length === 0">暂无数据</div>
        </div>
        
         <!-- 绑定弹出框 -->
        <el-dialog title="绑定变式题" :visible.sync="addVisible" width="80%" top="40px" :before-close="closeAddVisible">
            <test-select ref="testSelect"></test-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddVisible">取 消</el-button>
                <el-button type="primary" @click="sureAdd" >确 定</el-button>
            </span>
        </el-dialog>
         <!-- 删除弹出框 -->
        <el-dialog title="删除" :visible.sync="delVisible" width="40%">
            	<el-row :gutter="20">
            		<el-col :span="12"> 确定删除吗？</el-col>
               </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureDel" >确 定</el-button>
            </span>
        </el-dialog>
        
	</div>
</template>
<script>
    import bus from '../../../common/bus';
	import TestSelect from './TestSelect.vue';
	export default{
		name: "VariantList",
		components: {
			TestSelect
		},
		data() {
            return {
				questionId: '', // 试题ID
				question: {},
                tableData: [],
                del_list: [], // 删除ID
                delVisible: false, // 控制删除弹窗
				addVisible: false,
				variantQuestionId: '',
            }
        },
		created() {
			this.questionId = this.$route.query.id || ''
            bus.$emit('collapse', true)
            bus.$on('selectQuestionId', (val) => {
				console.log(val)
				this.variantQuestionId = val
			})
		},
        mounted() {
			this.getDetails()
     		this.getData();
        },
        methods: {
			// 获取试题详情
			getDetails() {
				this.$axios.get("app/question/message/get",{
					params:{
						"id": this.questionId
					}
				}).then((res) => {
					if(res.status == 200 && res.data.code == '0000'){
						this.question = res.data.data;
					}
				})
			},
            // 获取变式题列表
            getData() {
            	let that = this;
				let hrefUrl = 'app/question/message/variant/list'
				let	params = { questionId: this.questionId }
                this.$axios.get(hrefUrl,{
                    params: params
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
						this.tableData = res.data.data;
	                }
                })
            },
            add() { // 添加
            	this.addVisible = true
            },
			sureAdd() {
            	this.$axios.post("app/question/message/variant/add",{
		    			"variantQuestionId": this.variantQuestionId,
						"questionId":this.questionId
		    		}).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.closeAddVisible()
	                	this.getData();
	                	this.$message.success(res.data.msg);
	                }
                })
			},
            sureDel() {// 确定删除
            	this.$axios.post("app/question/message/variant/delete",{
                    "variantQuestionId": this.del_list,
					"questionId":this.questionId
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.delVisible = false;
	                	this.getData();
	                	this.$message.success(res.data.msg);
	                }
                })
            },
			allDelete() {
				this.$confirm('确定全部删除吗?', '全部删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.post("app/question/message/variant/delete/all",{
						"questionId": this.questionId
					}).then((res) => {
						if(res.status == 200 && res.data.code == '0000'){
	                		this.getData();
							this.$message.success(res.data.msg);
						}
					})
				}).catch(() => {});
			},
            handleDelete(val) { // 删除操作
				this.delVisible = true;
				this.del_list = val;
            },
			closeAddVisible() {
				this.addVisible = false
				this.$refs.testSelect.changeRadio('')
			}
        }
	}
</script>

<style>
	.form{
		font-size: 12px;
		color: #999;
		padding: 18px 0;
	}
	.handle{
		float: right;
	}
    .pagination{
        display: flex;
        justify-content: flex-end;
    }
    .pagination .el-button{
        margin: 2px 5px;
        height: 28px;
        line-height: 28px;
        padding: 0 12px;
    }
</style>