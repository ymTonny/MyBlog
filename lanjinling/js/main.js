// 主应用类
class ClassPointsApp {
    constructor() {
        this.currentPage = 'home-page';
        this.currentClass = null;
        this.currentStudent = null;
        this.lotteryPrizes = [];
        this.rewards = [];
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.swipeElement = null;
        this.swipeStartX = 0;
    }

    // 初始化应用
    async init() {
        try {
            // 初始化数据库
            await window.dbManager.open();
            
            // 加载数据
            await this.loadData();
            
            // 设置事件监听器
            this.setupEventListeners();
            
            // 显示首页学生列表
            await this.loadAllStudents();
            
            console.log('应用初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showToast('应用初始化失败，请刷新页面重试', 'error');
        }
    }

    // 显示提示弹窗
    showToast(message, type = 'info', duration = 0) {
        const toastContainer = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;
        
        toastContainer.appendChild(toast);
        
        // 如果设置了持续时间，则自动关闭
        if (duration > 0) {
            const autoClose = setTimeout(() => {
                this.closeToast(toast);
            }, duration);
            
            // 点击关闭时清除自动关闭定时器
            toast.querySelector('.toast-close').addEventListener('click', () => {
                clearTimeout(autoClose);
                this.closeToast(toast);
            });
        } else {
            // 不自动关闭，只支持手动关闭
            toast.querySelector('.toast-close').addEventListener('click', () => {
                this.closeToast(toast);
            });
        }
        
        return toast;
    }

    // 关闭提示弹窗
    closeToast(toast) {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // 显示确认弹窗
    showConfirm(message) {
        return new Promise((resolve) => {
            const confirmModal = document.getElementById('confirm-modal');
            const confirmMessage = document.getElementById('confirm-message');
            const confirmCancel = document.getElementById('confirm-cancel');
            const confirmOk = document.getElementById('confirm-ok');
            
            confirmMessage.textContent = message;
            confirmModal.classList.add('active');
            
            const handleResult = (result) => {
                confirmModal.classList.remove('active');
                confirmCancel.removeEventListener('click', handleCancel);
                confirmOk.removeEventListener('click', handleOk);
                resolve(result);
            };
            
            const handleCancel = () => handleResult(false);
            const handleOk = () => handleResult(true);
            
            confirmCancel.addEventListener('click', handleCancel);
            confirmOk.addEventListener('click', handleOk);
        });
    }

    // 加载数据
    async loadData() {
        this.lotteryPrizes = await window.dbManager.getAllLotteryPrizes();
        this.rewards = await window.dbManager.getAllRewards();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 页面切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.switchPage(page);
            });
        });

        // 搜索功能
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // 添加班级按钮（已移除，班级功能已整合到首页）

        // 添加学生按钮
        document.getElementById('add-student-btn').addEventListener('click', () => {
            this.showAddStudentModal();
        });

        // 返回班级列表（已移除，班级功能已整合到首页）

        // 导出Excel
        document.getElementById('export-excel-btn').addEventListener('click', async () => {
            await this.exportStudentData();
        });

        // 导入Excel
        document.getElementById('import-excel-btn').addEventListener('click', () => {
            this.showImportExcelModal();
        });

        // 抽奖按钮
        document.getElementById('spin-wheel-btn').addEventListener('click', () => {
            this.spinWheel();
        });

        // 添加抽奖奖项按钮
        document.getElementById('add-lottery-prize-btn').addEventListener('click', () => {
            this.showAddLotteryPrizeModal();
        });

        // 添加兑换奖项按钮
        document.getElementById('add-reward-btn').addEventListener('click', () => {
            this.showAddRewardPrizeModal();
        });

        // 添加班级按钮（班级管理页面）
        document.getElementById('add-class-btn').addEventListener('click', () => {
            this.showAddClassModal();
        });

        // 添加班级模态框按钮事件
        const confirmAddClassBtn = document.getElementById('confirm-add-class-btn');
        const cancelAddClassBtn = document.getElementById('cancel-add-class-btn');
        
        if (confirmAddClassBtn && cancelAddClassBtn) {
            confirmAddClassBtn.addEventListener('click', async () => {
                await this.handleAddClass();
            });
            
            cancelAddClassBtn.addEventListener('click', () => {
                this.closeModal('add-class-modal');
            });
        }

        // 班级搜索功能
        document.getElementById('class-search-input').addEventListener('input', (e) => {
            this.handleClassSearch(e.target.value);
        });

        // 滑动删除事件
        document.getElementById('student-list').addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.getElementById('student-list').addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.getElementById('student-list').addEventListener('touchend', this.handleTouchEnd.bind(this));

        // 积分编辑模态框事件
        const pointsModal = document.getElementById('points-modal');
        const pointsCloseBtn = document.querySelector('#points-modal .close');
        const cancelPointsBtn = document.getElementById('cancel-points-btn');
        const confirmPointsBtn = document.getElementById('confirm-points-btn');
        const clearPointsBtn = document.getElementById('clear-points-btn');

        pointsCloseBtn.addEventListener('click', () => this.closePointsModal());
        cancelPointsBtn.addEventListener('click', () => this.closePointsModal());
        confirmPointsBtn.addEventListener('click', () => this.confirmPointsEdit());
        clearPointsBtn.addEventListener('click', () => this.clearPoints());
        
        window.addEventListener('click', (e) => {
            if (e.target === pointsModal) {
                this.closePointsModal();
            }
        });

        // 积分编辑控制
        document.getElementById('minus-points').addEventListener('click', () => {
            const input = document.getElementById('points-input');
            input.value = parseInt(input.value) - 1;
        });

        document.getElementById('plus-points').addEventListener('click', () => {
            const input = document.getElementById('points-input');
            input.value = parseInt(input.value) + 1;
        });

        // 班级模态框事件（已移除，班级功能已整合到首页）

        // 学生模态框事件
        document.getElementById('cancel-add-student-btn').addEventListener('click', () => {
            this.closeModal('add-student-modal');
        });
        
        document.getElementById('confirm-add-student-btn').addEventListener('click', async () => {
            await this.handleAddStudent();
        });

        // 抽奖奖项模态框事件
        document.getElementById('cancel-add-lottery-prize-btn').addEventListener('click', () => {
            this.closeModal('add-lottery-prize-modal');
        });
        
        document.getElementById('confirm-add-lottery-prize-btn').addEventListener('click', async () => {
            await this.handleAddLotteryPrize();
        });

        // 兑换奖项模态框事件
        document.getElementById('cancel-add-reward-prize-btn').addEventListener('click', () => {
            this.closeModal('add-reward-prize-modal');
        });
        
        document.getElementById('confirm-add-reward-prize-btn').addEventListener('click', async () => {
            await this.handleAddRewardPrize();
        });

        // 学生选择模态框事件
        const studentSelectionModal = document.getElementById('student-selection-modal');
        const studentSelectionCloseBtn = document.querySelector('#student-selection-modal .close');
        const cancelStudentSelectionBtn = document.getElementById('cancel-student-selection-btn');
        const studentSelectionSearch = document.getElementById('student-selection-search');

        studentSelectionCloseBtn.addEventListener('click', () => this.closeStudentSelectionModal());
        cancelStudentSelectionBtn.addEventListener('click', () => this.closeStudentSelectionModal());
        
        studentSelectionSearch.addEventListener('input', (e) => {
            this.loadStudentSelectionList(e.target.value);
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === studentSelectionModal) {
                this.closeStudentSelectionModal();
            }
        });

        // 抽奖消耗积分调整事件
        const lotteryCostInput = document.getElementById('lottery-cost-input');
        const lotteryCostDisplay = document.getElementById('lottery-cost-display');
        
        lotteryCostInput.addEventListener('input', (e) => {
            const cost = parseInt(e.target.value) || 10;
            lotteryCostDisplay.textContent = `消耗${cost}积分`;
        });
        
        
        // 查看学生弹窗事件
        const viewStudentsModal = document.getElementById('view-students-modal');
        const viewStudentsCloseBtn = document.querySelector('#view-students-modal .close');
        const closeViewStudentsBtn = document.getElementById('close-view-students-btn');
        const viewStudentsSearch = document.getElementById('view-students-search');
        const addStudentInModalBtn = document.getElementById('add-student-in-modal-btn');

        viewStudentsCloseBtn.addEventListener('click', () => this.closeViewStudentsModal());
        closeViewStudentsBtn.addEventListener('click', () => this.closeViewStudentsModal());
        
        viewStudentsSearch.addEventListener('input', (e) => {
            this.handleViewStudentsSearch(e.target.value);
        });
        
        addStudentInModalBtn.addEventListener('click', () => {
            this.showAddStudentModal();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === viewStudentsModal) {
                this.closeViewStudentsModal();
            }
        });
    }

    // 页面切换
    switchPage(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        document.getElementById(pageId).classList.add('active');

        // 更新导航栏状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        this.currentPage = pageId;

        // 根据页面加载相应数据
        switch (pageId) {
            case 'home-page':
                this.loadAllStudents();
                break;
            case 'lottery-page':
                this.loadLotteryPrizes();
                break;
            case 'rewards-page':
                this.loadRewards();
                break;
            case 'classes-page':
                this.loadClassList();
                break;
        }
    }

    // 加载班级列表
    async loadClassList() {
        try {
            const classes = await window.dbManager.getAllClasses();
            const allStudents = await window.dbManager.getAllStudents();
            
            const classList = document.getElementById('class-list');
            classList.innerHTML = '';

            if (classes.length === 0) {
                classList.innerHTML = '<div class="loading">暂无班级，请点击右上角添加班级</div>';
                return;
            }

            for (const classItem of classes) {
                const classStudents = allStudents.filter(s => s.classId === classItem.id);
                const totalPoints = classStudents.reduce((sum, student) => sum + student.points, 0);

                const classElement = document.createElement('div');
                classElement.className = 'class-item fade-in';
                classElement.innerHTML = `
                    <div class="class-header">
                        <div class="class-name">${classItem.name}</div>
                        <div class="class-stats">${classStudents.length}名学生 | 总积分：${totalPoints}</div>
                    </div>
                    <div style="margin-top: 12px; display: flex; gap: 8px;">
                        <button class="secondary-btn" onclick="app.showViewStudentsModal(${classItem.id})">查看学生</button>
                        <button class="secondary-btn" onclick="app.exportClassData(${classItem.id})">导出</button>
                    </div>
                `;

                classList.appendChild(classElement);
            }
        } catch (error) {
            console.error('加载班级列表失败:', error);
        }
    }

    // 加载所有学生列表（首页）
    async loadAllStudents() {
        try {
            const students = await window.dbManager.getAllStudents();
            const classes = await window.dbManager.getAllClasses();
            
            const studentList = document.getElementById('student-list');
            studentList.innerHTML = '';

            if (students.length === 0) {
                studentList.innerHTML = '<div class="loading">暂无学生，请点击右上角添加学生</div>';
                return;
            }

            for (const student of students) {
                const classItem = classes.find(c => c.id === student.classId);
                const className = classItem ? classItem.name : '未知班级';
                
                const studentElement = document.createElement('div');
                studentElement.className = 'student-item fade-in';
                studentElement.setAttribute('data-student-id', student.id);
                studentElement.innerHTML = `
                    <div class="student-avatar" style="background: ${student.avatar.color}">
                        ${student.avatar.initials}
                    </div>
                    <div class="student-info">
                        <div class="student-name">${student.name}</div>
                        <div class="student-class-info">${className}</div>
                        <div class="student-points">${student.points}积分</div>
                    </div>
                    <button class="edit-points-btn">编辑积分</button>
                    <div class="delete-action" data-student-id="${student.id}">删除</div>
                `;

                studentList.appendChild(studentElement);

                // 添加点击事件
                studentElement.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('edit-points-btn') && !e.target.classList.contains('delete-action')) {
                        this.showPointsModal(student.id);
                    }
                });

                // 编辑按钮事件
                studentElement.querySelector('.edit-points-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showPointsModal(student.id);
                });

                // 删除按钮事件
                studentElement.querySelector('.delete-action').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const studentId = parseInt(e.target.getAttribute('data-student-id'));
                    this.handleDelete(studentElement, studentId);
                });
            }
        } catch (error) {
            console.error('加载所有学生列表失败:', error);
        }
    }

    // 学生搜索功能
    async handleSearch(query) {
        if (!query.trim()) {
            await this.loadAllStudents();
            return;
        }

        try {
            const classes = await window.dbManager.getAllClasses();
            const students = await window.dbManager.getAllStudents();
            const filteredStudents = students.filter(student => 
                student.name.toLowerCase().includes(query.toLowerCase()) ||
                student.id.toString().includes(query)
            );
            
            const studentList = document.getElementById('student-list');
            studentList.innerHTML = '';

            if (filteredStudents.length === 0) {
                studentList.innerHTML = '<div class="loading">未找到匹配的学生</div>';
                return;
            }

            for (const student of filteredStudents) {
                const classItem = classes.find(c => c.id === student.classId);
                const className = classItem ? classItem.name : '未知班级';
                
                const studentElement = document.createElement('div');
                studentElement.className = 'student-item fade-in';
                studentElement.setAttribute('data-student-id', student.id);
                studentElement.innerHTML = `
                    <div class="student-avatar" style="background: ${student.avatar.color}">
                        ${student.avatar.initials}
                    </div>
                    <div class="student-info">
                        <div class="student-name">${student.name}</div>
                        <div class="student-class-info">${className}</div>
                        <div class="student-points">${student.points}积分</div>
                    </div>
                    <button class="edit-points-btn">编辑积分</button>
                    <div class="delete-action" data-student-id="${student.id}">删除</div>
                `;

                studentList.appendChild(studentElement);

                // 添加点击事件
                studentElement.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('edit-points-btn') && !e.target.classList.contains('delete-action')) {
                        this.showPointsModal(student.id);
                    }
                });

                // 编辑按钮事件
                studentElement.querySelector('.edit-points-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showPointsModal(student.id);
                });

                // 删除按钮事件
                studentElement.querySelector('.delete-action').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const studentId = parseInt(e.target.getAttribute('data-student-id'));
                    this.handleDelete(studentElement, studentId);
                });
            }
        } catch (error) {
            console.error('搜索学生失败:', error);
        }
    }

    // 显示学生列表
    async showStudentList(classId) {
        try {
            const classes = await window.dbManager.getAllClasses();
            const classItem = classes.find(c => c.id == classId);
            
            if (!classItem) {
                alert('班级不存在');
                return;
            }

            this.currentClass = classItem;
            document.getElementById('current-class-name').textContent = classItem.name;
            
            const students = await window.dbManager.getStudentsByClass(classId);
            const studentList = document.getElementById('student-list');
            studentList.innerHTML = '';

            if (students.length === 0) {
                studentList.innerHTML = '<div class="loading">暂无学生，请点击右上角添加学生</div>';
                return;
            }

            for (const student of students) {
                const studentElement = document.createElement('div');
                studentElement.className = 'student-item fade-in';
                studentElement.setAttribute('data-student-id', student.id);
                studentElement.innerHTML = `
                    <div class="student-avatar" style="background: ${student.avatar.color}">
                        ${student.avatar.initials}
                    </div>
                    <div class="student-info">
                        <div class="student-name">${student.name}</div>
                        <div class="student-points">${student.points}积分</div>
                    </div>
                    <button class="edit-points-btn">编辑积分</button>
                    <div class="delete-action" data-student-id="${student.id}">删除</div>
                `;

                studentList.appendChild(studentElement);

                // 添加点击事件
                studentElement.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('edit-points-btn') && !e.target.classList.contains('delete-action')) {
                        this.showPointsModal(student.id);
                    }
                });

                // 编辑按钮事件
                studentElement.querySelector('.edit-points-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showPointsModal(student.id);
                });

                // 删除按钮事件
                studentElement.querySelector('.delete-action').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const studentId = parseInt(e.target.getAttribute('data-student-id'));
                    this.handleDelete(studentElement, studentId);
                });
            }

            // 切换到学生列表页面
            this.switchPage('student-list-page');
        } catch (error) {
            console.error('显示学生列表失败:', error);
        }
    }

    // 返回班级列表
    backToClassList() {
        this.currentClass = null;
        this.switchPage('classes-page');
    }

    // 显示查看学生弹窗
    async showViewStudentsModal(classId) {
        try {
            const classes = await window.dbManager.getAllClasses();
            const classItem = classes.find(c => c.id == classId);
            
            if (!classItem) {
                alert('班级不存在');
                return;
            }

            this.currentClass = classItem;
            document.getElementById('view-students-title').textContent = `${classItem.name} - 学生列表`;
            
            await this.loadViewStudentsList();
            this.showModal('view-students-modal');
        } catch (error) {
            console.error('显示查看学生弹窗失败:', error);
        }
    }

    // 加载查看学生弹窗中的学生列表
    async loadViewStudentsList() {
        if (!this.currentClass) return;

        try {
            const students = await window.dbManager.getStudentsByClass(this.currentClass.id);
            const studentList = document.getElementById('view-students-list');
            studentList.innerHTML = '';

            if (students.length === 0) {
                studentList.innerHTML = '<div class="loading">暂无学生，请点击下方添加学生</div>';
                return;
            }

            for (const student of students) {
                const studentElement = document.createElement('div');
                studentElement.className = 'student-item fade-in';
                studentElement.setAttribute('data-student-id', student.id);
                studentElement.innerHTML = `
                    <div class="student-avatar" style="background: ${student.avatar.color}">
                        ${student.avatar.initials}
                    </div>
                    <div class="student-info">
                        <div class="student-name">${student.name}</div>
                        <div class="student-points">${student.points}积分</div>
                    </div>
                    <button class="edit-points-btn">编辑积分</button>
                    <div class="delete-action" data-student-id="${student.id}">删除</div>
                `;

                studentList.appendChild(studentElement);

                // 添加点击事件
                studentElement.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('edit-points-btn') && !e.target.classList.contains('delete-action')) {
                        this.showPointsModal(student.id);
                    }
                });

                // 编辑按钮事件
                studentElement.querySelector('.edit-points-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showPointsModal(student.id);
                });

                // 删除按钮事件
                studentElement.querySelector('.delete-action').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const studentId = parseInt(e.target.getAttribute('data-student-id'));
                    this.handleDelete(studentElement, studentId);
                });
            }
        } catch (error) {
            console.error('加载查看学生列表失败:', error);
        }
    }

    // 查看学生弹窗搜索功能
    async handleViewStudentsSearch(query) {
        if (!this.currentClass) {
            return;
        }

        if (!query.trim()) {
            await this.loadViewStudentsList();
            return;
        }

        try {
            const students = await window.dbManager.getStudentsByClass(this.currentClass.id);
            const filteredStudents = students.filter(student => 
                student.name.toLowerCase().includes(query.toLowerCase())
            );
            
            const studentList = document.getElementById('view-students-list');
            studentList.innerHTML = '';

            if (filteredStudents.length === 0) {
                studentList.innerHTML = '<div class="loading">未找到匹配的学生</div>';
                return;
            }

            for (const student of filteredStudents) {
                const studentElement = document.createElement('div');
                studentElement.className = 'student-item fade-in';
                studentElement.setAttribute('data-student-id', student.id);
                studentElement.innerHTML = `
                    <div class="student-avatar" style="background: ${student.avatar.color}">
                        ${student.avatar.initials}
                    </div>
                    <div class="student-info">
                        <div class="student-name">${student.name}</div>
                        <div class="student-points">${student.points}积分</div>
                    </div>
                    <button class="edit-points-btn">编辑积分</button>
                    <div class="delete-action" data-student-id="${student.id}">删除</div>
                `;

                studentList.appendChild(studentElement);

                // 添加点击事件
                studentElement.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('edit-points-btn') && !e.target.classList.contains('delete-action')) {
                        this.showPointsModal(student.id);
                    }
                });

                // 编辑按钮事件
                studentElement.querySelector('.edit-points-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showPointsModal(student.id);
                });

                // 删除按钮事件
                studentElement.querySelector('.delete-action').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const studentId = parseInt(e.target.getAttribute('data-student-id'));
                    this.handleDelete(studentElement, studentId);
                });
            }
        } catch (error) {
            console.error('查看学生搜索失败:', error);
        }
    }

    // 关闭查看学生弹窗
    closeViewStudentsModal() {
        this.closeModal('view-students-modal');
        this.currentClass = null;
        document.getElementById('view-students-search').value = '';
        this.loadClassList();
    }

    // 显示添加班级模态框
    showAddClassModal() {
        document.getElementById('class-name-input').value = '';
        this.showModal('add-class-modal');
    }

    // 处理添加班级
    async handleAddClass() {
        const className = document.getElementById('class-name-input').value.trim();
        
        if (!className) {
            alert('请输入班级名称');
            return;
        }

        try {
            await window.dbManager.addClass(className);
            this.closeModal('add-class-modal');
            await this.loadClassManagement();
        } catch (error) {
            console.error('添加班级失败:', error);
            alert('添加班级失败');
        }
    }

    // 显示添加学生模态框
    async showAddStudentModal() {
        const classes = await window.dbManager.getAllClasses();
        const select = document.getElementById('student-class-select');
        const classSelectGroup = document.querySelector('#student-class-select').closest('.form-group');
        
        if (classes.length === 0) {
            alert('请先添加班级');
            return;
        }

        // 如果在学生列表页面，自动选择当前班级并隐藏班级选择器
        if (this.currentPage === 'student-list-page' && this.currentClass) {
            classSelectGroup.style.display = 'none';
            // 仍然需要填充选择器，但选择当前班级
            select.innerHTML = '';
            const option = document.createElement('option');
            option.value = this.currentClass.id;
            option.textContent = this.currentClass.name;
            option.selected = true;
            select.appendChild(option);
        } else {
            classSelectGroup.style.display = 'block';
            select.innerHTML = '';
            classes.forEach(classItem => {
                const option = document.createElement('option');
                option.value = classItem.id;
                option.textContent = classItem.name;
                select.appendChild(option);
            });
        }

        document.getElementById('student-name-input').value = '';
        this.showModal('add-student-modal');
    }

    // 处理添加学生
    async handleAddStudent() {
        let classId;
        
        // 如果在学生列表页面，自动选择当前班级
        if (this.currentPage === 'student-list-page' && this.currentClass) {
            classId = this.currentClass.id;
        } else {
            classId = parseInt(document.getElementById('student-class-select').value);
        }
        
        const studentName = document.getElementById('student-name-input').value.trim();
        
        if (!studentName) {
            alert('请输入学生姓名');
            return;
        }

        try {
            await window.dbManager.addStudent(classId, studentName);
            this.closeModal('add-student-modal');
            
            // 根据当前页面刷新列表
            if (this.currentPage === 'home-page') {
                await this.loadAllStudents();
            } else {
                // 如果查看学生弹窗是打开的，刷新弹窗中的学生列表
                const viewStudentsModal = document.getElementById('view-students-modal');
                if (viewStudentsModal.style.display === 'block' && this.currentClass) {
                    await this.loadViewStudentsList();
                }
                // 刷新班级列表
                await this.loadClassList();
            }
        } catch (error) {
            console.error('添加学生失败:', error);
            alert('添加学生失败');
        }
    }

    // 显示积分编辑模态框
    async showPointsModal(studentId) {
        const students = await window.dbManager.getAllStudents();
        const student = students.find(s => s.id === studentId);
        
        if (!student) {
            alert('学生不存在');
            return;
        }

        this.currentStudent = student;
        // 显示当前积分和要调整的积分（初始为0）
        document.getElementById('points-input').value = 0;
        document.getElementById('current-points-display').textContent = `当前积分: ${student.points}`;
        this.showModal('points-modal');
    }

    // 确认积分编辑
    async confirmPointsEdit() {
        const adjustment = parseInt(document.getElementById('points-input').value);
        
        if (isNaN(adjustment)) {
            alert('请输入有效的积分调整数量');
            return;
        }

        try {
            // 计算新的积分：原有积分 + 调整值
            const newPoints = Math.max(0, this.currentStudent.points + adjustment);
            await window.dbManager.updateStudentPoints(this.currentStudent.id, newPoints);
            this.closePointsModal();
            
            // 刷新当前页面
            if (this.currentPage === 'home-page') {
                await this.loadAllStudents();
            } else if (this.currentPage === 'class-list-page') {
                await this.loadClassList();
            } else if (this.currentPage === 'student-list-page' && this.currentClass) {
                await this.showStudentList(this.currentClass.id);
            }
            
            // 如果查看学生弹窗是打开的，刷新弹窗中的学生列表
            const viewStudentsModal = document.getElementById('view-students-modal');
            if (viewStudentsModal.classList.contains('active') && this.currentClass) {
                await this.loadViewStudentsList();
            }
        } catch (error) {
            console.error('更新积分失败:', error);
            alert('更新积分失败');
        }
    }

    // 清除积分
    async clearPoints() {
        if (confirm(`确定要清除${this.currentStudent.name}的积分吗？`)) {
            try {
                await window.dbManager.updateStudentPoints(this.currentStudent.id, 0);
                this.closePointsModal();
                
                // 刷新当前页面
                if (this.currentPage === 'home-page') {
                    await this.loadAllStudents();
                } else if (this.currentPage === 'class-list-page') {
                    await this.loadClassList();
                } else if (this.currentPage === 'student-list-page' && this.currentClass) {
                    await this.showStudentList(this.currentClass.id);
                }
                
                // 如果查看学生弹窗是打开的，刷新弹窗中的学生列表
                const viewStudentsModal = document.getElementById('view-students-modal');
                if (viewStudentsModal.style.display === 'block' && this.currentClass) {
                    await this.loadViewStudentsList();
                }
            } catch (error) {
                console.error('清除积分失败:', error);
                alert('清除积分失败');
            }
        }
    }

    // 关闭积分模态框
    closePointsModal() {
        this.closeModal('points-modal');
        this.currentStudent = null;
    }

    // 导出学生数据
    async exportStudentData() {
        await window.excelExporter.exportStudentData();
    }

    // 导出班级数据
    async exportClassData(classId) {
        await window.excelExporter.exportClassData(classId);
    }

    // 抽奖功能
    async spinWheel() {
        if (this.lotteryPrizes.length === 0) {
            this.showToast('请先添加抽奖项', 'warning');
            return;
        }

        // 显示学生选择模态框
        await this.showStudentSelectionModal('lottery');
    }

    // 执行抽奖
    async executeLottery(student, prize) {
        try {
            // 获取抽奖消耗积分
            const lotteryCost = parseInt(document.getElementById('lottery-cost-input').value) || 10;
            
            // 检查学生积分是否足够
            if (student.points < lotteryCost) {
                this.showToast(`${student.name}的积分不足！当前积分：${student.points}，抽奖需要：${lotteryCost}积分`, 'error');
                return;
            }
            
            // 扣除抽奖消耗积分
            let newPoints = student.points - lotteryCost;
            
            // 如果抽奖项积分值大于0，则增加相应积分
            if (prize.value > 0) {
                newPoints += prize.value;
            }
            
            // 确保积分不低于0
            newPoints = Math.max(0, newPoints);
            
            await window.dbManager.updateStudentPoints(student.id, newPoints);
            
            let message = `恭喜${student.name}！抽中了：${prize.name}`;
            if (prize.value > 0) {
                message += `，获得${prize.value}积分`;
            }
            message += `（消耗${lotteryCost}积分）`;
            this.showToast(message, 'success', 5000);
            
            // 刷新当前页面
            if (this.currentPage === 'class-list-page') {
                await this.loadClassList();
            }
        } catch (error) {
            console.error('抽奖失败:', error);
            this.showToast('抽奖失败', 'error');
        }
    }

    // 加载抽奖项
    async loadLotteryPrizes() {
        const prizeList = document.getElementById('lottery-prize-list');
        const wheelPrizes = document.getElementById('wheel-prizes');
        prizeList.innerHTML = '';
        wheelPrizes.innerHTML = '';

        if (this.lotteryPrizes.length === 0) {
            prizeList.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 20px;">暂无抽奖项</div>';
            wheelPrizes.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 20px;">暂无抽奖项</div>';
            return;
        }

        // 在圆盘中展示抽奖项
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
        const anglePerPrize = 360 / this.lotteryPrizes.length;
        
        // 创建转盘背景渐变
        let gradientStops = '';
        for (let i = 0; i < this.lotteryPrizes.length; i++) {
            const color = colors[i % colors.length];
            const startPercent = (i / this.lotteryPrizes.length) * 100;
            const endPercent = ((i + 1) / this.lotteryPrizes.length) * 100;
            gradientStops += `${color} ${startPercent}%, ${color} ${endPercent}%`;
            if (i < this.lotteryPrizes.length - 1) gradientStops += ', ';
        }
        
        wheelPrizes.style.background = `conic-gradient(${gradientStops})`;
        wheelPrizes.style.borderRadius = '50%';
        
        // 添加奖项文字
        for (let i = 0; i < this.lotteryPrizes.length; i++) {
            const prize = this.lotteryPrizes[i];
            const angle = i * anglePerPrize + anglePerPrize / 2;
            
            const textElement = document.createElement('div');
            textElement.className = 'wheel-prize-text';
            textElement.style.position = 'absolute';
            textElement.style.top = '50%';
            textElement.style.left = '50%';
            textElement.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-90px) rotate(-${angle}deg)`;
            textElement.style.color = 'white';
            textElement.style.fontSize = '12px';
            textElement.style.fontWeight = '600';
            textElement.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
            textElement.style.textAlign = 'center';
            textElement.style.width = '60px';
            textElement.innerHTML = prize.name;
            
            wheelPrizes.appendChild(textElement);

            // 在管理列表中添加奖项
            const prizeElement = document.createElement('div');
            prizeElement.className = 'prize-item';
            prizeElement.innerHTML = `
                <div class="prize-info">
                    <div class="prize-name">${prize.name}</div>
                    <div class="prize-value">${prize.value}积分</div>
                </div>
                <button class="delete-prize-btn" data-prize-id="${prize.id}">删除</button>
            `;
            prizeList.appendChild(prizeElement);

            prizeElement.querySelector('.delete-prize-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                const confirmed = await this.showConfirm('确定要删除这个奖项吗？');
                if (confirmed) {
                    await this.deleteLotteryPrize(prize.id);
                }
            });
        }
    }

    // 显示添加抽奖奖项模态框
    showAddLotteryPrizeModal() {
        document.getElementById('lottery-prize-name').value = '';
        document.getElementById('lottery-prize-value').value = '';
        this.showModal('add-lottery-prize-modal');
    }

    // 处理添加抽奖奖项
    async handleAddLotteryPrize() {
        const name = document.getElementById('lottery-prize-name').value.trim();
        const value = document.getElementById('lottery-prize-value').value;
        
        if (!name || !value) {
            this.showToast('请填写完整的奖项信息', 'warning');
            return;
        }

        try {
            await window.dbManager.addLotteryPrize(name, value);
            await this.loadData();
            this.closeModal('add-lottery-prize-modal');
            await this.loadLotteryPrizes();
            this.showToast('抽奖项添加成功', 'success');
        } catch (error) {
            console.error('添加抽奖项失败:', error);
            this.showToast('添加抽奖项失败', 'error');
        }
    }

    // 删除抽奖项
    async deleteLotteryPrize(prizeId) {
        try {
            await window.dbManager.deleteLotteryPrize(prizeId);
            await this.loadData();
            await this.loadLotteryPrizes();
            this.showToast('抽奖项删除成功', 'success');
        } catch (error) {
            console.error('删除抽奖项失败:', error);
            this.showToast('删除抽奖项失败', 'error');
        }
    }

    // 加载兑换奖品
    async loadRewards() {
        const rewardGrid = document.querySelector('.rewards-grid');
        const rewardList = document.getElementById('reward-list');
        
        rewardGrid.innerHTML = '';
        rewardList.innerHTML = '';

        if (this.rewards.length === 0) {
            rewardGrid.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 40px;">暂无兑换奖品</div>';
            rewardList.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 20px;">暂无兑换奖品</div>';
            return;
        }

        // 显示在网格中
        for (const reward of this.rewards) {
            const rewardElement = document.createElement('div');
            rewardElement.className = 'reward-item';
            rewardElement.innerHTML = `
                <div class="reward-icon">
                    <i class="fas fa-gift"></i>
                </div>
                <div class="reward-name">${reward.name}</div>
                <div class="reward-points">${reward.points}积分</div>
                <button class="redeem-btn" data-reward-id="${reward.id}">兑换</button>
            `;
            rewardGrid.appendChild(rewardElement);

            rewardElement.querySelector('.redeem-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                await this.redeemReward(reward);
            });
        }

        // 显示在管理列表中
        for (const reward of this.rewards) {
            const rewardElement = document.createElement('div');
            rewardElement.className = 'prize-item';
            rewardElement.innerHTML = `
                <div class="prize-info">
                    <div class="prize-name">${reward.name}</div>
                    <div class="prize-value">${reward.points}积分</div>
                </div>
                <button class="delete-prize-btn" data-reward-id="${reward.id}">删除</button>
            `;
            rewardList.appendChild(rewardElement);

            rewardElement.querySelector('.delete-prize-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                const confirmed = await this.showConfirm('确定要删除这个奖品吗？');
                if (confirmed) {
                    await this.deleteReward(reward.id);
                }
            });
        }
    }

    // 显示添加兑换奖品模态框
    showAddRewardPrizeModal() {
        document.getElementById('reward-prize-name').value = '';
        document.getElementById('reward-prize-points').value = '';
        this.showModal('add-reward-prize-modal');
    }

    // 处理添加兑换奖品
    async handleAddRewardPrize() {
        const name = document.getElementById('reward-prize-name').value.trim();
        const points = document.getElementById('reward-prize-points').value;
        
        if (!name || !points) {
            this.showToast('请填写完整的奖品信息', 'warning');
            return;
        }

        try {
            await window.dbManager.addReward(name, points);
            await this.loadData();
            this.closeModal('add-reward-prize-modal');
            await this.loadRewards();
            this.showToast('奖品添加成功', 'success');
        } catch (error) {
            console.error('添加奖品失败:', error);
            this.showToast('添加奖品失败', 'error');
        }
    }

    // 删除奖品
    async deleteReward(rewardId) {
        try {
            await window.dbManager.deleteReward(rewardId);
            await this.loadData();
            await this.loadRewards();
            this.showToast('奖品删除成功', 'success');
        } catch (error) {
            console.error('删除奖品失败:', error);
            this.showToast('删除奖品失败', 'error');
        }
    }

    // 兑换奖品
    async redeemReward(reward) {
        // 显示学生选择模态框
        await this.showStudentSelectionModal('redeem', reward);
    }

    // 执行兑换
    async executeRedeem(student, reward) {
        try {
            if (student.points < reward.points) {
                this.showToast(`${student.name}的积分不足，需要${reward.points}积分，当前只有${student.points}积分`, 'warning');
                return;
            }

            this.showConfirm(
                `确定要为${student.name}兑换${reward.name}吗？将扣除${reward.points}积分`,
                async () => {
                    try {
                        // 扣除积分
                        await window.dbManager.updateStudentPoints(student.id, student.points - reward.points);
                        this.showToast(`兑换成功！已为${student.name}扣除${reward.points}积分`, 'success');
                        
                        // 更新学生积分显示
                        if (this.currentPage === 'class-list-page') {
                            await this.loadClassList();
                        }
                    } catch (error) {
                        console.error('兑换失败:', error);
                        this.showToast('兑换失败', 'error');
                    }
                }
            );
        } catch (error) {
            console.error('兑换失败:', error);
            this.showToast('兑换失败', 'error');
        }
    }

    // 显示学生选择模态框
    async showStudentSelectionModal(action, data = null) {
        this.currentSelectionAction = action;
        this.currentSelectionData = data;
        
        // 设置模态框标题
        const title = document.getElementById('student-selection-title');
        if (action === 'lottery') {
            title.textContent = '选择抽奖学生';
        } else if (action === 'redeem') {
            title.textContent = `选择兑换学生 - ${data.name}（${data.points}积分）`;
        }
        
        // 加载学生列表
        await this.loadStudentSelectionList();
        this.showModal('student-selection-modal');
    }

    // 加载学生选择列表
    async loadStudentSelectionList(query = '') {
        try {
            const students = await window.dbManager.getAllStudents();
            const classes = await window.dbManager.getAllClasses();
            
            const studentList = document.getElementById('student-selection-list');
            studentList.innerHTML = '';

            if (students.length === 0) {
                studentList.innerHTML = '<div class="loading">暂无学生数据</div>';
                return;
            }

            // 过滤学生
            const filteredStudents = students.filter(student => {
                if (!query.trim()) return true;
                return student.name.toLowerCase().includes(query.toLowerCase());
            });

            if (filteredStudents.length === 0) {
                studentList.innerHTML = '<div class="loading">未找到匹配的学生</div>';
                return;
            }

            for (const student of filteredStudents) {
                const classItem = classes.find(c => c.id === student.classId);
                const className = classItem ? classItem.name : '未知班级';
                
                const studentElement = document.createElement('div');
                studentElement.className = 'student-item';
                studentElement.innerHTML = `
                    <div class="student-avatar" style="background: ${student.avatar.color}">
                        ${student.avatar.initials}
                    </div>
                    <div class="student-info">
                        <div class="student-name">${student.name}</div>
                        <div class="student-class-info">${className}</div>
                        <div class="student-points">${student.points}积分</div>
                    </div>
                    <button class="select-student-btn">选择</button>
                `;
                studentList.appendChild(studentElement);

                // 添加选择按钮事件
                studentElement.querySelector('.select-student-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleStudentSelection(student);
                });
            }
        } catch (error) {
            console.error('加载学生选择列表失败:', error);
        }
    }

    // 处理学生选择
    async handleStudentSelection(student) {
        this.closeModal('student-selection-modal');
        
        if (this.currentSelectionAction === 'lottery') {
            // 获取抽奖消耗积分
            const lotteryCost = parseInt(document.getElementById('lottery-cost-input').value) || 10;
            
            // 检查学生积分是否足够
            if (student.points < lotteryCost) {
                this.showToast(`${student.name}的积分不足！当前积分：${student.points}，抽奖需要：${lotteryCost}积分`, 'error');
                
                // 清除选择状态
                this.currentSelectionAction = null;
                this.currentSelectionData = null;
                return;
            }
            
            // 随机选择一个抽奖项
            const randomPrize = this.lotteryPrizes[Math.floor(Math.random() * this.lotteryPrizes.length)];
            
            // 显示抽奖动画
            const wheel = document.querySelector('.wheel');
            const spinBtn = document.getElementById('spin-wheel-btn');
            
            spinBtn.disabled = true;
            wheel.classList.add('spinning');

            // 模拟抽奖过程
            setTimeout(async () => {
                wheel.classList.remove('spinning');
                spinBtn.disabled = false;
                
                // 执行抽奖逻辑（包含积分扣除和奖品积分增加）
                await this.executeLottery(student, randomPrize);
            }, 2000);
            
        } else if (this.currentSelectionAction === 'redeem') {
            await this.executeRedeem(student, this.currentSelectionData);
        }
        
        // 清除选择状态
        this.currentSelectionAction = null;
        this.currentSelectionData = null;
    }

    // 关闭学生选择模态框
    closeStudentSelectionModal() {
        this.closeModal('student-selection-modal');
        this.currentSelectionAction = null;
        this.currentSelectionData = null;
    }

    // 滑动删除功能
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.swipeElement = e.target.closest('.student-item, .class-item');
        this.swipeStartX = 0;
        
        if (this.swipeElement) {
            this.swipeStartX = this.swipeElement.offsetLeft;
        }
    }

    handleTouchMove(e) {
        if (!this.swipeElement) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchX - this.touchStartX;
        const deltaY = touchY - this.touchStartY;

        // 确保是水平滑动
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
            
            if (deltaX < 0) {
                // 向左滑动，显示删除按钮
                const translateX = Math.max(deltaX, -80);
                this.swipeElement.style.transform = `translateX(${translateX}px)`;
                this.swipeElement.classList.add('swiping');
            } else {
                // 向右滑动，恢复原位
                this.swipeElement.style.transform = 'translateX(0px)';
                this.swipeElement.classList.remove('swiping');
            }
        }
    }

    handleTouchEnd(e) {
        if (!this.swipeElement) return;

        const touchX = e.changedTouches[0].clientX;
        const deltaX = touchX - this.touchStartX;

        if (deltaX < -50) {
            // 滑动距离足够，显示删除按钮
            this.swipeElement.style.transform = 'translateX(-80px)';
            this.swipeElement.classList.add('swiped');
        } else {
            // 滑动距离不足，恢复原位
            this.swipeElement.style.transform = 'translateX(0px)';
            this.swipeElement.classList.remove('swiped');
        }

        this.swipeElement = null;
    }

    // 处理删除
    async handleDelete(element, studentId = null) {
        if (studentId === null) {
            studentId = element.getAttribute('data-student-id');
        }
        
        if (studentId) {
            // 删除学生
            const students = await window.dbManager.getAllStudents();
            const student = students.find(s => s.id === parseInt(studentId));
            
            if (student && confirm(`确定要删除学生"${student.name}"吗？`)) {
                try {
                    await window.dbManager.deleteStudent(parseInt(studentId));
                    element.remove();
                    
                    // 刷新显示
                    if (this.currentPage === 'class-list-page') {
                        await this.loadClassList();
                    } else if (this.currentPage === 'student-list-page' && this.currentClass) {
                        await this.showStudentList(this.currentClass.id);
                    }
                } catch (error) {
                    console.error('删除学生失败:', error);
                    alert('删除学生失败');
                }
            } else {
                // 取消删除，恢复原位
                element.style.transform = 'translateX(0px)';
                element.classList.remove('swiped');
            }
        } else {
            // 删除班级（需要从班级名称中提取ID）
            const classNameElement = element.querySelector('.class-name');
            if (classNameElement) {
                const className = classNameElement.textContent;
                const classes = await window.dbManager.getAllClasses();
                const classItem = classes.find(c => c.name === className);
                
                if (classItem && confirm(`确定要删除班级"${className}"及其所有学生吗？`)) {
                    try {
                        await window.dbManager.deleteClass(classItem.id);
                        element.remove();
                        await this.loadClassList();
                    } catch (error) {
                        console.error('删除班级失败:', error);
                        alert('删除班级失败');
                    }
                } else {
                    // 取消删除，恢复原位
                    element.style.transform = 'translateX(0px)';
                    element.classList.remove('swiped');
                }
            }
        }
    }

    // 显示模态框
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    // 关闭模态框
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // 加载班级管理页面
    async loadClassManagement() {
        try {
            const classes = await window.dbManager.getAllClasses();
            const allStudents = await window.dbManager.getAllStudents();
            
            const classList = document.getElementById('class-list');
            classList.innerHTML = '';

            if (classes.length === 0) {
                classList.innerHTML = `
                    <div class="empty-classes">
                        <i class="fas fa-users"></i>
                        <p>暂无班级数据</p>
                        <p>点击"添加班级"按钮创建第一个班级</p>
                        <button class="primary-btn" onclick="app.showAddClassModal()">
                            <i class="fas fa-plus"></i> 添加班级
                        </button>
                    </div>
                `;
                return;
            }

            for (const classItem of classes) {
                const classStudents = allStudents.filter(s => s.classId === classItem.id);
                const totalPoints = classStudents.reduce((sum, student) => sum + student.points, 0);

                const classElement = document.createElement('div');
                classElement.className = 'class-management-item fade-in';
                classElement.innerHTML = `
                    <div class="class-info">
                        <div class="class-name-large">${classItem.name}</div>
                        <div class="class-stats">
                            ${classStudents.length}名学生 | 总积分：${totalPoints}
                        </div>
                    </div>
                    <div class="class-actions">
                        <button class="edit-class-btn" data-class-id="${classItem.id}">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                        <button class="delete-class-btn" data-class-id="${classItem.id}">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </div>
                `;

                classList.appendChild(classElement);

                // 为编辑按钮添加事件监听器
                classElement.querySelector('.edit-class-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const classId = parseInt(e.target.getAttribute('data-class-id') || e.target.parentElement.getAttribute('data-class-id'));
                    this.showEditClassModal(classId);
                });

                // 为删除按钮添加事件监听器
                classElement.querySelector('.delete-class-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const classId = parseInt(e.target.getAttribute('data-class-id') || e.target.parentElement.getAttribute('data-class-id'));
                    this.deleteClass(classId);
                });
            }
        } catch (error) {
            console.error('加载班级管理页面失败:', error);
            classList.innerHTML = '<div class="loading">加载失败，请刷新页面</div>';
        }
    }

    // 显示添加班级模态框
    showAddClassModal() {
        document.getElementById('class-name-input').value = '';
        this.showModal('add-class-modal');
    }

    // 显示编辑班级模态框
    async showEditClassModal(classId) {
        const classes = await window.dbManager.getAllClasses();
        const classItem = classes.find(c => c.id === classId);
        
        if (!classItem) {
            alert('班级不存在');
            return;
        }

        // 创建编辑班级模态框（如果不存在）
        if (!document.getElementById('edit-class-modal')) {
            const modal = document.createElement('div');
            modal.id = 'edit-class-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>编辑班级</h3>
                    <div class="form-group">
                        <label for="edit-class-name-input">班级名称</label>
                        <input type="text" id="edit-class-name-input" placeholder="例如：三年级(1)班">
                    </div>
                    <div class="modal-actions">
                        <button id="cancel-edit-class-btn" class="secondary-btn">取消</button>
                        <button id="confirm-edit-class-btn" class="primary-btn">确定</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // 添加事件监听器
            document.getElementById('cancel-edit-class-btn').addEventListener('click', () => {
                this.closeModal('edit-class-modal');
            });
            
            document.getElementById('confirm-edit-class-btn').addEventListener('click', async () => {
                await this.handleEditClass();
            });
        }

        document.getElementById('edit-class-name-input').value = classItem.name;
        this.currentEditingClass = classItem;
        this.showModal('edit-class-modal');
    }

    // 处理编辑班级
    async handleEditClass() {
        const className = document.getElementById('edit-class-name-input').value.trim();
        
        if (!className) {
            alert('请输入班级名称');
            return;
        }

        try {
            await window.dbManager.updateClass(this.currentEditingClass.id, className);
            this.closeModal('edit-class-modal');
            await this.loadClassManagement();
        } catch (error) {
            console.error('编辑班级失败:', error);
            alert('编辑班级失败');
        }
    }

    // 删除班级
    async deleteClass(classId) {
        const classes = await window.dbManager.getAllClasses();
        const classItem = classes.find(c => c.id === classId);
        
        if (!classItem) {
            alert('班级不存在');
            return;
        }

        const allStudents = await window.dbManager.getAllStudents();
        const classStudents = allStudents.filter(s => s.classId === classId);

        if (classStudents.length > 0) {
            if (!confirm(`确定要删除班级"${classItem.name}"及其${classStudents.length}名学生吗？此操作不可恢复！`)) {
                return;
            }
        } else {
            if (!confirm(`确定要删除班级"${classItem.name}"吗？`)) {
                return;
            }
        }

        try {
            await window.dbManager.deleteClass(classId);
            await this.loadClassManagement();
            alert('删除班级成功');
        } catch (error) {
            console.error('删除班级失败:', error);
            alert('删除班级失败');
        }
    }

    // 班级搜索功能
    async handleClassSearch(query) {
        if (!query.trim()) {
            await this.loadClassManagement();
            return;
        }

        try {
            const classes = await window.dbManager.getAllClasses();
            const filteredClasses = classes.filter(classItem => 
                classItem.name.toLowerCase().includes(query.toLowerCase())
            );
            
            const classList = document.getElementById('class-list');
            classList.innerHTML = '';

            if (filteredClasses.length === 0) {
                classList.innerHTML = '<div class="loading">未找到匹配的班级</div>';
                return;
            }

            const allStudents = await window.dbManager.getAllStudents();
            
            for (const classItem of filteredClasses) {
                const classStudents = allStudents.filter(s => s.classId === classItem.id);
                const totalPoints = classStudents.reduce((sum, student) => sum + student.points, 0);

                const classElement = document.createElement('div');
                classElement.className = 'class-management-item fade-in';
                classElement.innerHTML = `
                    <div class="class-info">
                        <div class="class-name-large">${classItem.name}</div>
                        <div class="class-stats">
                            ${classStudents.length}名学生 | 总积分：${totalPoints}
                        </div>
                    </div>
                    <div class="class-actions">
                        <button class="edit-class-btn" data-class-id="${classItem.id}">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                        <button class="delete-class-btn" data-class-id="${classItem.id}">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </div>
                `;

                classList.appendChild(classElement);

                // 为按钮添加事件监听器
                classElement.querySelector('.edit-class-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const classId = parseInt(e.target.getAttribute('data-class-id') || e.target.parentElement.getAttribute('data-class-id'));
                    this.showEditClassModal(classId);
                });

                classElement.querySelector('.delete-class-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const classId = parseInt(e.target.getAttribute('data-class-id') || e.target.parentElement.getAttribute('data-class-id'));
                    this.deleteClass(classId);
                });
            }
        } catch (error) {
            console.error('班级搜索失败:', error);
        }
    }

    // 显示导入Excel模态框
    showImportExcelModal() {
        // 重置模态框状态
        const fileInfo = document.getElementById('file-info');
        const importFileInput = document.getElementById('excel-file-input');
        const uploadArea = document.getElementById('excel-upload-area');
        const filterExistingCheckbox = document.getElementById('filter-existing-checkbox');
        const confirmImportBtn = document.getElementById('confirm-import-btn');
        const cancelImportBtn = document.getElementById('cancel-import-btn');
        
        fileInfo.style.display = 'none';
        fileInfo.innerHTML = '<div class="file-info-placeholder">请选择Excel文件</div>';
        importFileInput.value = '';
        filterExistingCheckbox.checked = true;
        confirmImportBtn.disabled = true;
        
        // 使用一次性事件绑定 - 直接替换onclick属性
        uploadArea.onclick = () => {
            importFileInput.click();
        };
        
        // 文件选择事件 - 使用一次性绑定
        importFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // 显示文件信息区域
                fileInfo.style.display = 'block';
                fileInfo.innerHTML = `
                    <div class="file-info-selected">
                        <i class="fas fa-file-excel"></i>
                        <div class="file-details">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${this.formatFileSize(file.size)}</div>
                        </div>
                        <button class="remove-file-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                confirmImportBtn.disabled = false;
                
                // 添加移除文件功能
                fileInfo.querySelector('.remove-file-btn').addEventListener('click', (event) => {
                    event.stopPropagation();
                    importFileInput.value = '';
                    fileInfo.style.display = 'none';
                    fileInfo.innerHTML = '<div class="file-info-placeholder">请选择Excel文件</div>';
                    confirmImportBtn.disabled = true;
                });
            }
        };
        
        // 确认导入按钮事件 - 使用一次性绑定
        confirmImportBtn.onclick = () => {
            this.handleImportExcel();
        };
        
        // 取消按钮事件 - 使用一次性绑定
        cancelImportBtn.onclick = () => {
            this.closeModal('import-excel-modal');
        };
        
        this.showModal('import-excel-modal');
    }

    // 处理Excel导入
    async handleImportExcel() {
        const fileInput = document.getElementById('excel-file-input');
        const filterExisting = document.getElementById('filter-existing-checkbox').checked;
        
        if (!fileInput.files || fileInput.files.length === 0) {
            this.showToast('请选择Excel文件', 'error');
            return;
        }

        const file = fileInput.files[0];
        
        // 验证文件类型
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            this.showToast('请选择Excel文件(.xlsx或.xls格式)', 'error');
            return;
        }

        try {
            // 显示加载状态
            const confirmImportBtn = document.querySelector('#confirm-import-btn');
            const originalText = confirmImportBtn.innerHTML;
            confirmImportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 导入中...';
            confirmImportBtn.disabled = true;

            // 执行导入
            const results = await window.excelExporter.importStudentData(file, filterExisting);
            
            // 恢复按钮状态
            confirmImportBtn.innerHTML = originalText;
            confirmImportBtn.disabled = false;

            // 显示导入结果
            this.showImportResults(results);
            
            // 关闭模态框
            this.closeModal('import-excel-modal');
            
            // 刷新页面数据
            if (this.currentPage === 'classes-page') {
                await this.loadClassList();
            } else {
                await this.loadData();
            }
            
        } catch (error) {
            console.error('导入失败:', error);
            this.showToast(`导入失败：${error}`, 'error');
            
            // 恢复按钮状态
            const confirmImportBtn = document.querySelector('#confirm-import-btn');
            confirmImportBtn.innerHTML = '确认导入';
            confirmImportBtn.disabled = false;
        }
    }

    // 显示导入结果
    showImportResults(results) {
        const message = `
            导入完成！
            总计：${results.total}条记录
            成功导入：${results.imported}条
            跳过重复：${results.skipped}条
            错误：${results.errors}条
        `;
        
        this.showToast(message, 'success');
        
        // 如果有错误详情，可以显示详细日志
        if (results.errors > 0) {
            console.log('导入错误详情:', results.details.filter(d => d.status === '错误'));
        }
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// 应用初始化
window.addEventListener('DOMContentLoaded', () => {
    window.app = new ClassPointsApp();
    window.app.init();
});