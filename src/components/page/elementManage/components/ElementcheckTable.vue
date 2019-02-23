<template>
	<div class="container">
		<div class="handle-box">
			<div class="demo-input-suffix">
				学科：
				<el-input v-model="select_word" placeholder="" clearable class="handle-input-sm m-r-10"></el-input>
			</div>
			<div class="demo-input-suffix">
				科类：
				<el-input v-model="select_word" placeholder="" clearable class="handle-input-sm m-r-10"></el-input>
			</div>
			<div class="demo-input-suffix">
				知识元名称：
				<el-input v-model="select_word" placeholder="" clearable class="handle-input-md m-r-10"></el-input>
			</div>
			<div class="demo-input-suffix">
				创建时间：
				<el-date-picker
			      v-model="form.date"
			      value-format="yyyy-MM-dd"
			      type="date"
			      placeholder="选择日期"
			      class="m-r-10">
			    </el-date-picker>
			</div>
			<el-select v-model="select_cate" placeholder="状态" class="handle-select m-r-10">
                <el-option key="1" label="已审核" value="已审核"></el-option>
                <el-option key="2" label="未审核" value="未审核"></el-option>
            </el-select>
	        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border class="table" stripe ref="multipleTable" @selection-change="handleSelectionChange">
            <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
            <el-table-column prop="id" label="序号" width="50"><!--sortable--> 
            </el-table-column>
            <el-table-column prop="courseName" label="学科" >
            </el-table-column>
            <el-table-column prop="category" label="科类" >
            </el-table-column>
            <el-table-column prop="name" label="名称" width="180">
            </el-table-column>
            <el-table-column prop="creator" label="创建人" >
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180">
            </el-table-column>
            <el-table-column prop="auditStatusName" label="审核状态" >
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="190" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">上架</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
            </el-pagination>
        </div>
        
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="120px">
            	<el-row :gutter="20">
            		<el-col :span="12">
		                <el-form-item label="知识元名称">
		                    <el-input v-model="form.name"></el-input>
		                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="体系类型">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="学科">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="科类">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="审核状态">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="上架状态">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="创建人">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="创建日期">
	                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="审核人">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="审核日期">
	                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
	                </el-form-item>
	                </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
	export default{
		name: "systemcheckTable",
		data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    address: ''
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.category.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.category.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.get("/api/app/knowledgeTree/list",{
                    params:{
		    			"courseId": 1, // 学科ID
		    			"parentId": 0, // 父节点ID，顶级父节点传0
		    			"beginTime": "", // 开始日期，没有则传空字符串或不传
		    			"endTime": "", // 结束日期，没有则传空字符串或不传
		    			"name": "", // 知识元名称，没有则传空字符串或不传
		    			"category": "", // 学科类型，没有则传空字符串或不传
		    			"auditStatus": "", // 审核状态，没有则传空字符串或不传
		    			"shelfStatus": "", // 上架状态，没有则传空字符串或不传
		    			"rows": 25, // 每页记录数，默认为25
						"page": 1 // 当前页码
		    		}
                }).then((res) => {
                    this.tableData = res.data.data.rows;
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleCheck(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
        }
	}
</script>

<style>
	
</style>