#!/bin/bash

# 应用名称
APP_NAME="wx-tag-backend-api"
# JAR文件路径（当前目录）
JAR_FILE="./${APP_NAME}.jar"
# 日志目录
LOG_DIR="logs"
# 日志文件
LOG_FILE="${LOG_DIR}/app.log"

# 确保日志目录存在
mkdir -p ${LOG_DIR}

# 检查JAR文件是否存在
if [ ! -f "${JAR_FILE}" ]; then
    echo "错误: JAR文件不存在 - ${JAR_FILE}"
    echo "请先构建应用: mvn clean package -DskipTests"
    exit 1
fi

# 启动应用
echo "正在启动应用 ${APP_NAME}..."
echo "使用配置文件: application-prod.yml"

# 使用prod配置启动应用
java -Xms512m -Xmx1024m \
    -Dspring.profiles.active=prod \
    -Dspring.config.location=classpath:/application-prod.yml \
    -jar ${JAR_FILE} \
    > ${LOG_FILE} 2>&1 &

echo "应用已启动，PID: $!"
echo "查看日志: tail -f ${LOG_FILE}" 