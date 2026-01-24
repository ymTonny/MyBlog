// Excel导出功能
class ExcelExporter {
    constructor() {
        this.dbManager = window.dbManager;
    }

    // 导出所有学生数据
    async exportStudentData() {
        try {
            // 获取所有班级和学生数据
            const classes = await this.dbManager.getAllClasses();
            const allStudents = await this.dbManager.getAllStudents();

            // 创建工作簿
            const wb = XLSX.utils.book_new();

            // 创建学生数据工作表
            const studentData = [
                ['班级名称', '学生姓名', '积分', '创建时间']
            ];

            // 按班级分组学生数据
            for (const classItem of classes) {
                const classStudents = allStudents.filter(student => student.classId === classItem.id);
                for (const student of classStudents) {
                    studentData.push([
                        classItem.name,
                        student.name,
                        student.points,
                        new Date(student.createdAt).toLocaleDateString('zh-CN')
                    ]);
                }
            }

            const ws = XLSX.utils.aoa_to_sheet(studentData);
            XLSX.utils.book_append_sheet(wb, ws, '学生积分数据');

            // 创建班级统计工作表
            const classStats = [
                ['班级名称', '学生人数', '总积分', '平均积分', '最高积分', '最低积分']
            ];

            for (const classItem of classes) {
                const classStudents = allStudents.filter(student => student.classId === classItem.id);
                if (classStudents.length > 0) {
                    const totalPoints = classStudents.reduce((sum, student) => sum + student.points, 0);
                    const avgPoints = Math.round(totalPoints / classStudents.length);
                    const maxPoints = Math.max(...classStudents.map(s => s.points));
                    const minPoints = Math.min(...classStudents.map(s => s.points));

                    classStats.push([
                        classItem.name,
                        classStudents.length,
                        totalPoints,
                        avgPoints,
                        maxPoints,
                        minPoints
                    ]);
                } else {
                    classStats.push([classItem.name, 0, 0, 0, 0, 0]);
                }
            }

            const ws2 = XLSX.utils.aoa_to_sheet(classStats);
            XLSX.utils.book_append_sheet(wb, ws2, '班级统计');

            // 创建抽奖奖项工作表
            const lotteryPrizes = await this.dbManager.getAllLotteryPrizes();
            const prizeData = [
                ['奖项名称', '积分值', '创建时间']
            ];

            for (const prize of lotteryPrizes) {
                prizeData.push([
                    prize.name,
                    prize.value,
                    new Date(prize.createdAt).toLocaleDateString('zh-CN')
                ]);
            }

            const ws3 = XLSX.utils.aoa_to_sheet(prizeData);
            XLSX.utils.book_append_sheet(wb, ws3, '抽奖奖项');

            // 创建兑换奖品工作表
            const rewards = await this.dbManager.getAllRewards();
            const rewardData = [
                ['奖品名称', '所需积分', '创建时间']
            ];

            for (const reward of rewards) {
                rewardData.push([
                    reward.name,
                    reward.points,
                    new Date(reward.createdAt).toLocaleDateString('zh-CN')
                ]);
            }

            const ws4 = XLSX.utils.aoa_to_sheet(rewardData);
            XLSX.utils.book_append_sheet(wb, ws4, '兑换奖品');

            // 导出Excel文件
            const fileName = `班级积分数据_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

            return true;
        } catch (error) {
            console.error('导出Excel失败:', error);
            alert('导出失败，请重试');
            return false;
        }
    }

    // 导出指定班级数据
    async exportClassData(classId) {
        try {
            const classItem = await this.getClassById(classId);
            const students = await this.dbManager.getStudentsByClass(classId);

            const wb = XLSX.utils.book_new();
            
            const data = [
                ['学生姓名', '积分', '创建时间']
            ];

            for (const student of students) {
                data.push([
                    student.name,
                    student.points,
                    new Date(student.createdAt).toLocaleDateString('zh-CN')
                ]);
            }

            const ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, `${classItem.name}学生数据`);

            const fileName = `${classItem.name}_学生数据_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

            return true;
        } catch (error) {
            console.error('导出班级数据失败:', error);
            alert('导出失败，请重试');
            return false;
        }
    }

    // 辅助方法：根据ID获取班级
    async getClassById(classId) {
        const classes = await this.dbManager.getAllClasses();
        return classes.find(c => c.id === classId);
    }

