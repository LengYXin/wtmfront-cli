# 配置
``` json
{
    "type": "typescript",                               // 脚本类型 typescript | js
    "frame": "react",                                   // 框架类型 react | vue (开发中)
    "registerHelper": "wtmfront/registerHelper",        // 数据解析函数目录
    "template": "wtmfront/template",                    // 模板目录
    "subMenu": "src/app/subMenu.json",                  // 菜单文件 组件创建自动写入组件信息
    "containers": "src/containers",                     // 组件存放目录
    "api": "......",                                    // api 地址
    "swaggerDoc": "......",                             // swagger docjson 地址
    "standard": {                                       // 标准接口配置
        "search": {                                     // 数据搜索接口
            "name": "search",                           // 接口名称
            "type": "Post"                              // 接口类型
        },
        "details": {                                    // 详情
            "name": "get/{id}",                         // {id} 数据唯一标识参数 自动解析填充
            "type": "Get"
        },
        "install": {                                    // 添加
            "name": "add",
            "type": "Post"
        },
        "update": {                                     // 修改
            "name": "edit",
            "type": "Post"
        },      
        "delete": {                                     // 删除
            "name": "delete",
            "type": "Post"
        },
        "import": {                                     //  导入
            "name": "import",
            "type": "Post"
        },
        "export": {                                     //  导出
            "name": "export",
            "type": "Post"
        },
        "template": {                                   // 模板文件
            "name": "template",
            "type": "Post"
        }
    },
    "publicStandard": [                                 // 公共数据接口 控制器名称
        "common"
    ],
    "excludeStandard": [                                // 排除过滤接口 控制器名称
        "rabbitmq"
    ]
}
```