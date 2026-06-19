# ROS2 TurtleBot3 / Gazebo / Nav2 导航

## 操作记录

1. 安装 Gazebo、TurtleBot3、SLAM Toolbox 和 Nav2。
2. 启动 TurtleBot3 仿真世界。
3. 启动 SLAM Toolbox 在线建图。
4. 保存地图为 pgm/yaml 文件。
5. 使用 Nav2 加载地图，设置初始位姿和目标点。

## 遇到的问题

- TurtleBot3 模型变量和 Gazebo 模型路径要正确设置。
- use_sim_time 参数需要保持一致。
- RViz 初始位姿不准会影响导航效果。

## 后续

- 尝试迁移到真实小车平台。
- 加入视觉或雷达感知。
