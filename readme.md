## 登入MXView，透過API Key Management 建立API token
* API 查詢Header都要帶token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjUwMzYwNTU5LCJleHAiOjE2NTAzNjIzNTksImp0aSI6Ijc4OGZmZDBhOTdhMWYyNTZmZDljYjhlN2JlNWY2MjdkZjA3NzBkYzAifQ.Lpe_tMkeymJqx4F6waKn2LKraIyQ3YoIy7xYCEdB9II
* 若用帳密方式取得短效期 token (30分鐘後失效)，程式結束前必須logout釋放
* 建議使用API Key Management建立
---
## 查站台Id 
 [GET] http://127.0.0.1/api/sites
~~~js
[
  {
    "addons": [
      "wireless"
    ],
    "status": true,
    "license": {
      "status": 0
    },
    "site_id": "5395af66cfb8ce68",
    "severity": 1,
    "site_name": "DavidHYYu-PC",
    "mxview_plus": false,
    "available_addons": [
      "wireless"
    ],
    "site_description": "bbbbbb",
    "role": "master"
  }
]
~~~
---
## 查站台下的設備資訊
 [GET] http://127.0.0.1/api/devices/ip/192.168.127.105/site/5395af66cfb8ce68
~~~js
[
  {
    "device_components": {
      "lldpRemPortId": [
        {
          "display": 2,
          "index": "9.26.1",
          "status": "8"
        },
        {
          "display": 2,
          "index": "40.10.3",
          "status": "8"
        }
      ],
      "lldpRemSysName": [
        {
          "display": 2,
          "index": "9.26.1",
          "status": "--"
        },
        {
          "display": 2,
          "index": "40.10.3",
          "status": "Managed Redundant Switch 01115"
        }
      ]
    }
  }
]
~~~