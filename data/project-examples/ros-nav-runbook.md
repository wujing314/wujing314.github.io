# ROS2 TurtleBot3 Nav2 跑通实例

## 目标

跑通仿真建图、地图保存、定位和目标点导航流程。

## 启动流程

1. 设置 TurtleBot3 模型：

```bash
export TURTLEBOT3_MODEL=waffle
```

2. 启动 Gazebo 仿真：

```bash
ros2 launch turtlebot3_gazebo turtlebot3_world.launch.py
```

3. 启动 SLAM：

```bash
ros2 launch slam_toolbox online_async_launch.py use_sim_time:=True
```

4. 保存地图：

```bash
ros2 run nav2_map_server map_saver_cli -f ~/my_map
```

5. 启动 Nav2：

```bash
ros2 launch turtlebot3_navigation2 navigation2.launch.py map:=$HOME/my_map.yaml use_sim_time:=True
```

## 常见问题

- RViz 里要先用 2D Pose Estimate 设置初始位姿。
- `use_sim_time` 不一致会导致定位和导航异常。
- 地图路径写错时 Nav2 会启动失败。
