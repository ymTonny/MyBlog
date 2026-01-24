// IndexedDB数据库管理
class DatabaseManager {
    constructor() {
        this.dbName = 'ClassPointsDB';
        this.version = 1; // 版本1新增抽奖和兑换奖项表
        this.db = null;
    }

    // 打开数据库
    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // 创建班级表
                if (!db.objectStoreNames.contains('classes')) {
                    const classStore = db.createObjectStore('classes', { keyPath: 'id', autoIncrement: true });
                    classStore.createIndex('name', 'name', { unique: false });
                }

                // 创建学生表
                if (!db.objectStoreNames.contains('students')) {
                    const studentStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
                    studentStore.createIndex('classId', 'classId', { unique: false });
                    studentStore.createIndex('name', 'name', { unique: false });
                    studentStore.createIndex('points', 'points', { unique: false });
                }

                // 创建抽奖奖项表（版本2新增）
                if (!db.objectStoreNames.contains('lotteryPrizes')) {
                    const lotteryStore = db.createObjectStore('lotteryPrizes', { keyPath: 'id', autoIncrement: true });
                    lotteryStore.createIndex('name', 'name', { unique: false });
                    lotteryStore.createIndex('value', 'value', { unique: false });
                }

                // 创建兑换奖项表（版本2新增）
                if (!db.objectStoreNames.contains('rewards')) {
                    const rewardStore = db.createObjectStore('rewards', { keyPath: 'id', autoIncrement: true });
                    rewardStore.createIndex('name', 'name', { unique: false });
                    rewardStore.createIndex('points', 'points', { unique: false });
                }
            };
        });
    }

    // 班级相关操作
    async addClass(className) {
        const transaction = this.db.transaction(['classes'], 'readwrite');
        const store = transaction.objectStore('classes');
        return store.add({ name: className, createdAt: new Date() });
    }

    async getAllClasses() {
        const transaction = this.db.transaction(['classes'], 'readonly');
        const store = transaction.objectStore('classes');
        return new Promise((resolve) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
        });
    }

    async updateClass(classId, newName) {
        const transaction = this.db.transaction(['classes'], 'readwrite');
        const store = transaction.objectStore('classes');
        
        return new Promise((resolve, reject) => {
            const getRequest = store.get(classId);
            getRequest.onsuccess = () => {
                const classItem = getRequest.result;
                if (classItem) {
                    classItem.name = newName;
                    const putRequest = store.put(classItem);
                    putRequest.onsuccess = () => resolve(classItem);
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    reject(new Error('班级不存在'));
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deleteClass(classId) {
        // 先删除该班级的所有学生
        await this.deleteStudentsByClass(classId);
        
        const transaction = this.db.transaction(['classes'], 'readwrite');
        const store = transaction.objectStore('classes');
        return store.delete(classId);
    }

    // 学生相关操作
    async addStudent(classId, studentName, points = 0) {
        const avatar = this.generateAvatar(studentName);
        const transaction = this.db.transaction(['students'], 'readwrite');
        const store = transaction.objectStore('students');
        return store.add({
            classId: classId,
            name: studentName,
            avatar: avatar,
            points: Math.max(0, points), // 确保积分不为负数
            createdAt: new Date()
        });
    }

    async getStudentsByClass(classId) {
        const transaction = this.db.transaction(['students'], 'readonly');
        const store = transaction.objectStore('students');
        const index = store.index('classId');
        return new Promise((resolve) => {
            const request = index.getAll(classId);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async getAllStudents() {
        const transaction = this.db.transaction(['students'], 'readonly');
        const store = transaction.objectStore('students');
        return new Promise((resolve) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
        });
    }

    async updateStudentPoints(studentId, points) {
        const transaction = this.db.transaction(['students'], 'readwrite');
        const store = transaction.objectStore('students');
        
        return new Promise((resolve, reject) => {
            const getRequest = store.get(studentId);
            getRequest.onsuccess = () => {
                const student = getRequest.result;
                if (student) {
                    student.points = Math.max(0, points); // 确保积分不为负数
                    const putRequest = store.put(student);
                    putRequest.onsuccess = () => resolve(student);
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    reject(new Error('学生不存在'));
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deleteStudent(studentId) {
        const transaction = this.db.transaction(['students'], 'readwrite');
        const store = transaction.objectStore('students');
        return store.delete(studentId);
    }

    async deleteStudentsByClass(classId) {
        const students = await this.getStudentsByClass(classId);
        const transaction = this.db.transaction(['students'], 'readwrite');
        const store = transaction.objectStore('students');
        
        students.forEach(student => {
            store.delete(student.id);
        });
        
        return new Promise((resolve) => {
            transaction.oncomplete = () => resolve();
        });
    }

    // 抽奖奖项相关操作
    async addLotteryPrize(name, value) {
        const transaction = this.db.transaction(['lotteryPrizes'], 'readwrite');
        const store = transaction.objectStore('lotteryPrizes');
        return store.add({ name: name, value: parseInt(value), createdAt: new Date() });
    }

    async getAllLotteryPrizes() {
        const transaction = this.db.transaction(['lotteryPrizes'], 'readonly');
        const store = transaction.objectStore('lotteryPrizes');
        return new Promise((resolve) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
        });
    }

    async deleteLotteryPrize(prizeId) {
        const transaction = this.db.transaction(['lotteryPrizes'], 'readwrite');
        const store = transaction.objectStore('lotteryPrizes');
        return store.delete(prizeId);
    }

    // 兑换奖项相关操作
    async addReward(name, points) {
        const transaction = this.db.transaction(['rewards'], 'readwrite');
        const store = transaction.objectStore('rewards');
        return store.add({ name: name, points: parseInt(points), createdAt: new Date() });
    }

    async getAllRewards() {
        const transaction = this.db.transaction(['rewards'], 'readonly');
        const store = transaction.objectStore('rewards');
        return new Promise((resolve) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
        });
    }

    async deleteReward(rewardId) {
        const transaction = this.db.transaction(['rewards'], 'readwrite');
        const store = transaction.objectStore('rewards');
        return store.delete(rewardId);
    }

    // 生成随机卡通头像
    generateAvatar(name) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const initials = name.charAt(0).toUpperCase();
        return { color: color, initials: initials };
    }

    // 搜索学生
    async searchStudents(query) {
        const allStudents = await this.getAllStudents();
        return allStudents.filter(student => 
            student.name.toLowerCase().includes(query.toLowerCase())
        );
    }
}

// 导出数据库管理器实例
window.dbManager = new DatabaseManager();