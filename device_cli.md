## 使用MXView建立CLI指令 
* 建立CLI_Object

![建立CLI_Object](01.png)

* 輸入CLI命令與指定設備

![輸入CLI命令與指定設備](02.png)

---
## 登入MXView，透過API Key Management 建立API token
* API 查詢Header都要帶token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjUwMzYwNTU5LCJleHAiOjE2NTAzNjIzNTksImp0aSI6Ijc4OGZmZDBhOTdhMWYyNTZmZDljYjhlN2JlNWY2MjdkZjA3NzBkYzAifQ.Lpe_tMkeymJqx4F6waKn2LKraIyQ3YoIy7xYCEdB9II
* 若用帳密方式取得短效期 token (30分鐘後失效)，程式結束前必須logout釋放
* 建議使用API Key Management建立

![API Key Management](04.png)

---
## 執行指定CLI命令
 [POST] http://127.0.0.1/api/devices/run_cli_object
 * Request
~~~js
{
  "name": "CLI_Devices_CMD"
}
~~~

 * Response
~~~js
[
    {
        "site_id": "rcnViLqysKIXtdIu",
        "ip": "192.168.4.245",
        "ticket": 13
    },
    {
        "site_id": "rcnViLqysKIXtdIu",
        "ip": "192.168.123.73",
        "ticket": 14
    }
]
~~~

 * WebSocket trigger message
~~~js
[
    "TRIGGER",
    {
        "trigger_detail": {
            "cli_ticket_status": [
                {
                    "site_id": "rcnViLqysKIXtdIu",
                    "ticket": 15,
                    "result": "",
                    "error": ""
                },
                {
                    "site_id": "rcnViLqysKIXtdIu",
                    "ticket": 16,
                    "result": "",
                    "error": ""
                }
            ]
        },
        "trigger_time": 1700451722
    }
]
~~~