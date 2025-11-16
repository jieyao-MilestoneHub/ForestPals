如何启动本地服务器
===================

方法1：使用启动脚本（推荐）
--------------------------
1. 双击运行 start.bat
2. 等待服务器启动
3. 在浏览器打开：http://localhost:5000
4. 按 Ctrl+C 停止服务器

方法2：手动启动
--------------------------
1. 打开命令提示符
2. 进入项目文件夹：
   cd C:\Users\daiyi\OneDrive\桌面\網頁\graduate_web

3. 安装Flask（首次运行）：
   pip install -r requirements.txt

4. 启动服务器：
   python app.py

5. 在浏览器打开：http://localhost:5000

注意事项
--------------------------
- 确保已安装 Python 3.x
- 服务器运行时不要关闭命令窗口
- 现有的所有HTML/CSS/JS代码无需修改，完全兼容
- YouTube影片在localhost下应该可以正常播放
