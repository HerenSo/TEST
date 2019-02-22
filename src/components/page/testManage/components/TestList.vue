<template>
	<div class="container">
		<div class="handle-box">
			<div class="demo-input-suffix">
				题型：
				<el-input v-model="select_word" placeholder="" clearable class="handle-input-sm m-r-10"></el-input>
			</div>
			<div class="demo-input-suffix">
				类型：
				<el-input v-model="select_word" placeholder="" clearable class="handle-input-sm m-r-10"></el-input>
			</div>
			<el-select v-model="select_cate" placeholder="难度" class="handle-select m-r-10">
                <el-option key="1" label="低" value="低"></el-option>
                <el-option key="2" label="中" value="中"></el-option>
                <el-option key="3" label="高" value="高"></el-option>
            </el-select>
			<div class="demo-input-suffix">
				年份：
				<el-date-picker
			      v-model="year"
			      type="year"
			      placeholder="选择年">
			    </el-date-picker>
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
	        <el-button type="primary" icon="search" >新增</el-button>
        </div>
        <div class="test_list">
        	<ul>
        		<li v-for="item in data">
        			<div class="test_content">
        				<div>一个农夫带着三只兔到集市上去卖，每只兔大概三四千克，但农夫的秤只能称五千克以上，问他该如何称量</div>
		          		<div class="form">来源：市级联考</div>
        			</div>
        			<div class="test_info">
        				<span>难度系数:{{item.name}}</span><span>使用次数:{{item.name}}</span><span>题型:{{item.name}}</span><span>更新:{{item.date}}</span>
        				<div class="handle">
        					<el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(item.id)">查看</el-button>
                   			<el-button type="text" icon="el-icon-edit" @click="handleEdit(item.id)">编辑</el-button>
                    		<el-button type="text" class="red"  icon="el-icon-delete" @click="handleDelete(item.id)">删除</el-button>
        				</div>
        			</div>
        		</li>
        	</ul>
        </div>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-size="5" layout="prev, pager, next" :total="40">
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
		name: "testList",
		data() {
            return {
                url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                year: '',
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
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
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
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                };
                this.$axios.post(this.url, {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data.list;
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
            handleEdit(index) {
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
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
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
	.form{
		font-size: 12px;
		color: #999;
		padding: 18px 0;
	}
	.handle{
		float: right;
	}
	.test_list ul{
		list-style: none;
	}
	.test_list ul li{
		padding: 25px 0 15px 0;
		border-bottom: 1px solid #ededed;
	}
	.test_list ul li .test_info span{
		padding-right: 20px;
	}
</style>