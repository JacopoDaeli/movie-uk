
### Create a Welcome Message
```
curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type":"call_to_actions",
  "thread_state":"new_thread",
  "call_to_actions":[
    {
      "message":{
        "text":"Hi! I'm Impero Movie UK Bot. Ask me where you can watch a movie. I will give you information about movies and cinemas in UK."
      }
    }
  ]
}' "https://graph.facebook.com/v2.6/<PAGE_ID>/thread_settings?access_token=<PAGE_ACCESS_TOKEN>"
```
