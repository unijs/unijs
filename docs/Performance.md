#Performance Note
To be able to render your app as fast as possible try to map your route params to your api calls. Do not convert them in any way.

##Do
`:id` and `:time` are placeholders for some kind of id and a timestamp

React-Router URL | API Calls
 --- | ---
/blog/:id | /loadpost/:id
/blog?id=:id | /loadpost/:id
/blog/:id | /loadpost?id=:id
/blog/:id?time=:time | /loadpost?id=id&time=:time

##Do NOT
React-Router URL | API Calls
 --- | ---
/blog/:id/:timeInMillis | /loadpost/:id/:timeInUTC