    // 导入Excel学生数据
    async importStudentData(file, filterExisting = true) {
        return new Promise(async (resolve, reject) => {
            try {
                const reader = new FileReader();
                
                reader.onload = async (e) => {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        
                        // 获取第一个工作表
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        
                        // 转换为JSON数据
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        
                        if (jsonData.length < 2) {
                            reject('Excel文件为空或格式不正确');
                            return;
                        }
                        
                        // 获取表头
                        const headers = jsonData[0];
                        const expectedHeaders = ['班级名称', '学生姓名', '积分', '创建时间'];
                        
                        // 验证表头格式
                        if (!this.validateHeaders(headers, expectedHeaders)) {
                            reject('Excel文件格式不正确，请使用导出的模板格式');
                            return;
                        }
                        
                        // 处理数据行
                        const importResults = await this.processImportData(jsonData.slice(1), filterExisting);
                        
                        resolve(importResults);
                    } catch (error) {
                        reject(`导入失败：${error.message}`);
                    }
                };
                
                reader.onerror = () => {
                    reject('文件读取失败');
                };
                
                reader.readAsArrayBuffer(file);
            } catch (error) {
                reject(`导入失败：${error.message}`);
            }
        });
    }

    // 验证Excel表头
    validateHeaders(headers, expectedHeaders) {
        if (headers.length !== expectedHeaders.length) {
            return false;
        }
        
        for (let i = 0; i < headers.length; i++) {
            if (headers[i] !== expectedHeaders[i]) {
                return false;
            }
        }
        
        return true;
    }

    // 处理导入数据
    async processImportData(dataRows, filterExisting) {
        const results = {
            total: 0,
            imported: 0,
            skipped: 0,
            errors: 0,
            details: []
        };
        
        // 获取现有数据用于过滤
        const existingClasses = await this.dbManager.getAllClasses();
        const existingStudents = await this.dbManager.getAllStudents();
        
        for (const row of dataRows) {
            if (!row || row.length < 4) continue;
            
            results.total++;
            
            const [className, studentName, points, createTime] = row;
            
            // 验证数据完整性
            if (!className || !studentName || points === undefined || points === null) {
                results.errors++;
                results.details.push({
                    className,
                    studentName,
                    status: '错误',
                    message: '数据不完整'
                });
                continue;
            }
            
            // 处理现有学生（如果启用过滤）
            const existingClass = existingClasses.find(c => c.name === className);
            if (existingClass) {
                const existingStudent = existingStudents.find(s => 
                    s.classId === existingClass.id && s.name === studentName
                );
                
                if (existingStudent) {
                    if (filterExisting) {
                        // 过滤模式下，跳过已存在学生
                        results.skipped++;
                        results.details.push({
                            className,
                            studentName,
                            status: '跳过',
                            message: '学生已存在'
                        });
                        continue;
                    } else {
                        // 非过滤模式下，更新现有学生的积分
                        try {
                            const pointsValue = parseInt(points) || 0;
                            await this.dbManager.updateStudentPoints(existingStudent.id, pointsValue);
                            
                            results.imported++;
                            results.details.push({
                                className,
                                studentName,
                                status: '更新成功',
                                message: `积分已更新为 ${pointsValue}`
                            });
                            continue;
                        } catch (error) {
                            results.errors++;
                            results.details.push({
                                className,
                                studentName,
                                status: '更新失败',
                                message: `积分更新失败：${error.message}`
                            });
                            continue;
                        }
                    }
                }
            }
            
            try {
                // 处理班级
                let classItem = existingClasses.find(c => c.name === className);
                if (!classItem) {
                    // 创建新班级
                    const classId = await this.dbManager.addClass(className);
                    classItem = { id: classId, name: className };
                    existingClasses.push(classItem);
                }
                
                // 处理学生
                const pointsValue = parseInt(points) || 0;
                await this.dbManager.addStudent(classItem.id, studentName, pointsValue);
                
                results.imported++;
                results.details.push({
                    className,
                    studentName,
                    status: '成功',
                    message: '导入成功'
                });
            } catch (error) {
                results.errors++;
                results.details.push({
                    className,
                    studentName,
                    status: '错误',
                    message: `导入失败：${error.message}`
                });
            }
        }
        
        return results;
    }
}

// 导出Excel导出器实例
window.excelExporter = new ExcelExporter();